from fastapi import APIRouter

from app.services.locations import LOCATIONS

router = APIRouter(prefix="/api/locations", tags=["locations"])


@router.get("")
def list_locations():
    return list(LOCATIONS.values())
