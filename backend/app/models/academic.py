import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, JSON
from app.database.base_class import Base, UUIDPrimaryKeyMixin

class Subject(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "subjects"

  name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
  description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  topics: Mapped[List["Topic"]] = relationship(back_populates="subject", cascade="all, delete-orphan")

class Topic(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "topics"

  subject_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
  name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
  description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

  # Relationships
  subject: Mapped[Subject] = relationship(back_populates="topics")
  questions: Mapped[List["Question"]] = relationship(back_populates="topic", cascade="all, delete-orphan")

class Question(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "questions"

  topic_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
  content: Mapped[str] = mapped_column(String(4000), nullable=False)
  
  # Options stored as list of strings in JSON
  options: Mapped[list] = mapped_column(JSON, nullable=False)
  correct_option_index: Mapped[int] = mapped_column(Integer, nullable=False)
  explanation: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
  points: Mapped[int] = mapped_column(Integer, default=10, nullable=False)

  # Relationships
  topic: Mapped[Topic] = relationship(back_populates="questions")
