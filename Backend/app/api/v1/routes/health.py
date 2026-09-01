from fastapi import APIRouter, HTTPException

from app.core.database import check_database_connection

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/database")
def database_health():
    try:
        check_database_connection()
    except Exception as error:
        raise HTTPException(status_code=503, detail="Database connection failed") from error

    return {"database": "ok"}
