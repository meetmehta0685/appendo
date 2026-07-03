import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from app.database.base_class import Base, UUIDPrimaryKeyMixin, SoftDeleteMixin

class MockInterview(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "mock_interviews"

  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  topic: Mapped[str] = mapped_column(String(255), nullable=False) # e.g. "Google Technical Mock" or "Behavioral Interview"
  scheduled_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
  duration_minutes: Mapped[int] = mapped_column(Integer, default=45, nullable=False)
  
  # scheduled, completed, cancelled
  status: Mapped[str] = mapped_column(String(50), default="scheduled", nullable=False)
  
  feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
  score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True) # out of 100

  # Relationships
  student_profile: Mapped["StudentProfile"] = relationship(back_populates="mock_interviews")
