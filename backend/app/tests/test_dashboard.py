import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_dashboard_summary_endpoint(client: AsyncClient):
  """Verify the dashboard summary API retrieves accurate, structured data."""
  # 1. Login to obtain access token (this auto-provisions profile!)
  login_payload = {
      "email": "dhrumit@dtu.ac.in",
      "password": "mypassword123"
  }
  
  login_res = await client.post("/auth/login", json=login_payload)
  assert login_res.status_code == 200
  login_data = login_res.json()
  access_token = login_data["access_token"]
  
  headers = {"Authorization": f"Bearer {access_token}"}

  # 2. Query Dashboard summary API
  dashboard_res = await client.get("/dashboard?email=dhrumit@dtu.ac.in", headers=headers)
  assert dashboard_res.status_code == 200
  data = dashboard_res.json()
  
  # Assert structural integrity and properties
  assert "readiness" in data
  assert data["readiness"] == 82
  assert "upcomingDrives" in data
  assert len(data["upcomingDrives"]) == 3
  assert data["upcomingDrives"][0]["company"] == "TCS Digital"
  
  assert "continuePractice" in data
  assert data["continuePractice"]["aptitude"]["topic"] == "Probability & Combinatorics"
  assert data["continuePractice"]["aptitude"]["progress"] == 80
  assert data["continuePractice"]["coding"]["progress"] == 60
  
  assert "standing" in data
  assert data["standing"]["rank"] == 1  # Since he is the only student auto-provisioned in this test database, his rank is 1!
  assert data["standing"]["total"] == 1
  
  assert "recommendations" in data
  assert len(data["recommendations"]) >= 1
