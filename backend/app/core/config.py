from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Placement Portal API"
    VERSION: str = "1.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # Database configuration placeholder (defaults to local SQLite file)
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./placement_portal.db"

    class Config:
        case_sensitive = True

settings = Settings()
