from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database.session import get_db

router = APIRouter()

@router.get("/healthz")
async def health_check(db: AsyncSession = Depends(get_db)):
  """Verify API and asynchronous database engine connectivity."""
  try:
    # Execute simple raw SQL to verify connection is alive
    await db.execute(text("SELECT 1"))
    return {
        "status": "healthy",
        "database": "connected"
    }
  except Exception as e:
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=f"Database connectivity check failed: {str(e)}"
    )
