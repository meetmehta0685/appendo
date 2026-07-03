import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_coding_practice_engine(client: AsyncClient):
  """Verify that the coding problems list, run code, submit code, submissions history, and bookmarks APIs function correctly."""
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

  # 2. Get problems list (seeds automatically)
  problems_res = await client.get("/coding/problems", headers=headers)
  assert problems_res.status_code == 200
  problems = problems_res.json()
  
  assert len(problems) >= 1
  prob_id = problems[0]["id"]
  assert "Two Sum" in [p["title"] for p in problems]

  # 3. Post run code simulation (future-ready sandbox run)
  run_payload = {
      "problemId": prob_id,
      "language": "python",
      "codeContent": "print('hello world')",
      "customInput": ""
  }
  run_res = await client.post("/coding/run", json=run_payload, headers=headers)
  assert run_res.status_code == 200
  assert run_res.json()["compileSuccess"] is True

  # 4. Post submit code execution
  submit_payload = {
      "email": "dhrumit@dtu.ac.in",
      "problemId": prob_id,
      "language": "python",
      "codeContent": "class Solution:\n    def twoSum(self, nums, target):\n        return [0, 1]"
  }
  submit_res = await client.post("/coding/submit", json=submit_payload, headers=headers)
  assert submit_res.status_code == 200
  submit_data = submit_res.json()
  assert submit_data["success"] is True
  assert submit_data["status"] == "ACCEPTED"
  assert submit_data["newCodeScore"] > 60

  # 5. Check submissions history
  submissions_res = await client.get("/coding/submissions?email=dhrumit@dtu.ac.in", headers=headers)
  assert submissions_res.status_code == 200
  submissions = submissions_res.json()
  assert len(submissions) >= 1
  assert submissions[0]["problemId"] == prob_id

  # 6. Toggle bookmark
  bookmark_payload = {
      "email": "dhrumit@dtu.ac.in",
      "problemId": prob_id
  }
  bookmark_res = await client.post("/coding/bookmarks/toggle", json=bookmark_payload, headers=headers)
  assert bookmark_res.status_code == 200
  assert bookmark_res.json()["bookmarked"] is True

  # 7. Fetch bookmarks list
  list_res = await client.get("/coding/bookmarks?email=dhrumit@dtu.ac.in", headers=headers)
  assert list_res.status_code == 200
  bookmarks = list_res.json()
  assert prob_id in bookmarks
