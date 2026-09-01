from yt_dlp import YoutubeDL


def _format_resolution(stream: dict) -> str | None:
    height = stream.get("height")

    if height:
        return f"{height}p"

    return stream.get("resolution")


def get_resolutions_with_ytdlp(url: str) -> dict:
    options = {
        "quiet": True,
        "skip_download": True,
        "noplaylist": True,
    }

    with YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = info.get("formats", [])

    video_streams = [
        stream
        for stream in formats
        if stream.get("vcodec") != "none"
        and stream.get("ext") == "mp4"
        and stream.get("url")
    ]

    audio_streams = [
        stream
        for stream in formats
        if stream.get("acodec") != "none"
        and stream.get("vcodec") == "none"
        and stream.get("url")
    ]

    if not video_streams:
        return {
            "success": False,
            "message": "No mp4 video streams found with yt-dlp"
        }

    if not audio_streams:
        return {
            "success": False,
            "message": "No audio streams found with yt-dlp"
        }

    videos = [
        {
            "itag": stream.get("format_id"),
            "resolution": _format_resolution(stream),
            "fps": stream.get("fps"),
            "mimeType": stream.get("mime_type") or stream.get("ext"),
            "subtype": stream.get("ext"),
        }
        for stream in video_streams
    ]

    audios = [
        {
            "itag": stream.get("format_id"),
            "abr": stream.get("abr"),
            "mimeType": stream.get("mime_type") or stream.get("ext"),
            "subtype": stream.get("ext"),
            "audioCodec": stream.get("acodec"),
        }
        for stream in audio_streams
    ]

    return {
        "success": True,
        "provider": "yt-dlp",
        "video": videos,
        "audio": audios,
    }
