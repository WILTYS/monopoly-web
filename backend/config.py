from pydantic_settings import BaseSettings
from typing import List
from pydantic import field_validator

class Settings(BaseSettings):
    secret_key: str = "dev-secret-key-change-in-production"
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return v
        return v
    
    def get_cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(',')]
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
