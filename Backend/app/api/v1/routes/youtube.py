from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.youtube import YoutubeDownloadRequest, YoutubeUrlRequest
from app.services.youtube_download import download_video
from app.services.youtube_errors import youtube_error_detail
from app.services.youtube_metadata import get_thumbnail
from app.services.youtube_streams import get_resolutions
from app.services.youtube_url import normalize_youtube_url

router = APIRouter(tags=["youtube"])


@router.post("/streams/")
def view_resolutions(video: YoutubeUrlRequest):
    try:
        url = normalize_youtube_url(video.url)
        return {"resolution": get_resolutions(url)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error


@router.post("/thumbnail/")
def download_by_thumbnail(video: YoutubeUrlRequest):
    try:
        url = normalize_youtube_url(video.url)
        video_details = get_thumbnail(url)

        return {
            "thumbnail": video_details.get("thumbnail"),
            "title": video_details.get("title"),
            "description": video_details.get("description"),
            "duration": video_details.get("duration"),
        }
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error


@router.post("/download/")
def download_by_resolution(video: YoutubeDownloadRequest):
    if not video.url:
        raise HTTPException(status_code=400, detail="Missing url in request body")

    try:
        url = normalize_youtube_url(video.url)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    success, error_message = download_video(url, video.resolution)

    if not success:
        error = Exception(error_message)
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error

    return JSONResponse(
        status_code=200,
        content={"message": f"Video with resolution {video.resolution} downloaded successfully"},
    )
