from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from psycopg import Connection

from app.core.database import get_db
from app.schemas.quarantine import (
    QuarantineOverviewResponse,
    QuarantinePlaylist,
    QuarantinePlaylistCreateRequest,
    QuarantinePlaylistImportRequest,
    QuarantinePlaylistItem,
    QuarantinePlaylistVideosRequest,
    QuarantineUrlPreview,
    QuarantineImportJob,
    QuarantineBatchVideosResponse,
    QuarantineBatchVideosRequest,
    QuarantineVideo,
    QuarantineVideoUrlRequest,
)
from app.services.quarantine import (
    DuplicateQuarantineResource,
    QuarantineResourceNotFound,
    add_videos_to_playlist,
    create_manual_playlist,
    create_video_from_url,
    delete_video,
    delete_playlist,
    preview_url,
    mark_videos_watched,
    delete_videos,
    delete_playlist_item,
    get_video,
    import_youtube_playlist,
    list_overview,
    list_playlist_items,
    mark_video_watched,
)
from app.services.quarantine_imports import create_import_job, get_import_job, run_youtube_playlist_import
from app.services.youtube_errors import youtube_error_detail

router = APIRouter(prefix="/quarantine", tags=["quarantine"])


@router.get("", response_model=QuarantineOverviewResponse)
def view_quarantine(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Connection = Depends(get_db),
):
    return list_overview(db, page, page_size)


@router.post("/preview", response_model=QuarantineUrlPreview)
def preview_quarantine_url(video: QuarantineVideoUrlRequest):
    try:
        return preview_url(video.url)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error


@router.patch("/videos/watched/batch", response_model=QuarantineBatchVideosResponse)
def mark_watched_batch(payload: QuarantineBatchVideosRequest, db: Connection = Depends(get_db)):
    return {"videos": mark_videos_watched(db, payload.video_ids)}


@router.delete("/videos/batch", response_model=QuarantineBatchVideosResponse)
def remove_videos_batch(payload: QuarantineBatchVideosRequest, db: Connection = Depends(get_db)):
    return {"videos": delete_videos(db, payload.video_ids)}


@router.post("/imports/youtube", response_model=QuarantineImportJob, status_code=202)
def start_youtube_import(
    playlist: QuarantinePlaylistImportRequest,
    background_tasks: BackgroundTasks,
):
    try:
        job = create_import_job(playlist.url)
        background_tasks.add_task(run_youtube_playlist_import, job["id"])
        return job
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/imports/{import_id}", response_model=QuarantineImportJob)
def view_import(import_id: str):
    job = get_import_job(import_id)
    if not job:
        raise HTTPException(status_code=404, detail="Import job not found")

    return job


@router.post("/videos", response_model=QuarantineVideo, status_code=201)
def add_video(video: QuarantineVideoUrlRequest, db: Connection = Depends(get_db)):
    try:
        return create_video_from_url(db, video.url)
    except DuplicateQuarantineResource as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error


@router.delete("/items/{item_id}")
def remove_playlist_item(item_id: int, db: Connection = Depends(get_db)):
    try:
        return delete_playlist_item(db, item_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete("/videos/{video_id}", response_model=QuarantineVideo)
def remove_video(video_id: int, db: Connection = Depends(get_db)):
    try:
        return delete_video(db, video_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/videos/{video_id}", response_model=QuarantineVideo)
def view_video(video_id: int, db: Connection = Depends(get_db)):
    try:
        return get_video(db, video_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.patch("/videos/{video_id}/watched", response_model=QuarantineVideo)
def mark_watched(video_id: int, db: Connection = Depends(get_db)):
    try:
        return mark_video_watched(db, video_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.post("/playlists", response_model=QuarantinePlaylist, status_code=201)
def add_playlist(playlist: QuarantinePlaylistCreateRequest, db: Connection = Depends(get_db)):
    return create_manual_playlist(db, playlist.name)


@router.post("/playlists/import/youtube", status_code=201)
def import_playlist(playlist: QuarantinePlaylistImportRequest, db: Connection = Depends(get_db)):
    try:
        return import_youtube_playlist(db, playlist.url)
    except DuplicateQuarantineResource as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=youtube_error_detail(error)) from error


@router.delete("/playlists/{playlist_id}", response_model=QuarantinePlaylist)
def remove_playlist(playlist_id: int, db: Connection = Depends(get_db)):
    try:
        return delete_playlist(db, playlist_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.post("/playlists/{playlist_id}/videos", status_code=201)
def add_playlist_videos(
    playlist_id: int,
    payload: QuarantinePlaylistVideosRequest,
    db: Connection = Depends(get_db),
):
    try:
        return {"items": add_videos_to_playlist(db, playlist_id, payload.video_ids)}
    except DuplicateQuarantineResource as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/playlists/{playlist_id}/items", response_model=list[QuarantinePlaylistItem])
def view_playlist_items(playlist_id: int, db: Connection = Depends(get_db)):
    try:
        return list_playlist_items(db, playlist_id)
    except QuarantineResourceNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
