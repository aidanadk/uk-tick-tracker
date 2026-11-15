import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine, get_db
from app.routers import locations, sightings, stats
from app.routers.sightings import UPLOAD_DIR
from app.services.elanco_client import ElancoAPIError
from app.services.ingestion import ingest_if_empty, run_ingestion

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as db:
            ingest_if_empty(db)
    except ElancoAPIError as e:
        logger.error("Could not load Elanco data on startup: %s", e)
    yield


app = FastAPI(title="UK Tick Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for err in exc.errors():
        field = str(err["loc"][-1]) if len(err["loc"]) > 1 else "form"
        errors[field] = err["msg"].removeprefix("Value error, ")
    return JSONResponse(status_code=422, content={"detail": "Validation failed", "errors": errors})


app.include_router(sightings.router)
app.include_router(stats.router)
app.include_router(locations.router)

UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.post("/api/admin/ingest")
def trigger_ingest(db: Session = Depends(get_db)):
    try:
        return run_ingestion(db)
    except ElancoAPIError:
        raise HTTPException(status_code=502, detail="The Elanco API is not available right now")


@app.get("/api/health")
def health():
    return {"status": "ok"}
