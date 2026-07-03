import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import List, Dict, Optional, Any

from app.database.session import get_db
from app.models.academic import Question, Topic, Subject
from app.models.student import StudentProfile
from app.models.user import User
from app.models.interaction import Bookmark, ActivityLog

router = APIRouter()

class AttemptSubmitPayload(BaseModel):
  email: str
  topic: str
  module: str # quantitative, logical, verbal, company
  score: str
  accuracy: float
  mode: str
  questionsSolved: int
  timeSpent: str

class BookmarkTogglePayload(BaseModel):
  email: str
  questionId: str

# In-memory session holder for continuing sessions (since we do not modify UI, we can back this on database or return mock)
active_sessions: Dict[str, dict] = {}

async def seed_aptitude_questions_if_empty(db: AsyncSession) -> None:
  """Seed initial set of aptitude questions if none exist to enable practice solving."""
  res = await db.execute(select(Question).limit(1))
  if res.scalars().first():
    return

  # Create default subjects
  quant_sub = Subject(name="Quantitative Aptitude", description="Maths and numerical reasoning")
  db.add(quant_sub)
  await db.flush()

  # Create topics
  prob_topic = Topic(name="Probability", subject_id=quant_sub.id)
  arith_topic = Topic(name="Arithmetic", subject_id=quant_sub.id)
  db.add(prob_topic)
  db.add(arith_topic)
  await db.flush()

  # Questions list
  questions_to_seed = [
      {
          "topic_id": arith_topic.id,
          "content": "A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:",
          "options": ["45 km/hr", "50 km/hr", "54 km/hr", "55 km/hr"],
          "correct_option_index": 1,
          "explanation": "Relative speed = (125/10) m/s = 12.5 m/s = 12.5 * (18/5) = 45 km/hr. Since the man is running in the same direction, Speed of Train - Speed of Man = 45. Speed of Train = 45 + 5 = 50 km/hr."
      },
      {
          "topic_id": arith_topic.id,
          "content": "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
          "options": ["15", "16", "18", "25"],
          "correct_option_index": 1,
          "explanation": "Profit % = [(20 - x) / x] * 100 = 25. Therefore, (20 - x) / x = 0.25 => 20 - x = 0.25x => 1.25x = 20 => x = 16."
      },
      {
          "topic_id": prob_topic.id,
          "content": "Two cards are drawn together from a pack of 52 cards. What is the probability that one is a spade and one is a heart?",
          "options": ["3/20", "29/34", "13/102", "13/51"],
          "correct_option_index": 2,
          "explanation": "Total sample space is 52C2 = (52 * 51) / 2 = 1326 ways. The number of ways to draw 1 spade (out of 13) and 1 heart (out of 13) is 13C1 * 13C1 = 13 * 13 = 169. Probability = 169 / 1326 = 13/102."
      }
  ]

  for q in questions_to_seed:
    question = Question(
        topic_id=q["topic_id"],
        content=q["content"],
        options=q["options"],
        correct_option_index=q["correct_option_index"],
        explanation=q["explanation"],
        points=10
    )
    db.add(question)
  
  await db.flush()

@router.get("/questions")
async def list_questions(category: str, topic: str, db: AsyncSession = Depends(get_db)):
  """Get list of aptitude questions for specific category and topic."""
  await seed_aptitude_questions_if_empty(db)
  
  res = await db.execute(
      select(Question)
      .join(Topic)
      .where(Topic.name == topic)
  )
  questions = res.scalars().all()
  
  # Format to structure expected by frontend Question interface
  formatted = []
  for idx, q in enumerate(questions):
    formatted.append({
        "id": str(q.id),
        "category": category,
        "topic": topic,
        "question": q.content,
        "options": q.options,
        "correctAnswerIndex": q.correct_option_index,
        "explanation": q.explanation or "No explanation provided."
    })
    
  return formatted

@router.post("/attempts")
async def submit_attempt(payload: AttemptSubmitPayload, db: AsyncSession = Depends(get_db)):
  """Log student's completed aptitude practice test attempt."""
  email = payload.email.strip().lower()
  
  # Fetch student profile
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found"
    )

  # Calculate new aptitude scores & update student readiness metrics
  attempts_history = profile.sub_scores.get("attempts_history", [])
  attempt_id = f"att_{uuid.uuid4()}"
  new_attempt = {
      "id": attempt_id,
      "date": datetime.utcnow().strftime("%b %d, %Y"),
      "topic": payload.topic,
      "module": payload.module,
      "score": payload.score,
      "accuracy": payload.accuracy,
      "mode": payload.mode,
      "questionsSolved": payload.questionsSolved,
      "timeSpent": payload.timeSpent
  }
  
  attempts_history.append(new_attempt)
  
  # Calculate cumulative accuracy of past attempts to update sub_scores.apt
  total_acc = sum(a.get("accuracy", 0.0) for a in attempts_history)
  avg_acc = int(total_acc / len(attempts_history)) if len(attempts_history) > 0 else 80
  
  # Update student profile scores
  profile.sub_scores = {
      **profile.sub_scores,
      "attempts_history": attempts_history,
      "apt": avg_acc
  }
  
  # Update general readiness index
  sub_scores = profile.sub_scores
  apt = sub_scores.get("apt", avg_acc)
  code = sub_scores.get("code", 60)
  tech = sub_scores.get("tech", 72)
  interview = sub_scores.get("interview", 58)
  resume = sub_scores.get("resume", 91)
  profile.readiness = int((apt + code + tech + interview + resume) / 5)

  db.add(profile)
  await db.flush()

  return {"success": True, "attemptId": attempt_id, "newAptScore": avg_acc, "newReadiness": profile.readiness}

@router.get("/history")
async def get_attempts_history(email: str, db: AsyncSession = Depends(get_db)):
  """Get list of past practice session attempts."""
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    return []
  return profile.sub_scores.get("attempts_history", [])

@router.post("/bookmarks/toggle")
async def toggle_question_bookmark(payload: BookmarkTogglePayload, db: AsyncSession = Depends(get_db)):
  """Bookmark or remove bookmark for an aptitude question."""
  email = payload.email.strip().lower()
  
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found"
    )

  bookmarks_list = profile.sub_scores.get("bookmarked_questions", [])
  q_id = payload.questionId
  
  if q_id in bookmarks_list:
    bookmarks_list.remove(q_id)
    bookmarked = False
  else:
    bookmarks_list.append(q_id)
    bookmarked = True
    
  profile.sub_scores = {
      **profile.sub_scores,
      "bookmarked_questions": bookmarks_list
  }
  db.add(profile)
  await db.flush()
  
  return {"success": True, "bookmarked": bookmarked}

@router.get("/bookmarks")
async def get_bookmarked_questions(email: str, db: AsyncSession = Depends(get_db)):
  """Get list of bookmarked question IDs for student."""
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    return []
  return profile.sub_scores.get("bookmarked_questions", [])

@router.get("/weak-topics")
async def get_weak_topics(email: str, db: AsyncSession = Depends(get_db)):
  """Get list of weak topics based on past accuracy rates (accuracy < 70%)."""
  profile_res = await db.execute(
      select(StudentProfile)
      .join(User)
      .where(User.email == email)
  )
  profile = profile_res.scalars().first()
  if not profile:
    return []
    
  attempts = profile.sub_scores.get("attempts_history", [])
  weak_topics = []
  topic_scores = {}
  
  for a in attempts:
    t = a["topic"]
    acc = a["accuracy"]
    if t not in topic_scores:
      topic_scores[t] = []
    topic_scores[t].append(acc)
    
  for t, accs in topic_scores.items():
    avg = sum(accs) / len(accs)
    if avg < 70.0:
      weak_topics.append({"topic": t, "accuracy": avg})
      
  return weak_topics
