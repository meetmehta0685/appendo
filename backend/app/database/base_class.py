import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import DeclarativeBase, declared_attr, Mapped, mapped_column
from sqlalchemy import DateTime, UUID

class Base(DeclarativeBase):
  """SQLAlchemy 2.0 base class for all database models with auto-generated table names."""
  
  @declared_attr.directive
  def __tablename__(cls) -> str:
    # Pluralize table names by default for database consistency
    name = cls.__name__.lower()
    if name.endswith('y'):
      return name[:-1] + 'ies'
    elif name.endswith('s'):
      return name + 'es'
    return name + 's'

class UUIDPrimaryKeyMixin:
  """Mixin to inject UUID primary key, created_at, and updated_at timestamps."""
  id: Mapped[uuid.UUID] = mapped_column(
      UUID(as_uuid=True),
      primary_key=True,
      default=uuid.uuid4,
      index=True
  )
  created_at: Mapped[datetime] = mapped_column(
      DateTime(timezone=True),
      default=lambda: datetime.now(timezone.utc),
      nullable=False
  )
  updated_at: Mapped[datetime] = mapped_column(
      DateTime(timezone=True),
      default=lambda: datetime.now(timezone.utc),
      onupdate=lambda: datetime.now(timezone.utc),
      nullable=False
  )

class SoftDeleteMixin:
  """Mixin to support soft deletion flags in audit-ready tables."""
  deleted_at: Mapped[Optional[datetime]] = mapped_column(
      DateTime(timezone=True),
      nullable=True,
      default=None
  )
