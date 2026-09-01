from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from controller.download_video import download_video
from controller.getThumbnail import getThumbnail
from controller.getResolutions import getResolutions
from controller.youtube_url import normalize_youtube_url


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
class YoutubeUrlRequest(BaseModel):
    url: str


class YoutubeDownloadRequest(YoutubeUrlRequest):
    resolution: str


def youtube_error_detail(error: Exception) -> str:
    message = str(error)

    if "bot" in message.lower():
        return (
            "Youtube blocked this backend request as automated traffic. "
            "Try again later or configure the backend with a valid YouTube session/cookies."
        )

    return message

@router.post("/streams/")
def view_resolutions(video: YoutubeUrlRequest):
    try:
        url = normalize_youtube_url(video.url)
        reso = getResolutions(url)
        print("reso", reso)
        return {
            "resolution": reso
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=youtube_error_detail(e))
        

@router.post("/thumbnail/")
def download_by_thumbnail(video: YoutubeUrlRequest):
    try:
        url = normalize_youtube_url(video.url)
        video_details = getThumbnail(url)

        return {
            "thumbnail": video_details.get("thumbnail"),
            "title": video_details.get("title"),
            "description": video_details.get("description"),
            "duration": video_details.get("duration"),
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=youtube_error_detail(e))

@router.post("/download/")
def download_by_resolution(video: YoutubeDownloadRequest):
    url = video.url
    resolution = video.resolution
    if not url:
        raise HTTPException(status_code=400, detail=f"Missing url in request body")

    try:
        url = normalize_youtube_url(url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    success, error_message = download_video(url, resolution)

    if success:
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Video with resolution {resolution} downloaded successfully"
            }
)
    else: 
        raise HTTPException(status_code=502, detail=youtube_error_detail(Exception(error_message)))
    
app.include_router(router)
