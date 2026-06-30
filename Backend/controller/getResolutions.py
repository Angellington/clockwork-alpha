from pytubefix import YouTube

def getResolutions(url) -> str:
    try:
        yt = YouTube(url)

        return yt.metadata    

    except Exception as e:
        raise e
