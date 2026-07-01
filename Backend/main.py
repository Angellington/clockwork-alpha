import re
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from controller.download_video import download_video
from controller.getThumbnail import getThumbnail
from controller.getResolutions import getResolutions


app = FastAPI(version="1.0.0", title="Clockwork API", description="API for Clockwork application")

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api/v1")
class YoutubeVideo(BaseModel):
    url: str;
    resolution: str;


def is_valid_youtube_url(url):
    pattern = r"^(https?://)?(www\.)?youtube\.com/watch\?v=[\w-]+(&\S*)?$"
    return re.match(pattern, url) is not None

@router.post("/streams/")
def view_resolutions(video: YoutubeVideo):
    try:
        reso = getResolutions(video.url)
        print("reso", reso)
        return {
            "resolution": reso
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@router.post("/thumbnail/")
def download_by_thumbnail(video: YoutubeVideo):
    try:
        thumbnail = getThumbnail(video.url)

        return {
            "thumbnail": thumbnail
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/download/")
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
    
app.include_router(router)