import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import List, Dict, Optional, Any

from app.database.session import get_db
from app.models.drive import PlacementDrive, Application, Company, CompanyRole
from app.models.student import StudentProfile
from app.models.user import User

router = APIRouter()

class DriveRegisterPayload(BaseModel):
  companyId: str
  day: int
  email: str

class WaiverRequestPayload(BaseModel):
  companyId: str
  day: int
  email: str

async def get_or_create_company(db: AsyncSession, name: str) -> Company:
  res = await db.execute(select(Company).where(Company.name == name))
  comp = res.scalars().first()
  if not comp:
    comp = Company(name=name)
    db.add(comp)
    await db.flush()
  return comp

async def get_or_create_company_role(
    db: AsyncSession, company_id: uuid.UUID, title: str, package: str, min_gpa: float
) -> CompanyRole:
  res = await db.execute(select(CompanyRole).where(CompanyRole.company_id == company_id, CompanyRole.title == title))
  role = res.scalars().first()
  if not role:
    role = CompanyRole(
        company_id=company_id,
        title=title,
        package_salary=package,
        eligibility_gpa=min_gpa,
        eligible_branches=[]
    )
    db.add(role)
    await db.flush()
  return role

async def seed_drives_if_empty(db: AsyncSession) -> None:
  """Seed initial placement drives if none exist to prevent empty screens."""
  res = await db.execute(select(PlacementDrive).limit(1))
  if res.scalars().first():
    return

  # TCS
  tcs = await get_or_create_company(db, "TCS Digital")
  tcs_role = await get_or_create_company_role(db, tcs.id, "Systems Engineer", "7.2 LPA", 6.5)
  
  # Google
  goog = await get_or_create_company(db, "Google India")
  goog_role = await get_or_create_company_role(db, goog.id, "Software Engineer", "32 LPA", 8.5)

  # Microsoft
  ms = await get_or_create_company(db, "Microsoft IDC")
  ms_role = await get_or_create_company_role(db, ms.id, "Intern Engineer", "18 LPA", 8.0)

  # Cognizant
  cts = await get_or_create_company(db, "Cognizant")
  cts_role = await get_or_create_company_role(db, cts.id, "Programmer Analyst", "4.5 LPA", 6.0)

  # Adobe
  adobe = await get_or_create_company(db, "Adobe")
  adobe_role = await get_or_create_company_role(db, adobe.id, "Product Engineer", "24 LPA", 8.0)

  # Create Placement Drives mapped to specific days
  drives_data = [
      {"role_id": tcs_role.id, "day": 8, "desc": "tcs"},
      {"role_id": goog_role.id, "day": 5, "desc": "google"},
      {"role_id": ms_role.id, "day": 15, "desc": "ms"},
      {"role_id": cts_role.id, "day": 22, "desc": "cts"},
      {"role_id": adobe_role.id, "day": 29, "desc": "adobe"}
  ]

  for d in drives_data:
    # Set date in future
    drive_date = datetime.utcnow() + timedelta(days=(d["day"] - 2))
    drive = PlacementDrive(
        company_role_id=d["role_id"],
        date=drive_date,
        event_type="OA Exam" if d["day"] in [8, 15, 22, 29] else "Deadline",
        status="open",
        description=d["desc"]
    )
    db.add(drive)
  
  await db.flush()

@router.get("")
async def list_placement_drives(db: AsyncSession = Depends(get_db)):
  """Get list of active placement drives."""
  await seed_drives_if_empty(db)
  
  res = await db.execute(
      select(PlacementDrive)
      .options(
          selectinload(PlacementDrive.company_role)
          .selectinload(CompanyRole.company)
      )
  )
  drives = res.scalars().all()
  
  # Format in structure matching front-end calendarEvents
  events_dict = {}
  
  # Base roadmap funnel models
  funnels = {
      "tcs": [
          {"name": "Registration", "date": "July 6"},
          {"name": "Online Assessment", "date": "July 8"},
          {"name": "Technical Panel", "date": "July 12"},
          {"name": "HR Review", "date": "July 14"}
      ],
      "google": [
          {"name": "Profile Screening", "date": "July 3"},
          {"name": "Shortlist deadline", "date": "July 5"},
          {"name": "Coding Assessment", "date": "July 10"},
          {"name": "System Design Round", "date": "July 16"}
      ],
      "ms": [
          {"name": "CV Upload", "date": "July 12"},
          {"name": "Online Test", "date": "July 15"},
          {"name": "Technical Loop 1", "date": "July 18"},
          {"name": "AA Round", "date": "July 20"}
      ],
      "cts": [
          {"name": "Registration Closes", "date": "July 20"},
          {"name": "Aptitude Exam", "date": "July 22"},
          {"name": "Technical Walkin", "date": "July 26"}
      ],
      "adobe": [
          {"name": "Application Deadline", "date": "July 25"},
          {"name": "Cognitive OA", "date": "July 29"},
          {"name": "Onsite Panel", "date": "Aug 4"}
      ]
  }

  for d in drives:
    role = d.company_role
    company = role.company if role else None
    if not role or not company:
      continue
      
    # Extract relative day number from description or date
    company_id_str = d.description or "general"
    
    # Map back to exact days matching UI layout
    day_map = {"tcs": 8, "google": 5, "ms": 15, "cts": 22, "adobe": 29}
    day_num = day_map.get(company_id_str, d.date.day)

    events_dict[str(day_num)] = {
        "companyId": company_id_str,
        "companyName": company.name,
        "role": role.title,
        "package": role.package_salary,
        "minGpa": role.eligibility_gpa,
        "eventType": d.event_type,
        "statusType": "exam" if d.event_type == "OA Exam" else "deadline",
        "funnel": funnels.get(company_id_str, [
            {"name": "Online Assessment", "date": f"July {day_num}"}
        ])
    }
      
  return events_dict

@router.post("/register")
async def register_placement_drive(payload: DriveRegisterPayload, db: AsyncSession = Depends(get_db)):
  """Register student for placement drive."""
  email = payload.email.strip().lower()
  
  # Fetch student profile
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found"
    )

  company_id = payload.companyId
  current_drives = dict(profile.sub_scores.get("drives", {}))
  current_drives[company_id] = "registered"
  
  profile.sub_scores = {**profile.sub_scores, "drives": current_drives}
  
  db.add(profile)
  await db.flush()
  return {"success": True, "message": "Registered successfully", "companyId": company_id}

@router.post("/waiver")
async def request_gpa_waiver(payload: WaiverRequestPayload, db: AsyncSession = Depends(get_db)):
  """Request TPO waiver for drive registration."""
  email = payload.email.strip().lower()
  
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found"
    )

  company_id = payload.companyId
  current_drives = dict(profile.sub_scores.get("drives", {}))
  current_drives[company_id] = "waiver_pending"
  
  profile.sub_scores = {**profile.sub_scores, "drives": current_drives}
  db.add(profile)
  await db.flush()
  return {"success": True, "message": "Waiver request submitted", "companyId": company_id}
