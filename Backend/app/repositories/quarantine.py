from typing import Any

from psycopg import Connection


def get_video_by_youtube_id(db: Connection, youtube_video_id: str) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM quarantine_videos WHERE youtube_video_id = %s",
            (youtube_video_id,),
        )
        return cursor.fetchone()


def get_video(db: Connection, video_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM quarantine_videos WHERE id = %s", (video_id,))
        return cursor.fetchone()


def create_video(db: Connection, data: dict[str, Any]) -> dict[str, Any]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO quarantine_videos (
                youtube_video_id,
                url,
                title,
                description,
                channel,
                thumbnail_url,
                duration_seconds,
                published_at
            )
            VALUES (
                %(youtube_video_id)s,
                %(url)s,
                %(title)s,
                %(description)s,
                %(channel)s,
                %(thumbnail_url)s,
                %(duration_seconds)s,
                %(published_at)s
            )
            RETURNING *
            """,
            data,
        )
        return cursor.fetchone()


def mark_video_watched(db: Connection, video_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE quarantine_videos
            SET watched = true,
                watched_at = COALESCE(watched_at, now()),
                updated_at = now()
            WHERE id = %s
            RETURNING *
            """,
            (video_id,),
        )
        return cursor.fetchone()


def create_manual_playlist(db: Connection, name: str) -> dict[str, Any]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO quarantine_playlists (name, source)
            VALUES (%s, 'manual')
            RETURNING *
            """,
            (name,),
        )
        return cursor.fetchone()


def get_playlist(db: Connection, playlist_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM quarantine_playlists WHERE id = %s", (playlist_id,))
        return cursor.fetchone()


def get_youtube_playlist(db: Connection, source_playlist_id: str) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT *
            FROM quarantine_playlists
            WHERE source = 'youtube' AND source_playlist_id = %s
            """,
            (source_playlist_id,),
        )
        return cursor.fetchone()


def create_youtube_playlist(db: Connection, data: dict[str, Any]) -> dict[str, Any]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO quarantine_playlists (
                name,
                channel,
                source,
                source_playlist_id,
                source_url,
                imported_at
            )
            VALUES (
                %(name)s,
                %(channel)s,
                'youtube',
                %(source_playlist_id)s,
                %(source_url)s,
                now()
            )
            RETURNING *
            """,
            data,
        )
        return cursor.fetchone()


def add_video_to_playlist(db: Connection, playlist_id: int, video_id: int, position: int = 0) -> dict[str, Any]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO quarantine_playlist_items (playlist_id, video_id, position)
            VALUES (%s, %s, %s)
            RETURNING *
            """,
            (playlist_id, video_id, position),
        )
        return cursor.fetchone()


def mark_videos_watched(db: Connection, video_ids: list[int]) -> list[dict[str, Any]]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE quarantine_videos
            SET watched = true,
                watched_at = COALESCE(watched_at, now()),
                updated_at = now()
            WHERE id = ANY(%s)
            RETURNING *
            """,
            (video_ids,),
        )
        return cursor.fetchall()


def delete_videos(db: Connection, video_ids: list[int]) -> list[dict[str, Any]]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM quarantine_videos
            WHERE id = ANY(%s)
            RETURNING *
            """,
            (video_ids,),
        )
        return cursor.fetchall()


def delete_playlist_item(db: Connection, item_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM quarantine_playlist_items
            WHERE id = %s
            RETURNING *
            """,
            (item_id,),
        )
        return cursor.fetchone()


def delete_video(db: Connection, video_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM quarantine_videos
            WHERE id = %s
            RETURNING *
            """,
            (video_id,),
        )
        return cursor.fetchone()


def delete_playlist(db: Connection, playlist_id: int) -> dict[str, Any] | None:
    with db.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM quarantine_playlists
            WHERE id = %s
            RETURNING *
            """,
            (playlist_id,),
        )
        return cursor.fetchone()


def list_overview(db: Connection, limit: int, offset: int) -> list[dict[str, Any]]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT *
            FROM (
                SELECT
                    'video' AS item_type,
                    video.id,
                    video.title,
                    video.description,
                    video.channel,
                    video.thumbnail_url,
                    video.duration_seconds,
                    video.published_at AS sort_at,
                    video.watched,
                    video.created_at
                FROM quarantine_videos video
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM quarantine_playlist_items item
                    WHERE item.video_id = video.id
                )
                UNION ALL
                SELECT
                    'playlist' AS item_type,
                    playlist.id,
                    playlist.name AS title,
                    NULL AS description,
                    playlist.channel,
                    first_video.thumbnail_url,
                    stats.duration_seconds,
                    playlist.created_at AS sort_at,
                    NULL AS watched,
                    playlist.created_at
                FROM quarantine_playlists playlist
                LEFT JOIN LATERAL (
                    SELECT SUM(video.duration_seconds)::INTEGER AS duration_seconds
                    FROM quarantine_playlist_items item
                    JOIN quarantine_videos video ON video.id = item.video_id
                    WHERE item.playlist_id = playlist.id
                ) stats ON true
                LEFT JOIN LATERAL (
                    SELECT video.thumbnail_url
                    FROM quarantine_playlist_items item
                    JOIN quarantine_videos video ON video.id = item.video_id
                    WHERE item.playlist_id = playlist.id
                    ORDER BY video.published_at DESC NULLS LAST, item.id DESC
                    LIMIT 1
                ) first_video ON true
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM quarantine_playlist_items item
                    WHERE item.child_playlist_id = playlist.id
                )
            ) overview
            ORDER BY sort_at DESC NULLS LAST, created_at DESC, id DESC
            LIMIT %s OFFSET %s
            """,
            (limit, offset),
        )
        return cursor.fetchall()


def list_playlist_items(db: Connection, playlist_id: int) -> list[dict[str, Any]]:
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                item.id AS item_id,
                item.position,
                video.id AS video_id,
                video.title AS video_title,
                video.url AS video_url,
                video.description AS video_description,
                video.thumbnail_url AS video_thumbnail_url,
                video.duration_seconds AS video_duration_seconds,
                video.published_at AS video_published_at,
                video.watched AS video_watched,
                child.id AS child_playlist_id,
                child.name AS child_playlist_name,
                child.created_at AS child_playlist_created_at
            FROM quarantine_playlist_items item
            LEFT JOIN quarantine_videos video ON video.id = item.video_id
            LEFT JOIN quarantine_playlists child ON child.id = item.child_playlist_id
            WHERE item.playlist_id = %s
            ORDER BY video.published_at DESC NULLS LAST, child.created_at DESC, item.id DESC
            """,
            (playlist_id,),
        )
        return cursor.fetchall()
