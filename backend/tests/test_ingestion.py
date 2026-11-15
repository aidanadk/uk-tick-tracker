from datetime import date

from app.services.ingestion import clean_record

GOOD = {
    "id": "a1",
    "date": "2022-08-01T06:40:31",
    "species": "Marsh tick",
    "latinName": "Ixodes apronophorus",
    "location": " manchester ",
}


def test_good_record_is_cleaned():
    row = clean_record(GOOD)

    assert row["location"] == "Manchester"
    assert row["region"] == "North West"
    assert row["date_seen"] == date(2022, 8, 1)  
    assert row["source"] == "elanco"


def test_record_without_species_is_skipped():
    assert clean_record({**GOOD, "species": None}) is None


def test_record_without_location_is_skipped():
    assert clean_record({**GOOD, "location": ""}) is None


def test_bad_date_is_skipped():
    assert clean_record({**GOOD, "date": "not-a-date"}) is None


def test_unknown_city_is_skipped():
    assert clean_record({**GOOD, "location": "Atlantis"}) is None
