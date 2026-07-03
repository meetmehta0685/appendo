from pydantic import BaseModel, Field
from typing import Dict, Optional

class SubScores(BaseModel):
    apt: int = Field(default=80, ge=0, le=100)
    code: int = Field(default=60, ge=0, le=100)
    tech: int = Field(default=72, ge=0, le=100)
    interview: int = Field(default=58, ge=0, le=100)
    resume: int = Field(default=91, ge=0, le=100)

class StudentProfileBase(BaseModel):
    name: str = Field(..., min_length=1, example="Dhrumit")
    college: str = Field(..., min_length=1, example="DTU Delhi")
    branch: str = Field(..., min_length=1, example="CSE · Semester 7")
    roll: str = Field(..., min_length=1, example="DTU/2K23/CO/142")
    gpa: float = Field(..., ge=0.0, le=10.0, example=8.42)
    backlogs: int = Field(..., ge=0, example=0)
    readiness: int = Field(..., ge=0, le=100, example=82)
    subScores: SubScores
    drives: Dict[str, str]

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    roll: Optional[str] = None
    gpa: Optional[float] = None
    backlogs: Optional[int] = None
    readiness: Optional[int] = None
    subScores: Optional[SubScores] = None
    drives: Optional[Dict[str, str]] = None

class StudentProfileResponse(StudentProfileBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True  # Pydantic v2 compatibility for ORM mapping
