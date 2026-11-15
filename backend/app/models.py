from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Sighting(Base):
    __tablename__ = "sightings"

    id: Mapped[int] = mapped_column(primary_key=True)
    external_id: Mapped[str | None] = mapped_column(String(100), unique=True) 
    latin_name: Mapped[str | None] = mapped_column(String(100)) 
    date_seen: Mapped[date] = mapped_column(Date, index=True)
    species: Mapped[str] = mapped_column(String(100), index=True)
    location: Mapped[str] = mapped_column(String(100), index=True)
    region: Mapped[str | None] = mapped_column(String(100), index=True)
    latitude: Mapped[float | None]
    longitude: Mapped[float | None]
    location_precision: Mapped[str] = mapped_column(String(10), default="city")  
    tick_count: Mapped[int] = mapped_column(Integer, default=1)
    found_on: Mapped[str | None] = mapped_column(String(20))
    source: Mapped[str] = mapped_column(String(20), default="user") 
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    image_url: Mapped[str | None] = mapped_column(String(255))  