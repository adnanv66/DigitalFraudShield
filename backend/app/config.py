import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Digital Fraud Shield"
    API_V1_STR: str = ""
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fraud_shield.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "digital_fraud_shield_super_secret_jwt_key_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
