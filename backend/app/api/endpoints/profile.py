from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database.session import get_db
from app.models.student import StudentProfile
from app.models.user import User
from app.schemas.student import StudentProfileResponse, StudentProfileUpdate

router = APIRouter()

def format_profile_response(profile: StudentProfile) -> dict:
  """Helper to shape DB student profile properties into the structure expected by the React frontend."""
  return {
      "name": profile.name,
      "college": profile.college.name if profile.college else "Unknown",
      "branch": profile.branch.name if profile.branch else "Unknown",
      "roll": profile.roll_number,
      "gpa": profile.gpa,
      "backlogs": profile.backlogs,
      "readiness": profile.readiness,
      "subScores": {
          "apt": profile.sub_scores.get("apt", 0),
          "code": profile.sub_scores.get("code", 0),
          "tech": profile.sub_scores.get("tech", 0),
          "interview": profile.sub_scores.get("interview", 0),
          "resume": profile.sub_scores.get("resume", 0)
      },
      "drives": profile.sub_scores.get("drives", {}),
      "mobile": profile.mobile,
      "personalEmail": profile.personal_email,
      "linkedin": profile.linkedin_url,
      "github": profile.github_url,
      "portfolio": profile.portfolio_url,
      "profilePhoto": profile.profile_photo_url
  }

@router.get("", response_model=dict)
async def get_student_profile(email: str, db: AsyncSession = Depends(get_db)):
  """Retrieve student profile details by user email handles."""
  result = await db.execute(
      select(StudentProfile)
      .join(User)
      .options(
          selectinload(StudentProfile.college),
          selectinload(StudentProfile.department),
          selectinload(StudentProfile.branch)
      )
      .where(User.email == email)
  )
  profile = result.scalars().first()
  
  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Student profile not found for email: {email}"
    )
    
  return format_profile_response(profile)

@router.put("", response_model=dict)
async def update_student_profile(payload: dict, db: AsyncSession = Depends(get_db)):
  """Update student profile details in DB."""
  email = payload.get("personalEmail")
  if not email:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Missing personalEmail payload identifier."
    )

  # Fetch existing student profile row
  result = await db.execute(
      select(StudentProfile)
      .join(User)
      .options(
          selectinload(StudentProfile.college),
          selectinload(StudentProfile.department),
          selectinload(StudentProfile.branch)
      )
      .where(User.email == email)
  )
  profile = result.scalars().first()

  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found for updates"
    )

  # Apply details
  if "name" in payload:
    profile.name = payload["name"]
  if "roll" in payload:
    profile.roll_number = payload["roll"]
  if "gpa" in payload:
    profile.gpa = float(payload["gpa"])
  if "backlogs" in payload:
    profile.backlogs = int(payload["backlogs"])
  if "readiness" in payload:
    profile.readiness = int(payload["readiness"])
  if "mobile" in payload:
    profile.mobile = payload["mobile"]
  if "linkedin" in payload:
    profile.linkedin_url = payload["linkedin"]
  if "github" in payload:
    profile.github_url = payload["github"]
  if "portfolio" in payload:
    profile.portfolio_url = payload["portfolio"]
  if "profilePhoto" in payload:
    profile.profile_photo_url = payload["profilePhoto"]
  if "subScores" in payload:
    profile.sub_scores = payload["subScores"]

  db.add(profile)
  await db.flush()

  return format_profile_response(profile)
