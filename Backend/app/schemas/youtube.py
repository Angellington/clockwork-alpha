from pydantic import BaseModel


class YoutubeUrlRequest(BaseModel):
    url: str


class YoutubeDownloadRequest(YoutubeUrlRequest):
    resolution: str
