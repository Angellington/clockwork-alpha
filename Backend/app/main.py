from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.cors import setup_cors


def create_app() -> FastAPI:
    app = FastAPI(
        version=settings.version,
        title=settings.project_name,
        description=settings.description,
    )
    setup_cors(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
