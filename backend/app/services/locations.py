import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "uk_locations.json"


def normalise_name(name: str) -> str:
    return " ".join(name.split()).lower()


LOCATIONS = {}
with DATA_FILE.open() as f:
    for name, info in json.load(f).items():
        LOCATIONS[normalise_name(name)] = {
            "name": name,
            "lat": info["lat"],
            "lng": info["lng"],
            "region": info["region"],
        }


def find_location(name: str) -> dict | None:
    return LOCATIONS.get(normalise_name(name))
