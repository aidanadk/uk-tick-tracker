import logging
import uuid
from datetime import date
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Sighting
from app.schemas import SightingCreate, SightingOut
from app.services.filters import apply_filters
from app.services.locations import find_location

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sightings", tags=["sightings"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_SIZE = 5 * 1024 * 1024


def field_error(field: str, message: str):
    return JSONResponse(status_code=422, content={"detail": "Validation failed", "errors": {field: message}})


@router.post("", response_model=SightingOut, status_code=201)
def create_sighting(payload: SightingCreate, db: Session = Depends(get_db)):
    loc = find_location(payload.location)
    if loc is None and payload.latitude is None:
        return field_error("location", "Unknown location. Select the place on the map")

    sighting = Sighting(**payload.model_dump(), source="user")

    if loc:
        sighting.location = loc["name"]
        sighting.region = loc["region"]

    if payload.latitude is None:
        sighting.latitude = loc["lat"]
        sighting.longitude = loc["lng"]
        sighting.location_precision = "city"
    else:
        sighting.location_precision = "exact"

    try:
        db.add(sighting)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Failed to save sighting")
        raise HTTPException(status_code=503, detail="Could not save your sighting right now. Please try again.")

    db.refresh(sighting)
    return sighting


@router.get("", response_model=list[SightingOut])
def list_sightings(
    date_from: date | None = Query(default=None, alias="from"),
    date_to: date | None = Query(default=None, alias="to"),
    species: str | None = None,
    location: str | None = None,
    region: str | None = None,
    limit: int = Query(default=500, ge=1, le=2000),
    db: Session = Depends(get_db),
):
    stmt = apply_filters(select(Sighting), date_from, date_to, species, location, region)
    stmt = stmt.order_by(Sighting.date_seen.desc()).limit(limit)
    return db.scalars(stmt).all()


@router.post("/{sighting_id}/image", response_model=SightingOut)
def upload_image(sighting_id: int, file: UploadFile, db: Session = Depends(get_db)):
    sighting = db.get(Sighting, sighting_id)
    if sighting is None:
        raise HTTPException(status_code=404, detail="Sighting not found")

    if file.content_type not in ALLOWED_TYPES:
        return field_error("file", "Only JPEG, PNG or WebP images are allowed")

    data = file.file.read()
    if len(data) > MAX_SIZE:
        return field_error("file", "Image must be 5 MB or smaller")

    filename = uuid.uuid4().hex + ALLOWED_TYPES[file.content_type]
    (UPLOAD_DIR / filename).write_bytes(data)

    sighting.image_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(sighting)
    return sighting
