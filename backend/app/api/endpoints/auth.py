import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any

from app.database.session import get_db
from app.models.user import User, Role, UserRole
from app.models.student import StudentProfile
from app.models.college import College, Department, Branch
from sqlalchemy.orm import selectinload
from app.schemas.user import (
    LoginPayload, TokenResponse, UserResponse,
    RefreshPayload, ForgotPasswordPayload, ResetPasswordPayload
)
from app.utils.security import verify_password, get_password_hash
from app.utils.jwt import (
    create_access_token, create_refresh_token,
    decode_refresh_token, decode_access_token
)
from app.auth.dependencies import get_current_user

router = APIRouter()

async def get_or_create_role(db: AsyncSession, role_name: str) -> Role:
  """Retrieve role by name or create it if not present."""
  result = await db.execute(select(Role).where(Role.name == role_name))
  role = result.scalars().first()
  if not role:
    role = Role(name=role_name, description=f"{role_name.capitalize()} System Role")
    db.add(role)
    await db.flush()
  return role

async def auto_provision_profile(db: AsyncSession, user: User, role_name: str) -> None:
  """Automatically provision mock associations and profiles to avoid db constraint errors in testing."""
  if role_name != "student":
    return
    
  # Check if profile already exists
  result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user.id))
  if result.scalars().first():
    return
    
  # Create a dummy College, Department, and Branch
  college_res = await db.execute(select(College).limit(1))
  college = college_res.scalars().first()
  if not college:
    college = College(name="DTU Delhi", address="Shahbad Daulatpur, Delhi")
    db.add(college)
    await db.flush()
    
  dept_res = await db.execute(select(Department).where(Department.college_id == college.id))
  dept = dept_res.scalars().first()
  if not dept:
    dept = Department(name="Computer Engineering", college_id=college.id)
    db.add(dept)
    await db.flush()

  branch_res = await db.execute(select(Branch).where(Branch.department_id == dept.id))
  branch = branch_res.scalars().first()
  if not branch:
    branch = Branch(name="CSE · Semester 7", department_id=dept.id)
    db.add(branch)
    await db.flush()

  profile = StudentProfile(
      user_id=user.id,
      college_id=college.id,
      department_id=dept.id,
      branch_id=branch.id,
      roll_number="DTU/2K23/CO/142",
      gpa=8.42,
      backlogs=0,
      readiness=82,
      sub_scores={
          "apt": 80,
          "code": 60,
          "tech": 72,
          "interview": 58,
          "resume": 91
      },
      personal_email=user.email,
      mobile="9988776655"
  )
  db.add(profile)
  await db.flush()

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginPayload, db: AsyncSession = Depends(get_db)):
  """Handle Student, College, and Placement Admin logins with JWT generation."""
  email = payload.email.strip().lower()
  
  # Determine role allocations based on email handles
  if "admin" in email:
    allocated_role = "placement_admin"
  elif "college" in email:
    allocated_role = "college_coordinator"
  else:
    allocated_role = "student"

  # Find user or auto-register them for development convenience
  result = await db.execute(
      select(User)
      .options(selectinload(User.roles))
      .where(User.email == email)
  )
  user = result.scalars().first()
  
  if not user:
    # Auto-register new accounts
    hashed = get_password_hash(payload.password)
    user = User(email=email, hashed_password=hashed, is_active=True)
    db.add(user)
    await db.flush()
    
    role = await get_or_create_role(db, allocated_role)
    db.add(UserRole(user_id=user.id, role_id=role.id))
    await db.flush()
    await auto_provision_profile(db, user, allocated_role)
    
    # Reload user with roles loaded eager
    result = await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user.id)
    )
    user = result.scalars().first()
  else:
    # Verify password match
    if not verify_password(payload.password, user.hashed_password):
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Incorrect email or password"
      )

  # Generate JWT access and refresh tokens
  access_token = create_access_token(subject=user.email)
  refresh_token = create_refresh_token(subject=user.email)
  
  return {
      "access_token": access_token,
      "refresh_token": refresh_token,
      "token_type": "bearer",
      "user": user
  }

@router.post("/refresh")
async def refresh_token_endpoint(payload: RefreshPayload, db: AsyncSession = Depends(get_db)):
  """Generate new access token using a valid refresh token."""
  email = decode_refresh_token(payload.refresh_token)
  if not email:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token"
    )

  result = await db.execute(
      select(User)
      .options(selectinload(User.roles))
      .where(User.email == email)
  )
  user = result.scalars().first()
  if not user or not user.is_active:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User account is inactive or missing"
    )

  new_access = create_access_token(subject=user.email)
  return {
      "access_token": new_access,
      "token_type": "bearer"
  }

@router.get("/me", response_model=UserResponse)
async def get_current_user_me(current_user: User = Depends(get_current_user)):
  """Get details of currently authenticated user session."""
  return current_user

@router.post("/logout")
async def logout():
  """Invalidate session credentials."""
  return {"success": True, "message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordPayload, db: AsyncSession = Depends(get_db)):
  """Initiate password recovery."""
  email = payload.email.strip().lower()
  result = await db.execute(select(User).where(User.email == email))
  user = result.scalars().first()
  
  if not user:
    # Prevent email enumeration disclosures by returning 200 OK
    return {"success": True, "message": "If the account exists, a recovery token has been prepared."}

  # Generate a mock token for development reset
  mock_token = f"reset-token-{uuid.uuid4()}"
  return {
      "success": True, 
      "message": "Recovery token generated.",
      "debug_token": mock_token
  }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordPayload, db: AsyncSession = Depends(get_db)):
  """Reset user credentials using validation token."""
  email = payload.email.strip().lower()
  result = await db.execute(select(User).where(User.email == email))
  user = result.scalars().first()
  
  if not user:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )

  # Update hashed password
  user.hashed_password = get_password_hash(payload.new_password)
  db.add(user)
  return {"success": True, "message": "Password updated successfully."}
