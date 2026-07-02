import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    PROJECT_NAME: str = "AEGIS"
    API_V1_STR: str = "/api/v1"
    
    # API Keys
    NVIDIA_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    HF_API_KEY: str = ""
    
    QDRANT_HOST: str = "localhost"
    QDRANT_API_KEY: str = ""
    
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    HUBSPOT_DEVELOPER_API_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""
    SENDGRID_API_KEY: str = ""

settings = Settings()
