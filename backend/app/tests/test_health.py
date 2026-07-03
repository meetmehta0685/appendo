import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_database_healthz_endpoint(client: AsyncClient):
  """Verify the database healthz endpoint returns a healthy database connection status."""
  response = await client.get("/health/healthz")
  assert response.status_code == 200
  data = response.json()
  assert data["status"] == "healthy"
  assert data["database"] == "connected"
