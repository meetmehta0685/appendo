from sqlalchemy.orm import Mapped, mapped_column
from app.database.base_class import Base

class User(Base):
  """SQLAlchemy 2.0 User model mapping schema."""
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True, index=True)
  email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
  hashed_password: Mapped[str] = mapped_column(nullable=False)
  is_active: Mapped[bool] = mapped_column(default=True)
