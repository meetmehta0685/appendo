import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_login_endpoint(client: AsyncClient):
  """Verify the auth login endpoint returns a valid token format."""
  payload = {
      "username": "testuser@dtu.ac.in",
      "password": "testpassword"
  }
  
  response = await client.post("/auth/login", data=payload)
  
  assert response.status_code == 200
  data = response.json()
  assert "access_token" in data
  assert data["token_type"] == "bearer"
  assert "testuser" in data["access_token"]
