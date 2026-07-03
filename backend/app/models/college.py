import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.database.base_class import Base, UUIDPrimaryKeyMixin

class College(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "colleges"

  name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
  address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  departments: Mapped[List["Department"]] = relationship(back_populates="college", cascade="all, delete-orphan")
  student_profiles: Mapped[List["StudentProfile"]] = relationship(back_populates="college")

class Department(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "departments"

  name: Mapped[str] = mapped_column(String(255), nullable=False)
  college_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("colleges.id", ondelete="CASCADE"), nullable=False)

  # Relationships
  college: Mapped[College] = relationship(back_populates="departments")
  branches: Mapped[List["Branch"]] = relationship(back_populates="department", cascade="all, delete-orphan")
  student_profiles: Mapped[List["StudentProfile"]] = relationship(back_populates="department")

class Branch(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "branches"

  name: Mapped[str] = mapped_column(String(255), nullable=False)
  department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)

  # Relationships
  department: Mapped[Department] = relationship(back_populates="branches")
  student_profiles: Mapped[List["StudentProfile"]] = relationship(back_populates="branch")
