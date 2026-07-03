import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Text
from app.database.base_class import Base, UUIDPrimaryKeyMixin, SoftDeleteMixin

class CodingProblem(Base, UUIDPrimaryKeyMixin, SoftDeleteMixin):
  __tablename__ = "coding_problems"

  title: Mapped[str] = mapped_column(String(255), nullable=False)
  description: Mapped[str] = mapped_column(Text, nullable=False)
  difficulty: Mapped[str] = mapped_column(String(50), default="Easy", nullable=False) # Easy, Medium, Hard
  
  constraints: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
  input_format: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
  output_format: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
  sample_input: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
  sample_output: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

  # Relationships
  submissions: Mapped[List["CodingSubmission"]] = relationship(back_populates="coding_problem", cascade="all, delete-orphan")

class CodingSubmission(Base, UUIDPrimaryKeyMixin):
  __tablename__ = "coding_submissions"

  student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
  coding_problem_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("coding_problems.id", ondelete="CASCADE"), nullable=False)
  
  code_content: Mapped[str] = mapped_column(Text, nullable=False)
  language: Mapped[str] = mapped_column(String(50), nullable=False) # cpp, python, java, javascript
  
  # accepted, wrong_answer, compile_error, time_limit_exceeded, runtime_error
  status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
  runtime_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
  memory_kb: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

  # Relationships
  student_profile: Mapped["StudentProfile"] = relationship(back_populates="submissions")
  coding_problem: Mapped[CodingProblem] = relationship(back_populates="submissions")
