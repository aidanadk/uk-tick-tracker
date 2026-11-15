from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.routers import sightings

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
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
    """Turn Pydantic's verbose errors into {field: message} for the form."""
    errors = {}
    for err in exc.errors():
        field = str(err["loc"][-1]) if len(err["loc"]) > 1 else "form"
        errors[field] = err["msg"].removeprefix("Value error, ")
    return JSONResponse(status_code=422, content={"detail": "Validation failed", "errors": errors})


app.include_router(sightings.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}