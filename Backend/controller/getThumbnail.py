from pytubefix import YouTube
from yt_dlp import YoutubeDL

def getThumbnail(url):
    try:
        yt = YouTube(url)
        return {
            "thumbnail": yt.thumbnail_url,
            "title": yt.title,
            "description": yt.description,
            "duration": yt.length,
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
                "provider": "yt-dlp",
            }
        except Exception as ytdlp_error:
            raise RuntimeError(f"pytubefix: {pytube_error}; yt-dlp: {ytdlp_error}")
