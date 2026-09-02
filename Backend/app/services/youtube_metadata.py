from datetime import datetime, timezone

from pytubefix import YouTube
from yt_dlp import YoutubeDL


def _parse_upload_date(value: str | None):
    if not value:
        return None

    try:
        return datetime.strptime(value, "%Y%m%d").replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def get_thumbnail(url: str) -> dict:
    try:
        yt = YouTube(url)
        published_at = None

        if yt.publish_date:
            published_at = datetime.combine(yt.publish_date, datetime.min.time(), tzinfo=timezone.utc)

        return {
            "thumbnail": yt.thumbnail_url,
            "title": yt.title,
            "description": yt.description,
            "duration": yt.length,
            "channel": yt.author,
            "published_at": published_at,
            "provider": "pytubefix",
        }
    except Exception as pytube_error:
        try:
            options = {
                "quiet": True,
                "skip_download": True,
                "noplaylist": True,
            }

            with YoutubeDL(options) as ydl:
                info = ydl.extract_info(url, download=False)

            return {
                "thumbnail": info.get("thumbnail"),
                "title": info.get("title"),
                "description": info.get("description"),
                "duration": info.get("duration"),
                "channel": info.get("channel") or info.get("uploader"),
                "published_at": _parse_upload_date(info.get("upload_date")),
                "provider": "yt-dlp",
            }
        except Exception as ytdlp_error:
            raise RuntimeError(f"pytubefix: {pytube_error}; yt-dlp: {ytdlp_error}") from ytdlp_error
