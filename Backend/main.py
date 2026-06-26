import re
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from controller.download_video import download_video


app = FastAPI()

class YoutubeVideo(BaseModel):
    url: str;
    resolution: str;


def is_valid_youtube_url(url):
    pattern = r"^(https?://)?(www\.)?youtube\.com/watch\?v=[\w-]+(&\S*)?$"
    return re.match(pattern, url) is not None

@app.post("/download/")
def download_by_resolution(video: YoutubeVideo):
    url = video.url
    resolution = video.resolution
    if not url:
        raise HTTPException(status_code=400, detail=f"Missing url in request body")

    if not is_valid_youtube_url(url):
        raise HTTPException(status_code=400, detail=f"Invalid Youtube URL")

    success, error_message = download_video(url, resolution)

    if success:
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Video with resolution {resolution} downloaded successfully"
            }
)
    else: 
        raise HTTPException(status_code=500, detail=error_message)