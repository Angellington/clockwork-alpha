from datetime import datetime, timezone
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from yt_dlp import YoutubeDL


def normalize_youtube_playlist_url(url: str) -> tuple[str, str]:
    raw_url = url.strip()

    if "://" not in raw_url:
        raw_url = f"https://{raw_url}"

    parsed_url = urlparse(raw_url)
    host = parsed_url.netloc.lower()

    if host.startswith("www."):
        host = host[4:]

    playlist_id = parse_qs(parsed_url.query).get("list", [None])[0]

    if host not in {"youtube.com", "m.youtube.com"} or not playlist_id:
        raise ValueError("Invalid Youtube playlist URL")

    query = urlencode({"list": playlist_id})
    normalized = urlunparse(("https", "www.youtube.com", "/playlist", "", query, ""))
    return normalized, playlist_id


def get_youtube_playlist_metadata(url: str) -> dict:
    options = {
        "extract_flat": True,
        "ignoreerrors": False,
        "quiet": True,
        "skip_download": True,
    }

    with YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)

    return {
        "title": info.get("title") or "Youtube playlist",
        "channel": info.get("channel") or info.get("uploader"),
        "entries": info.get("entries") or [],
    }


def video_url_from_entry(entry: dict) -> str | None:
    video_id = entry.get("id")

    if not video_id:
        return entry.get("url")

    return f"https://www.youtube.com/watch?v={video_id}"


def parse_yt_dlp_date(value: str | None) -> datetime | None:
    if not value:
        return None

    try:
        return datetime.strptime(value, "%Y%m%d").replace(tzinfo=timezone.utc)
    except ValueError:
        return None
