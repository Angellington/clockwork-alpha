from pathlib import Path
import re

from pytubefix import YouTube
import subprocess
import os


def download_video(url, resolution):
    try:
        yt = YouTube(url)
        safe_title = re.sub(r'[<>:"/\\|?*]', '', yt.title)        
        print("yt", yt)
        video_id = url.split("v=")[1].split("&")[0]
        out_dir = Path.home() / "Downloads" / video_id
        os.makedirs(out_dir, exist_ok=True)

        stream = yt.streams.filter(
            progressive=True,
            file_extension="mp4",
            res=resolution
        ).first()

        if stream:
            stream.download(output_path=out_dir)

            return True, None
        print("Trying adaptive streams...")

        video_stream = yt.streams.filter(
            res=resolution,
            adaptive=True,
            file_extension="mp4"
        ).first()

        print(f"video_stream: {video_stream}") 

        if not video_stream:
            return False, f"Resolution {resolution} not found"

        audio_stream = (
            yt.streams
            .filter(only_audio=True)
            .order_by("abr")
            .desc()
            .first()
        )

        print(f"audio_stream: {audio_stream}")  

        if not audio_stream:
            return False, "Audio stream not found"

        print("Iniciando download do video...") 
        video_file = video_stream.download(
            output_path=out_dir,
            filename="video.mp4"
        )

        print("Iniciando download do audio...") 
        audio_file = audio_stream.download(
            output_path=out_dir,
            filename="audio.m4a"
        )

        output_file = os.path.join(out_dir, f"{safe_title}.mp4")

        # ffmpeg - vou ter que colocar em um docker
        subprocess.run([
            r"C:\Users\wellington.barbosa\Downloads\ffmpeg-2026-06-26-git-d66e84695b-essentials_build\ffmpeg-2026-06-26-git-d66e84695b-essentials_build\bin\ffmpeg.exe",
            "-y",
            "-i", video_file,
            "-i", audio_file,
            "-c:v", "copy",
            "-c:a", "aac",
            output_file,

        ], check=True)

        os.remove(video_file)
        os.remove(audio_file)


        return True, None

    except Exception as e:
        return False, str(e)