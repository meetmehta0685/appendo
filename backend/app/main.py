from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.middlewares.logging import LoggingMiddleware
from app.middlewares.errors import setup_exception_handlers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scalable Placement Preparation and Tracking API backend"
)

# 1. Custom logging middleware
app.add_middleware(LoggingMiddleware)

# 2. CORS configuration
if settings.BACKEND_CORS_ORIGINS:
  app.add_middleware(
      CORSMiddleware,
      allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )

# 3. Setup global exception handling interceptors
setup_exception_handlers(app)

# Root health check endpoint
@app.get("/", tags=["healthcheck"])
def health_check():
  return {
      "status": "healthy",
      "project": settings.PROJECT_NAME,
      "version": settings.VERSION
  }

# Include API endpoints router
app.include_router(api_router, prefix=settings.API_V1_STR)
