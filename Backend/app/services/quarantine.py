from datetime import datetime, timezone
from urllib.parse import parse_qs, urlparse

from psycopg import Connection
from psycopg.errors import UniqueViolation

from app.repositories import quarantine as repository
from app.services.youtube_metadata import get_thumbnail
from app.services.youtube_playlist import (
    get_youtube_playlist_metadata,
    normalize_youtube_playlist_url,
    video_url_from_entry,
)
from app.services.youtube_url import normalize_youtube_url


class DuplicateQuarantineResource(ValueError):
    pass


class QuarantineResourceNotFound(ValueError):
    pass


def _youtube_video_id(url: str) -> str:
    normalized_url = normalize_youtube_url(url)
    parsed_url = urlparse(normalized_url)
    video_id = parse_qs(parsed_url.query).get("v", [None])[0]

    if not video_id:
        raise ValueError("Invalid Youtube URL")

    return video_id


def _video_payload(url: str, allow_missing_metadata: bool = False) -> dict:
    normalized_url = normalize_youtube_url(url)
    metadata = get_thumbnail(normalized_url)

    title = metadata.get("title")
    if not title and not allow_missing_metadata:
        raise ValueError("Youtube video title was not found")

    return {
        "youtube_video_id": _youtube_video_id(normalized_url),
        "url": normalized_url,
        "title": title or "Untitled Youtube video",
        "description": metadata.get("description"),
        "channel": metadata.get("channel"),
        "thumbnail_url": metadata.get("thumbnail"),
        "duration_seconds": metadata.get("duration"),
        "published_at": metadata.get("published_at"),
    }


def preview_url(url: str) -> dict:
    try:
        normalized_url, _ = normalize_youtube_playlist_url(url)
        metadata = get_youtube_playlist_metadata(normalized_url)
        return {
            "item_type": "playlist",
            "url": normalized_url,
            "title": metadata["title"],
            "channel": metadata.get("channel"),
            "video_count": len(metadata["entries"]),
        }
    except ValueError:
        pass

    data = _video_payload(url)
    return {
        "item_type": "video",
        "url": data["url"],
        "title": data["title"],
        "description": data.get("description"),
        "channel": data.get("channel"),
        "thumbnail_url": data.get("thumbnail_url"),
        "duration_seconds": data.get("duration_seconds"),
        "published_at": data.get("published_at"),
    }


def create_video_from_url(db: Connection, url: str) -> dict:
    data = _video_payload(url)

    if repository.get_video_by_youtube_id(db, data["youtube_video_id"]):
        raise DuplicateQuarantineResource("Video already exists in quarantine")

    try:
        video = repository.create_video(db, data)
        db.commit()
        return video
    except Exception:
        db.rollback()
        raise


def get_video(db: Connection, video_id: int) -> dict:
    video = repository.get_video(db, video_id)

    if not video:
        raise QuarantineResourceNotFound("Video not found")

    return video


def mark_video_watched(db: Connection, video_id: int) -> dict:
    try:
        video = repository.mark_video_watched(db, video_id)

        if not video:
            raise QuarantineResourceNotFound("Video not found")

        db.commit()
        return video
    except Exception:
        db.rollback()
        raise


def create_manual_playlist(db: Connection, name: str) -> dict:
    try:
        playlist = repository.create_manual_playlist(db, name.strip())
        db.commit()
        return playlist
    except Exception:
        db.rollback()
        raise


def add_videos_to_playlist(db: Connection, playlist_id: int, video_ids: list[int]) -> list[dict]:
    if not repository.get_playlist(db, playlist_id):
        raise QuarantineResourceNotFound("Playlist not found")

    items = []

    try:
        for index, video_id in enumerate(video_ids):
            if not repository.get_video(db, video_id):
                raise QuarantineResourceNotFound(f"Video {video_id} not found")

            items.append(repository.add_video_to_playlist(db, playlist_id, video_id, index))

        db.commit()
        return items
    except UniqueViolation as error:
        db.rollback()
        raise DuplicateQuarantineResource("Video already exists in this playlist") from error
    except Exception:
        db.rollback()
        raise


def import_youtube_playlist(db: Connection, url: str) -> dict:
    normalized_url, playlist_id = normalize_youtube_playlist_url(url)

    if repository.get_youtube_playlist(db, playlist_id):
        raise DuplicateQuarantineResource("Youtube playlist already imported")

    metadata = get_youtube_playlist_metadata(normalized_url)

    try:
        playlist = repository.create_youtube_playlist(
            db,
            {
                "name": metadata["title"],
                "channel": metadata.get("channel"),
                "source_playlist_id": playlist_id,
                "source_url": normalized_url,
            },
        )

        items = []
        for index, entry in enumerate(metadata["entries"]):
            video_url = video_url_from_entry(entry)

            if not video_url:
                raise ValueError(f"Playlist entry at position {index} has no video URL")

            video_id = _youtube_video_id(video_url)
            video = repository.get_video_by_youtube_id(db, video_id)

            if not video:
                payload = _video_payload(video_url, allow_missing_metadata=True)
                video = repository.create_video(db, payload)

            items.append(repository.add_video_to_playlist(db, playlist["id"], video["id"], index))

        db.commit()
        return {"playlist": playlist, "items": items}
    except UniqueViolation as error:
        db.rollback()
        raise DuplicateQuarantineResource("Playlist import created duplicate data") from error
    except Exception:
        db.rollback()
        raise


def mark_videos_watched(db: Connection, video_ids: list[int]) -> list[dict]:
    try:
        videos = repository.mark_videos_watched(db, video_ids)
        db.commit()
        return videos
    except Exception:
        db.rollback()
        raise


def delete_videos(db: Connection, video_ids: list[int]) -> list[dict]:
    try:
        videos = repository.delete_videos(db, video_ids)
        db.commit()
        return videos
    except Exception:
        db.rollback()
        raise


def delete_playlist_item(db: Connection, item_id: int) -> dict:
    try:
        item = repository.delete_playlist_item(db, item_id)

        if not item:
            raise QuarantineResourceNotFound("Playlist item not found")

        db.commit()
        return item
    except Exception:
        db.rollback()
        raise


def delete_video(db: Connection, video_id: int) -> dict:
    try:
        video = repository.delete_video(db, video_id)

        if not video:
            raise QuarantineResourceNotFound("Video not found")

        db.commit()
        return video
    except Exception:
        db.rollback()
        raise


def delete_playlist(db: Connection, playlist_id: int) -> dict:
    try:
        playlist = repository.delete_playlist(db, playlist_id)

        if not playlist:
            raise QuarantineResourceNotFound("Playlist not found")

        db.commit()
        return playlist
    except Exception:
        db.rollback()
        raise


def list_overview(db: Connection, page: int, page_size: int) -> dict:
    safe_page = max(page, 1)
    safe_page_size = min(max(page_size, 1), 100)
    offset = (safe_page - 1) * safe_page_size

    return {
        "page": safe_page,
        "page_size": safe_page_size,
        "items": repository.list_overview(db, safe_page_size, offset),
    }


def list_playlist_items(db: Connection, playlist_id: int) -> list[dict]:
    if not repository.get_playlist(db, playlist_id):
        raise QuarantineResourceNotFound("Playlist not found")

    return repository.list_playlist_items(db, playlist_id)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)
