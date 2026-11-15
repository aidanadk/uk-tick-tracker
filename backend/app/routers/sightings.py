import logging
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Sighting
from app.schemas import SightingCreate, SightingOut

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sightings", tags=["sightings"])

@router.post("", response_model=SightingOut, status_code=status.HTTP_201_CREATED)
def create_sighting(payload: SightingCreate, db: Session = Depends(get_db)):
    sighting = Sighting(
        **payload.model_dump(),
        source="user",
        location_precision="exact" if payload.latitude is not None else "city",
    )

    try:
        db.add(sighting)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Failed to save sighting")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not save your sighting right now. Please try again.",
        )

    db.refresh(sighting)  
    return sighting

@router.get("", response_model=list[SightingOut])
def list_sightings(
    db: Session = Depends(get_db),
    date_from: date | None = Query(default=None, alias="from"),
    date_to: date | None = Query(default=None, alias="to"),
    species: str | None = None,
    location: str | None = None,
    limit: int = Query(default=500, ge=1, le=2000),
):
    stmt = select(Sighting)
    if date_from:
        stmt = stmt.where(Sighting.date_seen >= date_from)
    if date_to:
        stmt = stmt.where(Sighting.date_seen <= date_to)
    if species:
        stmt = stmt.where(Sighting.species == species)
    if location:
        stmt = stmt.where(Sighting.location.ilike(f"%{location}%"))
    stmt = stmt.order_by(Sighting.date_seen.desc()).limit(limit)
    return db.scalars(stmt).all()
