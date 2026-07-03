from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserBase(BaseModel):
  email: EmailStr

class UserCreate(UserBase):
  password: str

class RoleResponse(BaseModel):
  name: str
  description: Optional[str] = None

  class Config:
    from_attributes = True

import uuid

class UserResponse(UserBase):
  id: uuid.UUID
  is_active: bool
  roles: List[RoleResponse] = []

  class Config:
    from_attributes = True

class LoginPayload(BaseModel):
  email: EmailStr
  password: str

class TokenResponse(BaseModel):
  access_token: str
  refresh_token: str
  token_type: str = "bearer"
  user: UserResponse

class RefreshPayload(BaseModel):
  refresh_token: str

class ForgotPasswordPayload(BaseModel):
  email: EmailStr

class ResetPasswordPayload(BaseModel):
  email: EmailStr
  token: str
  new_password: str = Field(..., min_length=6)
