import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Boolean, Text
from app.database.base_class import Base, UUIDPrimaryKeyMixin

class Bookmark(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "bookmarks"

  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  
  # target_type: 'question', 'coding_problem', 'drive'
  target_type: Mapped[str] = mapped_column(String(50), nullable=False)
  target_id: Mapped[uuid.UUID] = mapped_column(nullable=False)

  # Relationships
  student_profile: Mapped["StudentProfile"] = relationship(back_populates="bookmarks")

class Notification(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "notifications"

  user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  title: Mapped[str] = mapped_column(String(255), nullable=False)
  content: Mapped[str] = mapped_column(Text, nullable=False)
  is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

  # Relationships
  user: Mapped["User"] = relationship(back_populates="notifications")

class ActivityLog(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "activity_logs"

  user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  action: Mapped[str] = mapped_column(String(255), nullable=False) # e.g. "LOGGED_IN", "SUBMITTED_CODE", "REGISTERED_DRIVE"
  ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
  user_agent: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  user: Mapped["User"] = relationship(back_populates="activity_logs")
