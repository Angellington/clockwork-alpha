from dataclasses import asdict, dataclass
from threading import Lock
from time import sleep
from uuid import uuid4

from app.core.database import open_database
from app.repositories import quarantine as repository
from app.services.quarantine import _video_payload, _youtube_video_id
from app.services.youtube_playlist import (
    get_youtube_playlist_metadata,
    normalize_youtube_playlist_url,
    video_url_from_entry,
)

IMPORT_INTERVAL_SECONDS = 10


@dataclass
class ImportJob:
    id: str
    url: str
    status: str = "queued"
    playlist_id: int | None = None
    total_videos: int = 0
    processed_videos: int = 0
    failed_videos: int = 0
    cancel_reason: str | None = None


_jobs: dict[str, ImportJob] = {}
_jobs_lock = Lock()


def create_import_job(url: str) -> dict:
    job = ImportJob(id=str(uuid4()), url=url)
    with _jobs_lock:
        _jobs[job.id] = job
    return asdict(job)


def get_import_job(job_id: str) -> dict | None:
    with _jobs_lock:
        job = _jobs.get(job_id)
        return asdict(job) if job else None


def _update_job(job_id: str, **values) -> None:
    with _jobs_lock:
        job = _jobs[job_id]
        for key, value in values.items():
            setattr(job, key, value)


def run_youtube_playlist_import(job_id: str) -> None:
    job = get_import_job(job_id)
    if not job:
        return

    _update_job(job_id, status="running")

    try:
        normalized_url, playlist_source_id = normalize_youtube_playlist_url(job["url"])
        metadata = get_youtube_playlist_metadata(normalized_url)
        entries = metadata["entries"]
        _update_job(job_id, total_videos=len(entries))

        with open_database() as db:
            if repository.get_youtube_playlist(db, playlist_source_id):
                _update_job(
                    job_id,
                    status="cancelled",
                    cancel_reason="Youtube playlist already imported",
                )
                return

            try:
                playlist = repository.create_youtube_playlist(
                    db,
                    {
                        "name": metadata["title"],
                        "channel": metadata.get("channel"),
                        "source_playlist_id": playlist_source_id,
                        "source_url": normalized_url,
                    },
                )
                _update_job(job_id, playlist_id=playlist["id"])

                for index, entry in enumerate(entries):
                    video_url = video_url_from_entry(entry)
                    if not video_url:
                        raise ValueError(f"Playlist entry at position {index} has no video URL")

                    video_source_id = _youtube_video_id(video_url)
                    video = repository.get_video_by_youtube_id(db, video_source_id)

                    if not video:
                        payload = _video_payload(video_url, allow_missing_metadata=True)
                        video = repository.create_video(db, payload)

                    repository.add_video_to_playlist(db, playlist["id"], video["id"], index)
                    _update_job(job_id, processed_videos=index + 1)

                    if index < len(entries) - 1:
                        sleep(IMPORT_INTERVAL_SECONDS)

                db.commit()
                _update_job(job_id, status="completed")
            except Exception as error:
                db.rollback()
                _update_job(
                    job_id,
                    status="cancelled",
                    failed_videos=1,
                    cancel_reason=str(error),
                )
    except Exception as error:
        _update_job(job_id, status="failed", failed_videos=1, cancel_reason=str(error))
