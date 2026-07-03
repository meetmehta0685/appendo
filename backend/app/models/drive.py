import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer, JSON, ForeignKey, Boolean, DateTime
from app.database.base_class import Base, UUIDPrimaryKeyMixin, SoftDeleteMixin

class Company(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "companies"

  name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
  avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
  description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

  # Relationships
  roles: Mapped[List["CompanyRole"]] = relationship(back_populates="company", cascade="all, delete-orphan")

class CompanyRole(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "company_roles"

  company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
  title: Mapped[str] = mapped_column(String(255), nullable=False)
  package_salary: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "45 LPA" or "18 LPA"
  eligibility_gpa: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
  
  # List of allowed branch IDs as JSON
  eligible_branches: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

  # Relationships
  company: Mapped[Company] = relationship(back_populates="roles")
  placement_drives: Mapped[List["PlacementDrive"]] = relationship(back_populates="company_role", cascade="all, delete-orphan")

class PlacementDrive(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "placement_drives"

  company_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("company_roles.id", ondelete="CASCADE"), nullable=False)
  date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
  event_type: Mapped[str] = mapped_column(String(100), default="Campus Drive", nullable=False)
  
  # open, exam, shortlisted, closed
  status: Mapped[str] = mapped_column(String(50), default="open", nullable=False)
  description: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)

  # Relationships
  company_role: Mapped[CompanyRole] = relationship(back_populates="placement_drives")
  applications: Mapped[List["Application"]] = relationship(back_populates="placement_drive", cascade="all, delete-orphan")

class Application(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "applications"

  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  placement_drive_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("placement_drives.id", ondelete="CASCADE"), nullable=False)
  
  # registered, waiver_pending, shortlisted, rejected
  status: Mapped[str] = mapped_column(String(50), default="registered", nullable=False)
  notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  student_profile: Mapped["StudentProfile"] = relationship(back_populates="applications")
  placement_drive: Mapped[PlacementDrive] = relationship(back_populates="applications")
