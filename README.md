# UK Tick Tracker

**Author:** Aidana Dokturbek Kyzy

**Video walkthrough:** https://youtu.be/Frvs8yLeYcE

I built this project for the Elanco Placement Programme technical task. It lets users explore tick sightings across the UK, learn about different species and report a sighting themselves.

The app imports records from the Elanco API, processes them and stores them in a database. Users can then filter the sightings by date, species and location and view them on a map.

## Features

| Area | What users can do |
|---|---|
| Map | View city markers with sighting counts and filter by date, species and location |
| Sighting details | Select a city, view its sightings and weekly or monthly activity, get directions and share |
| Learn | Read about four tick species, view identification photos and prevention tips, and explore seasonal activity |
| Report a sighting | Submit the date, location, species, number of ticks and where they were found, with an optional photo |

## Tech stack

| Tool | Why I used it |
|---|---|
| FastAPI and Python | Python suited the data processing part. FastAPI provides request validation through Pydantic and interactive API documentation. |
| PostgreSQL and SQLAlchemy | The data has a clear structure and needs filtering by date, species and location. SQLAlchemy connects the Python code to the database. |
| React, TypeScript and Vite | React lets me split the interface into reusable components. TypeScript helps check the data types used throughout the frontend. |
| Leaflet and OpenStreetMap | They let me build the map without requiring an API key. |
| Tailwind CSS | It helped me keep the styles consistent across the pages. |
| Docker Compose | It makes setting up the PostgreSQL database easier. |

## How to run

You need Docker, Python 3.12+ and Node.js 20+.

### 1. Start the database

From the project root:

```bash
docker compose up -d
```

PostgreSQL runs on port **5433**, so it does not conflict with a local PostgreSQL instance using port 5432.

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
cp .env.example .env
python3 -m uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Interactive documentation: http://localhost:8000/docs

The backend imports the Elanco records on startup. If the external API is unavailable, the app still starts and can use previously saved records. A new database will remain without imported records until an import succeeds.

### 3. Start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

Vite forwards requests starting with `/api` to the backend.

### 4. Run the tests

From `backend`, with the virtual environment active:

```bash
python3 -m pytest -v
```

## Project structure

I kept the frontend and backend in one repository because they are parts of the same application.

The frontend calls my backend rather than calling Elanco directly. The backend imports and processes the external data, then serves it alongside reports submitted by users.

| File or folder | Responsibility |
|---|---|
| `backend/app/main.py` | App setup, startup import and validation error handling |
| `backend/app/models.py` | Database model |
| `backend/app/schemas.py` | Request and response validation |
| `backend/app/routers/` | Sightings, statistics and location endpoints |
| `backend/app/services/` | External API requests, ingestion, filtering and location lookup |
| `backend/app/data/uk_locations.json` | City coordinates and regions |
| `backend/tests/` | Data cleaning tests |
| `frontend/src/pages/` | Map, Learn and Report pages |
| `frontend/src/assets/components/` | Map, sidebar, details panel, forms and charts |
| `frontend/src/api/` | Functions that call the backend |
| `frontend/src/hooks/` | Loading sightings |
| `frontend/src/utils/` | Form validation and trend calculations |

## Handling the Elanco data

The data comes from:

```text
GET https://dev-task.elancoapps.com/data/tick-sightings
```

Each record contains an ID, date, city, species and Latin name.

I wanted to avoid saving incomplete records or creating duplicates every time the import runs.

| Issue | How I handled it |
|---|---|
| Missing or invalid fields | Records without an ID, valid date, species or location are skipped. |
| Duplicates | Elanco’s ID is stored as a unique `external_id`. The import checks existing IDs and repeated IDs within the response. |
| Inconsistent city names | Case and surrounding spaces are normalised before looking up the city. |
| Missing coordinates | The city is matched against `uk_locations.json` to get its centre and region. Unknown cities are skipped and counted in the import report. |
| Larger datasets | Imported records are stored in the database, and the API filters them there. The map currently loads up to 2,000 records and filters them in the browser for instant updates. Full pagination is still a next step. |
| Re-importing | `/api/admin/ingest` returns the number of records fetched, added, duplicated and skipped. |

### Location accuracy

The Elanco API only provides city names, so the map shows one marker per city with a sighting count. Its position represents the city centre, not the place where each tick was found.

I chose this instead of spreading points around the city, which would suggest that the data contains more precise locations than it actually does.

For user reports, the database stores the selected pin coordinates. The API rounds them to two decimal places to reduce the precision shown publicly. This is approximate and does not guarantee anonymity or a fixed one-kilometre distance.

The current `location_precision` values are:

- `city`: coordinates from the city lookup.
- `exact`: coordinates selected by a user. This describes their source, rather than independently verified accuracy.

The static lookup gives consistent results without making a geocoding request every time the map loads. The trade-off is that new places need to be added to the file.

## API endpoints

Interactive documentation is available at http://localhost:8000/docs.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/sightings` | List sightings, newest first. Supports `from`, `to`, `species`, `location`, `region` and `limit`. |
| POST | `/api/sightings` | Save a new sighting report |
| POST | `/api/sightings/{id}/image` | Attach a JPEG, PNG or WebP image, up to 5 MB |
| GET | `/api/stats/by-region` | Count sightings by region, with optional date filters |
| GET | `/api/stats/trends` | Weekly or monthly counts, with date, location and region filters |
| GET | `/api/stats/seasonal` | Counts grouped by month of the year, with location and region filters |
| GET | `/api/locations` | Return known cities, regions and coordinates |
| POST | `/api/admin/ingest` | Import the Elanco records again |
| GET | `/api/health` | Check that the API is running |

## Error handling

Validation happens in both the frontend and backend. The frontend gives feedback while users complete the form. The backend checks the request again because the API can also be called without using the form.

| Situation | Behaviour |
|---|---|
| External API fails | Previously saved data remains available. A manual import returns `502`. |
| Invalid report | Returns `422` with messages for the relevant fields |
| Unknown location without a map pin | Returns `422` asking the user to select a location |
| Start date is after the end date | Returns `400` with an explanation |
| Invalid photo upload | Returns `422` for the upload. The sighting remains saved, and the user is told that the photo was not attached. |
| Database error while saving | Rolls back the transaction and returns `503` with a message asking the user to try again |

## Design and accessibility

**Wireframes:** see [`docs/wireframes/`](docs/wireframes/)

I used a side panel for sighting details so users can keep the map in view and switch between cities.

The report form allows users to select a point on the map, which is useful when they do not know the postcode. Validation messages appear next to each field and in a summary at the top, with links back to the fields.

Accessibility features include:

- Visible labels for inputs.
- Hints and errors linked with `aria-describedby`.
- `aria-invalid` on invalid fields.
- `fieldset` and `legend` for grouped radio buttons.
- `role="status"` and `role="alert"` for loading and error messages.
- Semantic HTML and visible keyboard focus.
- Alternative text for species photos.

## Testing

The tests in `backend/tests/test_ingestion.py` check that valid records are normalised and that records with missing fields, invalid dates or unknown cities are skipped.

These tests cover the data cleaning logic. API tests with a separate test database and frontend validation tests are still next steps.

## Limitations and next steps

- Add API and frontend tests, particularly for report submission and failure cases.
- Use Alembic for database changes instead of creating missing tables on startup.
- Add retries with backoff and batch processing to the Elanco import.
- Move statistics calculations from Python to SQL aggregation for larger datasets.
- Add pagination and marker clustering so users can explore records beyond the list limit.
- Expand the location lookup to support more places.
- Store verification separately from the species name for “Not sure” reports.
- Add authentication to the admin import endpoint.
- Check uploaded file contents as well as their declared type.
- Improve the mobile layout, display report photos in the details panel and add links that open a specific city.

## Credits

- Tick photos are from Wikimedia Commons. Individual authors and licences are listed in [the photo credits](frontend/public/images/ticks/CREDITS.md).