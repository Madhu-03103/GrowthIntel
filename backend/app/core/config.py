from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Database (using SQLite for easy setup - change to PostgreSQL for production)
    DATABASE_URL: str = "sqlite:///./employee_growth.db"
    
    # Security
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # ML Models
    MODEL_PATH: str = "../ml/models"
    
    # Application
    PROJECT_NAME: str = "Employee Growth Intelligence"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
