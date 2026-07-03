import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer, JSON, ForeignKey, Boolean
from app.database.base_class import Base, UUIDPrimaryKeyMixin, SoftDeleteMixin

# Association table for Student-Achievement Many-to-Many relationship
class StudentAchievement(Base):
  __tablename__ = "student_achievements"
  
  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), primary_key=True)
  achievement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("achievements.id", ondelete="CASCADE"), primary_key=True)

class StudentProfile(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "student_profiles"

  user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
  college_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("colleges.id", ondelete="RESTRICT"), nullable=False)
  department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False)
  branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branches.id", ondelete="RESTRICT"), nullable=False)

  name: Mapped[str] = mapped_column(String(255), default="Student", nullable=False)
  semester: Mapped[int] = mapped_column(Integer, default=7, nullable=False)
  roll_number: Mapped[str] = mapped_column(String(50), nullable=False)
  gpa: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
  backlogs: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
  readiness: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
  
  # Sub-scores stored as JSON object (aptitude, coding, technical, interview, resume)
  sub_scores: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
  
  # Contact details
  mobile: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
  personal_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
  linkedin_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
  github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
  portfolio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
  profile_photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  user: Mapped["User"] = relationship(back_populates="profile")
  college: Mapped["College"] = relationship(back_populates="student_profiles")
  department: Mapped["Department"] = relationship(back_populates="student_profiles")
  branch: Mapped["Branch"] = relationship(back_populates="student_profiles")
  
  resumes: Mapped[List["Resume"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")
  applications: Mapped[List["Application"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")
  submissions: Mapped[List["CodingSubmission"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")
  mock_interviews: Mapped[List["MockInterview"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")
  bookmarks: Mapped[List["Bookmark"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")
  achievements: Mapped[List["Achievement"]] = relationship(secondary="student_achievements", back_populates="student_profiles")
  leaderboard_entries: Mapped[List["Leaderboard"]] = relationship(back_populates="student_profile", cascade="all, delete-orphan")

class Resume(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "resumes"

  title: Mapped[str] = mapped_column(String(255), default="My Resume", nullable=False)
  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

  # Relationships
  student_profile: Mapped[StudentProfile] = relationship(back_populates="resumes")
  versions: Mapped[List["ResumeVersion"]] = relationship(back_populates="resume", cascade="all, delete-orphan")

class ResumeVersion(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "resume_versions"

  resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
  file_path: Mapped[str] = mapped_column(String(500), nullable=False)
  file_size: Mapped[str] = mapped_column(String(50), nullable=False)
  ats_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

  # Relationships
  resume: Mapped[Resume] = relationship(back_populates="versions")

class Achievement(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "achievements"

  title: Mapped[str] = mapped_column(String(255), nullable=False)
  description: Mapped[str] = mapped_column(String(500), nullable=False)
  points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

  # Relationships
  student_profiles: Mapped[List[StudentProfile]] = relationship(secondary="student_achievements", back_populates="achievements")

class Leaderboard(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "leaderboards"

  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
  rank: Mapped[int] = mapped_column(Integer, nullable=False)
  type: Mapped[str] = mapped_column(String(50), default="global", nullable=False) # global, branch, college

  # Relationships
  student_profile: Mapped[StudentProfile] = relationship(back_populates="leaderboard_entries")
