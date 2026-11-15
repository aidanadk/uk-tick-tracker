import httpx

from app.config import settings


class ElancoAPIError(Exception):
    pass


def fetch_sightings() -> list[dict]:
    url = settings.elanco_api_url.rstrip("/") + "/data/tick-sightings"
    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
    except (httpx.HTTPError, ValueError) as e:
        raise ElancoAPIError(f"Could not fetch sightings: {e}")

    if not isinstance(data, list):
        raise ElancoAPIError("Expected a list of sightings")
    return data
