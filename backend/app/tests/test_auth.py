import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_complete_auth_flow(client: AsyncClient):
  """Test login, access token retrieval, me endpoint access, and refresh token exchange."""
  # 1. Login to obtain access and refresh tokens
  login_payload = {
      "email": "teststudent@dtu.ac.in",
      "password": "strongpassword123"
  }
  
  response = await client.post("/auth/login", json=login_payload)
  assert response.status_code == 200
  data = response.json()
  
  assert "access_token" in data
  assert "refresh_token" in data
  assert data["token_type"] == "bearer"
  assert "email" in data["user"]
  assert data["user"]["email"] == "teststudent@dtu.ac.in"
  
  access_token = data["access_token"]
  refresh_token = data["refresh_token"]

  # 2. Access protected /me endpoint using authorization header
  headers = {"Authorization": f"Bearer {access_token}"}
  me_response = await client.get("/auth/me", headers=headers)
  assert me_response.status_code == 200
  me_data = me_response.json()
  assert me_data["email"] == "teststudent@dtu.ac.in"
  assert me_data["is_active"] is True

  # 3. Refresh the access token
  refresh_payload = {
      "refresh_token": refresh_token
  }
  refresh_response = await client.post("/auth/refresh", json=refresh_payload)
  assert refresh_response.status_code == 200
  refresh_data = refresh_response.json()
  assert "access_token" in refresh_data
  assert refresh_data["token_type"] == "bearer"
  
  # 4. Forgot password request
  forgot_payload = {
      "email": "teststudent@dtu.ac.in"
  }
  forgot_response = await client.post("/auth/forgot-password", json=forgot_payload)
  assert forgot_response.status_code == 200
  forgot_data = forgot_response.json()
  assert forgot_data["success"] is True
  assert "debug_token" in forgot_data
  reset_token = forgot_data["debug_token"]

  # 5. Reset password
  reset_payload = {
      "email": "teststudent@dtu.ac.in",
      "token": reset_token,
      "new_password": "newsecurepassword456"
  }
  reset_response = await client.post("/auth/reset-password", json=reset_payload)
  assert reset_response.status_code == 200
  assert reset_response.json()["success"] is True
