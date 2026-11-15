from datetime import date, datetime, timedelta
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator, model_validator

class SightingCreate(BaseModel):
    date_seen: date
    species: str = Field(min_length=1, max_length=100)
    location: str = Field(min_length=1, max_length=100)
    latitude: float | None = Field(default=None, ge=49.8, le=60.9)    
    longitude: float | None = Field(default=None, ge=-8.7, le=1.8)
    tick_count: int = Field(default=1, ge=1, le=100)
    found_on: Literal["dog", "cat", "person", "other"]

    @field_validator("species", "location")
    @classmethod
    def strip_text(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("This field is required")
        return v

    @field_validator("date_seen")
    @classmethod
    def check_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Date cannot be in the future")
        if v < date.today() - timedelta(days=730):
            raise ValueError("Date must be within the last 2 years")
        return v

    @model_validator(mode="after")
    def check_coordinates(self):
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError("Provide both latitude and longitude, or neither")
        return self

class SightingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  

    id: int
    date_seen: date
    latin_name: str | None
    species: str
    location: str
    latitude: float | None
    longitude: float | None
    location_precision: str
    tick_count: int
    found_on: str | None
    source: str
    created_at: datetime
    region: str | None
    image_url: str | None

    @field_serializer("latitude", "longitude")
    def round_coords(self, v: float | None):
        return round(v, 2) if v is not None else None