from datetime import date

from fastapi import HTTPException

from app.models import Sighting


def apply_filters(
    stmt,
    date_from: date | None = None,
    date_to: date | None = None,
    species: str | None = None,
    location: str | None = None,
    region: str | None = None,
):
    if date_from and date_to and date_from > date_to:
        raise HTTPException(status_code=400, detail="'from' must be on or before 'to'")
    if date_from:
        stmt = stmt.where(Sighting.date_seen >= date_from)
    if date_to:
        stmt = stmt.where(Sighting.date_seen <= date_to)
    if species:
        stmt = stmt.where(Sighting.species == species)
    if location:
        stmt = stmt.where(Sighting.location.ilike(f"%{location}%"))
    if region:
        stmt = stmt.where(Sighting.region == region)
    return stmt
