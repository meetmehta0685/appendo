from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
from jose import jwt, JWTError
from app.core.config import settings

# Access and Refresh Token expirations (Access: 1 day, Refresh: 30 days)
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
  """Generate secure short-lived access JWT token."""
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  
  to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
  encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
  return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
  """Generate secure long-lived refresh JWT token."""
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
  
  to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
  encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
  return encoded_jwt

def decode_token(token: str, expected_type: str = "access") -> Optional[str]:
  """Decode token and extract subject email, validating type claims."""
  try:
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if decoded.get("type") != expected_type:
      return None
    return decoded.get("sub")
  except JWTError:
    return None

def decode_access_token(token: str) -> Optional[str]:
  """Decode access token, extracting subject email."""
  return decode_token(token, "access")

def decode_refresh_token(token: str) -> Optional[str]:
  """Decode refresh token, extracting subject email."""
  return decode_token(token, "refresh")
