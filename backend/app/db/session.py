from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Configure engine. connect_args is only needed for SQLite.
if settings.SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
