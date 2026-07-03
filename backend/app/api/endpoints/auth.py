from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import Token, UserResponse, UserCreate

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
  """Mock API endpoint for testing JWT login handshake."""
  # In production, verify username & password against database
  mock_token = f"mock-jwt-token-{form_data.username}"
  return {"access_token": mock_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
  """Mock API endpoint for testing user registrations."""
  return {
      "email": user_in.email,
      "id": 1,
      "is_active": True
  }
