import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_domain_based_college_verification_flow(client: AsyncClient):
  """Verify that logging in with different academic emails resolves, maps, and auto-provisions distinct college entities and student profiles."""
  # 1. Login with student@svit.ac.in
  svit_payload = {
      "email": "student@svit.ac.in",
      "password": "passwordsvit123"
  }
  svit_login_res = await client.post("/auth/login", json=svit_payload)
  assert svit_login_res.status_code == 200
  svit_data = svit_login_res.json()
  
  svit_token = svit_data["access_token"]
  svit_headers = {"Authorization": f"Bearer {svit_token}"}

  # 2. Get profile details for SVIT student
  svit_profile_res = await client.get("/profile?email=student@svit.ac.in", headers=svit_headers)
  assert svit_profile_res.status_code == 200
  svit_profile = svit_profile_res.json()
  
  # Assert dynamic naming, college mapping, roll formatting, and profile picture assignments are correct
  assert svit_profile["name"] == "Student"
  assert svit_profile["college"] == "SVIT"
  assert svit_profile["branch"] == "CSE · Semester 7"
  assert "SVIT/2K23/CO/STUDE" in svit_profile["roll"]
  assert "seed=student" in svit_profile["profilePhoto"]
  assert svit_profile["gpa"] == 8.0
  assert svit_profile["subScores"]["apt"] == 50

  # 3. Login with dhrumit@dtu.ac.in
  dtu_payload = {
      "email": "dhrumit@dtu.ac.in",
      "password": "passworddtu456"
  }
  dtu_login_res = await client.post("/auth/login", json=dtu_payload)
  assert dtu_login_res.status_code == 200
  dtu_data = dtu_login_res.json()
  
  dtu_token = dtu_data["access_token"]
  dtu_headers = {"Authorization": f"Bearer {dtu_token}"}

  # 4. Get profile details for DTU student
  dtu_profile_res = await client.get("/profile?email=dhrumit@dtu.ac.in", headers=dtu_headers)
  assert dtu_profile_res.status_code == 200
  dtu_profile = dtu_profile_res.json()
  
  # Assert distinct properties are resolved for DTU
  assert dtu_profile["name"] == "Dhrumit"
  assert dtu_profile["college"] == "DTU Delhi"
  assert "DTUDelhi/2K23/CO/DHRUM" in dtu_profile["roll"]
  assert dtu_profile["gpa"] == 8.42
  assert dtu_profile["subScores"]["apt"] == 80
