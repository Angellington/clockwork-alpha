from pytubefix import YouTube


def getResolutions(url: str) -> dict:
    yt = YouTube(url)

    video_streams = list(
        yt.streams.filter(progressive=True, file_extension="mp4")
    )

    audio_streams = list(
        yt.streams.filter(only_audio=True).order_by("abr").desc()
    )

    if not video_streams:
        return {
            "success": False,
            "message": "No progressive streams found"
        }

    if not audio_streams:
        return {
            "success": False,
            "message": "No audio streams found"
        }

    resolutions = [
        {
            "itag": stream.itag,
            "resolution": stream.resolution,
            "fps": stream.fps,
            "mimeType": stream.mime_type,
            "subtype": stream.subtype,
        }
        for stream in video_streams
    ]

    audios = [
        {
            "itag": stream.itag,
            "abr": stream.abr,
            "mimeType": stream.mime_type,
            "subtype": stream.subtype,
            "audioCodec": stream.audio_codec,
        }
        for stream in audio_streams
    ]

    return {
        "success": True,
        "video": resolutions,
        "audio": audios,
    }