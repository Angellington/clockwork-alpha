from pydantic import BaseModel


class Settings(BaseModel):
    project_name: str = "Clockwork API"
    version: str = "1.0.0"
    description: str = "API for Clockwork application"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
