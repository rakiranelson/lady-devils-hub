from fastapi import status
from app.routers.events import *


def create_sample_event(db):
    event = EventCreate(
        name="FAKE NAME",
        category="practice",
        location_name="FAKE LOCATION",
        location_address="FAKE ADDRESS",
        details="BRING YO CLEATS!",
        start_date="11-17-2030",
        end_date=None,
        start_time="06:30 PM",
        end_time="08:30 PM",
        event_type="regular",
        additional_requirements=None,
        registration_deadline_date=None,
        registration_deadline_time=None,
        is_multi_day=False,
        event_status="scheduled",
        rsvp_open=True,
    )

    result = create_event(event, db)
    return result


def test_create_event_endpoint(client):
    payload = {
        "name": "FAKE NAME",
        "category": "practice",
        "location_name": "FAKE LOCATION",
        "location_address": "FAKE ADDRESS",
        "details": "BRING YO CLEATS!",
        "start_date": "11-17-2026",
        "end_date": None,
        "start_time": "06:30 PM",
        "end_time": "08:30 PM",
        "event_type": "regular",
        "additional_requirements": None,
        "registration_deadline_date": None,
        "registration_deadline_time": None,
        "is_multi_day": False,
        "event_status": "scheduled",
        "rsvp_open": True,
    }

    response = client.post("/events/", json=payload)

    assert (
        response.status_code == status.HTTP_201_CREATED
    ), f"Unsuccessful request: {response.status_code}"
    assert isinstance(response.json()["id"], int)


def test_get_events_endpoint(client, db_session):
    new_event = create_sample_event(db_session)
    response = client.get("/events/")

    assert (
        response.status_code == status.HTTP_200_OK
    ), f"Unsuccessful request: {response.status_code}"

    ids = [item["id"] for item in response.json()]
    assert new_event.id in ids, f"Event ID should be in the response IDs"


def test_get_overview_events(client, db_session):
    new_event = create_sample_event(db_session)
    response = client.get("/events/overview", params={"limit": 5})

    assert (
        response.status_code == status.HTTP_200_OK
    ), f"Unsuccessful request: {response.status_code}"

    assert isinstance(response.json(), list)

    ids = [item["id"] for item in response.json()]
    assert new_event.id in ids, f"Event ID should be in the response IDs"


def test_get_event_details_endpoint(client, db_session):
    new_event = create_sample_event(db_session)
    response = client.get(f"/events/{new_event.id}")

    assert (
        response.status_code == status.HTTP_200_OK
    ), f"Unsuccessful request: {response.status_code}"

    assert response.json()["id"] == new_event.id


def test_get_event_details_endpoint_event_not_found(client):
    event_id = -1
    response = client.get(f"/events/{event_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_event_endpoint(client, db_session):
    original_event = create_sample_event(db_session)

    payload = {
        "name": "UPDATED NAME",
        "category": "tournament",
        "location_name": "FAKE LOCATION",
        "location_address": "FAKE ADDRESS",
        "details": "BRING YO CLEATS!",
        "start_date": "11-17-2026",
        "end_date": "11-19-2026",
        "start_time": None,
        "end_time": None,
        "event_type": "regional",
        "additional_requirements": ["group_transportation"],
        "registration_deadline_date": "11-15-2026",
        "registration_deadline_time": "05:00 PM",
        "is_multi_day": True,
        "event_status": "scheduled",
        "rsvp_open": True,
    }

    response = client.patch(f"/events/{original_event.id}", json=payload)
    updated_event = db_session.scalar(
        select(Event).where(Event.id == original_event.id)
    )

    assert (
        response.status_code == status.HTTP_204_NO_CONTENT
    ), f"Unsuccessful request: {response.status_code}"

    assert (
        updated_event.category == "tournament"
    ), f"Updated event should be in the tournament category"


def test_cancel_event_endpoint(client, db_session):
    original_event = create_sample_event(db_session)

    response = client.patch(f"/events/{original_event.id}/cancel")
    updated_event = db_session.scalar(
        select(Event).where(Event.id == original_event.id)
    )

    assert (
        response.status_code == status.HTTP_204_NO_CONTENT
    ), f"Unsuccessful request: {response.status_code}"

    assert (
        updated_event.event_status == "canceled"
    ), f"Status of the updated event should be 'canceled'"


def test_delete_event_endpoint(client, db_session):
    original_event = create_sample_event(db_session)

    response = client.delete(f"/events/{original_event.id}")
    prev_event = db_session.scalar(select(Event).where(Event.id == original_event.id))

    assert (
        response.status_code == status.HTTP_204_NO_CONTENT
    ), f"Unsuccessful request: {response.status_code}"

    assert prev_event is None, f"Event should be removed from DB"
