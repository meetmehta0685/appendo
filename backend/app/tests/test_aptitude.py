import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_aptitude_engine_endpoints(client: AsyncClient):
  """Verify that the aptitude questions, attempts, history, and bookmark APIs function correctly."""
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

  # 2. Get questions list (seeds automatically)
  questions_res = await client.get("/aptitude/questions?category=quantitative&topic=Probability", headers=headers)
  assert questions_res.status_code == 200
  questions = questions_res.json()
  
  assert len(questions) >= 1
  q_id = questions[0]["id"]
  assert " spade " in questions[0]["question"]

  # 3. Submit practice attempt
  attempt_payload = {
      "email": "dhrumit@dtu.ac.in",
      "topic": "Probability",
      "module": "quantitative",
      "score": "8/10",
      "accuracy": 80.0,
      "mode": "timed",
      "questionsSolved": 10,
      "timeSpent": "12:45"
  }
  
  attempt_res = await client.post("/aptitude/attempts", json=attempt_payload, headers=headers)
  assert attempt_res.status_code == 200
  attempt_data = attempt_res.json()
  assert attempt_data["success"] is True
  assert attempt_data["newAptScore"] == 80

  # 4. Check attempts history
  history_res = await client.get("/aptitude/history?email=dhrumit@dtu.ac.in", headers=headers)
  assert history_res.status_code == 200
  history = history_res.json()
  assert len(history) == 1
  assert history[0]["topic"] == "Probability"

  # 5. Toggle bookmark
  bookmark_payload = {
      "email": "dhrumit@dtu.ac.in",
      "questionId": q_id
  }
  bookmark_res = await client.post("/aptitude/bookmarks/toggle", json=bookmark_payload, headers=headers)
  assert bookmark_res.status_code == 200
  assert bookmark_res.json()["bookmarked"] is True

  # 6. Fetch bookmarks list
  list_res = await client.get("/aptitude/bookmarks?email=dhrumit@dtu.ac.in", headers=headers)
  assert list_res.status_code == 200
  bookmarks = list_res.json()
  assert q_id in bookmarks
