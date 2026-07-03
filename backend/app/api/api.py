from fastapi import APIRouter
from app.api.endpoints import dashboard, stats, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
