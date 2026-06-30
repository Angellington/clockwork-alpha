from pytubefix import YouTube

def getThumbnail(url):
    try:
        yt = YouTube(url)
        return yt.thumbnail_url
    except Exception as e:
        raise e