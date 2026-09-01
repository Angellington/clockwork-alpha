import os
from pathlib import Path
import re
import subprocess

from pytubefix import YouTube
from yt_dlp import YoutubeDL

FFMPEG_PATH = r"C:\Users\wellington.barbosa\Downloads\ffmpeg-2026-06-26-git-d66e84695b-essentials_build\ffmpeg-2026-06-26-git-d66e84695b-essentials_build\bin\ffmpeg.exe"


def get_downloads_dir() -> Path:
    return Path.home() / "Downloads"


def download_with_pytubefix(url: str, resolution: str) -> tuple[bool, str | None]:
    yt = YouTube(url)
    safe_title = re.sub(r'[<>:"/\\|?*]', '', yt.title)
    out_dir = get_downloads_dir()
    os.makedirs(out_dir, exist_ok=True)

    stream = yt.streams.filter(
        progressive=True,
        file_extension="mp4",
        res=resolution,
    ).first()

    if stream:
        stream.download(output_path=out_dir)
        return True, None

    video_stream = yt.streams.filter(
        res=resolution,
        adaptive=True,
        file_extension="mp4",
    ).first()

    if not video_stream:
        return False, f"Resolution {resolution} not found"

    audio_stream = yt.streams.filter(only_audio=True).order_by("abr").desc().first()

    if not audio_stream:
        return False, "Audio stream not found"

    video_file = video_stream.download(output_path=out_dir, filename="video.mp4")
    audio_file = audio_stream.download(output_path=out_dir, filename="audio.m4a")
    output_file = os.path.join(out_dir, f"{safe_title}.mp4")

    subprocess.run(
        [
            FFMPEG_PATH,
            "-y",
            "-i",
            video_file,
            "-i",
            audio_file,
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            output_file,
        ],
        check=True,
    )

    os.remove(video_file)
    os.remove(audio_file)

    return True, None


def download_with_ytdlp(url: str, resolution: str) -> tuple[bool, str | None]:
    height = int(re.sub(r"\D", "", resolution) or 0)
    out_dir = get_downloads_dir()
    os.makedirs(out_dir, exist_ok=True)

    exact_format = (
        f"bestvideo[height={height}][ext=mp4]+bestaudio[ext=m4a]/"
        f"best[height={height}][ext=mp4]"
    )
    fallback_format = (
        f"bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/"
        f"best[height<={height}][ext=mp4]/"
        f"best[height<={height}]"
    )
    format_selector = f"{exact_format}/{fallback_format}" if height else "best[ext=mp4]/best"

    options = {
        "format": format_selector,
        "ffmpeg_location": FFMPEG_PATH,
        "merge_output_format": "mp4",
        "noplaylist": True,
        "outtmpl": str(out_dir / "%(title).200B.%(ext)s"),
        "quiet": True,
        "windowsfilenames": True,
    }

    with YoutubeDL(options) as ydl:
        ydl.download([url])

    return True, None


def download_video(url: str, resolution: str) -> tuple[bool, str | None]:
    errors = []

    try:
        success, error = download_with_pytubefix(url, resolution)

        if success:
            return True, None

        errors.append(f"pytubefix: {error}")
    except Exception as error:
        errors.append(f"pytubefix: {error}")

    try:
        return download_with_ytdlp(url, resolution)
    except Exception as error:
        errors.append(f"yt-dlp: {error}")

    return False, "; ".join(errors)
