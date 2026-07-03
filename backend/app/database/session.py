from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from typing import AsyncGenerator
from app.core.config import settings

# Create async database engine. connect_args check_same_thread is SQLite-only.
engine_connect_args = {}
if settings.ASYNC_DATABASE_URL.startswith("sqlite"):
    engine_connect_args["check_same_thread"] = False

engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    connect_args=engine_connect_args,
    echo=False,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
  """Async dependency to yield database sessions to FastAPI endpoints."""
  async with AsyncSessionLocal() as session:
    try:
      yield session
      await session.commit()
    except Exception:
      await session.rollback()
      raise
    finally:
      await session.close()
