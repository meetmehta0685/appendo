import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_placement_drives_flow(client: AsyncClient):
  """Verify drives listing, student registration, and TPO waiver requests function correctly."""
  # 1. Login to obtain access token (auto-provisions user & profile)
  login_payload = {
      "email": "dhrumit@dtu.ac.in",
      "password": "mypassword123"
  }
  
  login_res = await client.post("/auth/login", json=login_payload)
  assert login_res.status_code == 200
  login_data = login_res.json()
  access_token = login_data["access_token"]
  
  headers = {"Authorization": f"Bearer {access_token}"}

  # 2. Get drives list (seeds automatically)
  drives_res = await client.get("/drives", headers=headers)
  assert drives_res.status_code == 200
  drives_data = drives_res.json()
  
  assert "8" in drives_data  # TCS Day 8
  assert "5" in drives_data  # Google Day 5
  assert drives_data["8"]["companyName"] == "TCS Digital"

  # 3. Register for TCS drive
  reg_payload = {
      "companyId": "tcs",
      "day": 8,
      "email": "dhrumit@dtu.ac.in"
  }
  reg_res = await client.post("/drives/register", json=reg_payload, headers=headers)
  assert reg_res.status_code == 200
  assert reg_res.json()["success"] is True

  # 4. Request GPA waiver for Google drive
  waiver_payload = {
      "companyId": "google",
      "day": 5,
      "email": "dhrumit@dtu.ac.in"
  }
  waiver_res = await client.post("/drives/waiver", json=waiver_payload, headers=headers)
  assert waiver_res.status_code == 200
  assert waiver_res.json()["success"] is True

  # 5. Get profile and verify registration states are returned in profile drives mapping
  profile_res = await client.get("/profile?email=dhrumit@dtu.ac.in", headers=headers)
  assert profile_res.status_code == 200
  profile_data = profile_res.json()
  
  assert profile_data["drives"]["tcs"] == "registered"
  assert profile_data["drives"]["google"] == "waiver_pending"
