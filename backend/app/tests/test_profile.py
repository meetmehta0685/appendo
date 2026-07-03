import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User, Role, UserRole
from app.models.student import StudentProfile
from app.models.college import College, Department, Branch
from app.utils.security import get_password_hash

@pytest.mark.asyncio
async def test_student_profile_crud_endpoints(client: AsyncClient):
  """Verify get and update endpoints for student profiles function correctly."""
  # 1. Login to obtain access token (this auto-provisions the user and profile!)
  login_payload = {
      "email": "dhrumit@dtu.ac.in",
      "password": "mypassword123"
  }
  
  login_res = await client.post("/auth/login", json=login_payload)
  assert login_res.status_code == 200
  login_data = login_res.json()
  access_token = login_data["access_token"]
  
  headers = {"Authorization": f"Bearer {access_token}"}

  # 2. Get student profile details
  get_res = await client.get("/profile?email=dhrumit@dtu.ac.in", headers=headers)
  assert get_res.status_code == 200
  profile_data = get_res.json()
  
  assert profile_data["personalEmail"] == "dhrumit@dtu.ac.in"
  assert profile_data["college"] == "DTU Delhi"
  assert profile_data["branch"] == "CSE · Semester 7"
  assert profile_data["gpa"] == 8.42
  assert profile_data["subScores"]["apt"] == 80

  # 3. Update student profile details (PUT request)
  update_payload = {
      "personalEmail": "dhrumit@dtu.ac.in",
      "name": "Dhrumit Sen",
      "gpa": 9.15,
      "mobile": "9999888877",
      "linkedin": "https://linkedin.com/in/dhrumitsen"
  }
  
  put_res = await client.put("/profile", json=update_payload, headers=headers)
  assert put_res.status_code == 200
  updated_data = put_res.json()
  
  assert updated_data["name"] == "Dhrumit Sen"
  assert updated_data["gpa"] == 9.15
  assert updated_data["mobile"] == "9999888877"
  assert updated_data["linkedin"] == "https://linkedin.com/in/dhrumitsen"

  # 4. Verify updates persist in the DB on subsequent GET query
  verify_res = await client.get("/profile?email=dhrumit@dtu.ac.in", headers=headers)
  assert verify_res.status_code == 200
  verify_data = verify_res.json()
  assert verify_data["name"] == "Dhrumit Sen"
  assert verify_data["gpa"] == 9.15
