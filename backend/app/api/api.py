from fastapi import APIRouter
from app.api.endpoints import dashboard, stats, auth, health, profile, drives, aptitude, coding

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(drives.router, prefix="/drives", tags=["drives"])
api_router.include_router(aptitude.router, prefix="/aptitude", tags=["aptitude"])
api_router.include_router(coding.router, prefix="/coding", tags=["coding"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
