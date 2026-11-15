import calendar
from datetime import date, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Sighting
from app.services.filters import apply_filters

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/by-region")
def by_region(
    date_from: date | None = Query(default=None, alias="from"),
    date_to: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
):
    stmt = apply_filters(select(Sighting.region), date_from, date_to)

    counts = {}
    for region in db.scalars(stmt):
        name = region or "Unknown"
        counts[name] = counts.get(name, 0) + 1

    result = [{"region": name, "count": count} for name, count in counts.items()]
    return sorted(result, key=lambda row: row["count"], reverse=True)


@router.get("/trends")
def trends(
    interval: Literal["week", "month"] = "month",
    date_from: date | None = Query(default=None, alias="from"),
    date_to: date | None = Query(default=None, alias="to"),
    location: str | None = None,
    region: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = apply_filters(select(Sighting.date_seen), date_from, date_to, location=location, region=region)

    counts = {}
    for day in db.scalars(stmt):
        if interval == "week":
            start = day - timedelta(days=day.weekday())
        else:
            start = day.replace(day=1)
        counts[start] = counts.get(start, 0) + 1

    return [{"period": start.isoformat(), "count": counts[start]} for start in sorted(counts)]


@router.get("/seasonal")
def seasonal(location: str | None = None, region: str | None = None, db: Session = Depends(get_db)):
    stmt = apply_filters(select(Sighting.date_seen), location=location, region=region)

    counts = [0] * 12
    for day in db.scalars(stmt):
        counts[day.month - 1] += 1

    return [
        {"month": i + 1, "label": calendar.month_abbr[i + 1], "count": counts[i]}
        for i in range(12)
    ]
