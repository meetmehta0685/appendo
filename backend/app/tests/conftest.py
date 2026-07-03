import asyncio
from typing import AsyncGenerator
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.database.session import get_db
from app.database.base import Base

# Setup async test database (SQLite in-memory)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    future=True
)

TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

@pytest.fixture(scope="session")
def event_loop():
  """Create event loop instance for the duration of the test session."""
  try:
    loop = asyncio.get_running_loop()
  except RuntimeError:
    loop = asyncio.new_event_loop()
  yield loop
  loop.close()

import pytest_asyncio

@pytest_asyncio.fixture(scope="function", autouse=True)
async def init_test_db():
  """Initialize database schemas before running each test case."""
  async with test_engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
  yield
  async with test_engine.begin() as conn:
    await conn.run_sync(Base.metadata.drop_all)

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
  """Dependency override to yield test database sessions."""
  async with TestSessionLocal() as session:
    try:
      yield session
      await session.commit()
    except Exception:
      await session.rollback()
      raise
    finally:
      await session.close()

# Override the app dependency
app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(scope="function")
async def client() -> AsyncGenerator[AsyncClient, None]:
  """Yield async HTTP client connected to the application router."""
  async with AsyncClient(
      transport=ASGITransport(app=app),
      base_url="http://testserver/api/v1"
  ) as ac:
    yield ac
