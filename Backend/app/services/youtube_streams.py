from app.providers.pytubefix_provider import get_resolutions_with_pytubefix
from app.providers.ytdlp_provider import get_resolutions_with_ytdlp


def _is_successful_response(response: dict) -> bool:
    return bool(response.get("success"))


def get_resolutions(url: str) -> dict:
    errors = []

    for provider_name, provider in (
        ("pytubefix", get_resolutions_with_pytubefix),
        ("yt-dlp", get_resolutions_with_ytdlp),
    ):
        try:
            response = provider(url)

            if _is_successful_response(response):
                return response

            errors.append(f"{provider_name}: {response.get('message', 'No streams found')}")
        except Exception as error:
            errors.append(f"{provider_name}: {error}")

    raise RuntimeError("; ".join(errors))
