from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
from jose import jwt, JWTError
from app.core.config import settings

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
  """Generate secure JWT token."""
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
  
  to_encode = {"exp": expire, "sub": str(subject)}
  encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
  return encoded_jwt

def decode_access_token(token: str) -> Optional[str]:
  """Decode token and extract subject email, returns None if signature invalid."""
  try:
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    return decoded.get("sub")
  except JWTError:
    return None
