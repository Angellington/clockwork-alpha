def youtube_error_detail(error: Exception) -> str:
    message = str(error)

    if "bot" in message.lower():
        return (
            "Youtube blocked this backend request as automated traffic. "
            "Try again later or configure the backend with a valid YouTube session/cookies."
        )

    return message
