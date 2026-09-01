import os
from pathlib import Path
from urllib.parse import quote_plus

from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


def _load_env_file(path: Path = ENV_FILE) -> dict[str, str]:
    values: dict[str, str] = {}

    if not path.exists():
        return values

    for line in path.read_text().splitlines():
        stripped = line.strip()

        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue

        key, value = stripped.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


def _env_value(env_file: dict[str, str], key: str, default: str | None = None) -> str | None:
    return os.getenv(key) or env_file.get(key) or default


def _build_database_url(env_file: dict[str, str]) -> str | None:
    database_url = _env_value(env_file, "DATABASE_URL")

    if database_url:
        return database_url

    host = _env_value(env_file, "DB_HOST")
    name = _env_value(env_file, "DB_NAME")
    user = _env_value(env_file, "DB_USER")
    password = _env_value(env_file, "DB_PASSWORD")
    port = _env_value(env_file, "DB_PORT", "5432")

    if not all([host, name, user, password]):
        return None

    return f"pq://{quote_plus(user)}:{quote_plus(password)}@{host}:{port}/{name}"


class Settings(BaseModel):
    project_name: str = "Clockwork API"
    version: str = "1.0.0"
    description: str = "API for Clockwork application"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = ["http://localhost:5173"]
    database_url: str | None = None


_env_file = _load_env_file()
settings = Settings(database_url=_build_database_url(_env_file))
