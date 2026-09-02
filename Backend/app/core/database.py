from collections.abc import Generator

from psycopg import Connection, connect
from psycopg.rows import dict_row

from app.core.config import settings


def open_database() -> Connection:
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL or DB_* variables are not configured")

    return connect(settings.database_url, row_factory=dict_row)


def get_db() -> Generator[Connection, None, None]:
    db = open_database()

    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> bool:
    with open_database() as db:
        with db.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

    return True


def ensure_quarantine_schema() -> None:
    with open_database() as db:
        with db.cursor() as cursor:
            cursor.execute(
                """
                ALTER TABLE IF EXISTS quarantine_playlists
                ADD COLUMN IF NOT EXISTS description text
                """
            )
        db.commit()
