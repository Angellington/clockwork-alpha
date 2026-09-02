from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class QuarantineVideoUrlRequest(BaseModel):
    url: str


class QuarantinePlaylistCreateRequest(BaseModel):
    name: str = Field(min_length=1)


class QuarantinePlaylistImportRequest(BaseModel):
    url: str


class QuarantinePlaylistVideosRequest(BaseModel):
    video_ids: list[int] = Field(min_length=1)


class QuarantineVideo(BaseModel):
    id: int
    youtube_video_id: str
    url: str
    title: str
    description: str | None = None
    channel: str | None = None
    thumbnail_url: str | None = None
    duration_seconds: int | None = None
    published_at: datetime | None = None
    watched: bool
    watched_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class QuarantinePlaylist(BaseModel):
    id: int
    name: str
    channel: str | None = None
    source: Literal["manual", "youtube"]
    source_playlist_id: str | None = None
    source_url: str | None = None
    imported_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class QuarantineOverviewItem(BaseModel):
    item_type: Literal["video", "playlist"]
    id: int
    title: str
    description: str | None = None
    channel: str | None = None
    thumbnail_url: str | None = None
    duration_seconds: int | None = None
    sort_at: datetime | None = None
    watched: bool | None = None
    created_at: datetime


class QuarantineOverviewResponse(BaseModel):
    page: int
    page_size: int
    items: list[QuarantineOverviewItem]


class QuarantinePlaylistItem(BaseModel):
    item_id: int
    position: int
    video_id: int | None = None
    video_title: str | None = None
    video_url: str | None = None
    video_description: str | None = None
    video_thumbnail_url: str | None = None
    video_duration_seconds: int | None = None
    video_published_at: datetime | None = None
    video_watched: bool | None = None
    child_playlist_id: int | None = None
    child_playlist_name: str | None = None
    child_playlist_created_at: datetime | None = None


class QuarantineUrlPreview(BaseModel):
    item_type: Literal["video", "playlist"]
    url: str
    title: str
    description: str | None = None
    channel: str | None = None
    thumbnail_url: str | None = None
    duration_seconds: int | None = None
    published_at: datetime | None = None
    video_count: int | None = None


class QuarantineImportJob(BaseModel):
    id: str
    status: Literal["queued", "running", "completed", "cancelled", "failed"]
    playlist_id: int | None = None
    total_videos: int = 0
    processed_videos: int = 0
    failed_videos: int = 0
    cancel_reason: str | None = None


class QuarantineBatchVideosRequest(BaseModel):
    video_ids: list[int] = Field(min_length=1)


class QuarantineBatchVideosResponse(BaseModel):
    videos: list[QuarantineVideo]
