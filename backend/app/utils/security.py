import hashlib
import os
import base64

def get_password_hash(password: str) -> str:
  """Generate secure PBKDF2 password hash (standard library, zero-dependency, Python 3.12+ safe)."""
  salt = os.urandom(16)
  db_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
  
  # Format as self-contained string: pbkdf2_sha256$iterations$salt$hash
  salt_b64 = base64.b64encode(salt).decode('utf-8')
  hash_b64 = base64.b64encode(db_hash).decode('utf-8')
  return f"pbkdf2_sha256$100000${salt_b64}${hash_b64}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
  """Verify standard plain text password match with PBKDF2 hash."""
  try:
    parts = hashed_password.split('$')
    if len(parts) != 4 or parts[0] != 'pbkdf2_sha256':
      return False
    iterations = int(parts[1])
    salt = base64.b64decode(parts[2].encode('utf-8'))
    original_hash = base64.b64decode(parts[3].encode('utf-8'))
    
    new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, iterations)
    return new_hash == original_hash
  except Exception:
    return False
