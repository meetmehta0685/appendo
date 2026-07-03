from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.user import User
from app.utils.jwt import decode_access_token

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
  """Retrieve current authenticated user from JWT token."""
  credentials_exception = HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Could not validate credentials",
      headers={"WWW-Authenticate": "Bearer"},
  )
  
  email = decode_access_token(token)
  if email is None:
    raise credentials_exception

  result = await db.execute(select(User).where(User.email == email))
  user = result.scalars().first()
  
  if user is None:
    raise credentials_exception
    
  return user
