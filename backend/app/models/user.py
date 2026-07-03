import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from app.database.base_class import Base, UUIDPrimaryKeyMixin, SoftDeleteMixin

# Association table for User-Role Many-to-Many relationship
class UserRole(Base):
  __tablename__ = "user_roles"
  
  user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
  role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)

class User(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "users"

  email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
  hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
  is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

  # Relationships
  roles: Mapped[List["Role"]] = relationship(secondary="user_roles", back_populates="users")
  profile: Mapped[Optional["StudentProfile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
  notifications: Mapped[List["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")
  activity_logs: Mapped[List["ActivityLog"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class Role(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "roles"

  name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
  description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

  # Relationships
  users: Mapped[List[User]] = relationship(secondary="user_roles", back_populates="roles")
  permissions: Mapped[List["Permission"]] = relationship(secondary="role_permissions", back_populates="roles")

# Association table for Role-Permission Many-to-Many relationship
class RolePermission(Base):
  __tablename__ = "role_permissions"
  
  role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
  permission_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True)

class Permission(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "permissions"

  name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
  description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

  # Relationships
  roles: Mapped[List[Role]] = relationship(secondary="role_permissions", back_populates="permissions")
