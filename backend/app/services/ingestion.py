from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Sighting
from app.services.elanco_client import fetch_sightings
from app.services.locations import find_location


def clean_record(record: dict) -> dict | None:
    for key in ["id", "date", "species", "location"]:
        if not record.get(key):
            return None

    try:
        date_seen = datetime.fromisoformat(record["date"]).date()
    except (ValueError, TypeError):
        return None

    loc = find_location(record["location"])
    if loc is None:
        return None

    return {
        "external_id": record["id"],
        "date_seen": date_seen,
        "species": record["species"].strip(),
        "latin_name": record.get("latinName"),
        "location": loc["name"],
        "region": loc["region"],
        "latitude": loc["lat"],
        "longitude": loc["lng"],
        "location_precision": "city",
        "tick_count": 1,
        "source": "elanco",
    }


def run_ingestion(db: Session) -> dict:
    records = fetch_sightings()
    existing_ids = set(db.scalars(select(Sighting.external_id)))

    added = 0
    duplicates = 0
    skipped = 0

    for record in records:
        row = clean_record(record)
        if row is None:
            skipped += 1
        elif row["external_id"] in existing_ids:
            duplicates += 1
        else:
            db.add(Sighting(**row))
            existing_ids.add(row["external_id"])
            added += 1

    db.commit()
    return {"fetched": len(records), "added": added, "duplicates": duplicates, "skipped": skipped}


def ingest_if_empty(db: Session):
    first = db.scalar(select(Sighting).where(Sighting.source == "elanco"))
    if first is None:
        run_ingestion(db)
