from urllib.parse import parse_qs, urlparse


def normalize_youtube_url(url: str) -> str:
    raw_url = url.strip()

    if "://" not in raw_url:
        raw_url = f"https://{raw_url}"

    parsed_url = urlparse(raw_url)
    host = parsed_url.netloc.lower()

    if host.startswith("www."):
        host = host[4:]

    video_id = None

    if host in {"youtube.com", "m.youtube.com"} and parsed_url.path == "/watch":
        video_id = parse_qs(parsed_url.query).get("v", [None])[0]
    elif host == "youtu.be":
        video_id = parsed_url.path.strip("/") or None

    if not video_id:
        raise ValueError("Invalid Youtube URL")

    return f"https://www.youtube.com/watch?v={video_id}"
