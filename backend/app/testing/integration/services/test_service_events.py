import pytest
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import status

from datetime import datetime
from app.core.timezone import LOCAL_TZ

from app.routers.events import EventCreate
from app.models.event import Event
from app.models.practice import Practice
from app.models.tournament import Tournament

from app.services.service_events import *


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
        (
            "FAKE NAME",
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "11:00 AM",
            "02:00 PM",
            None,
            None,  # not used
            None,  # not used
            None,  # not used
            False,
            "scheduled",
            True,
        ),
    ],
)
def test_create_event(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    db_session: Session,
):

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    result = create_event(event, db_session)

    new_event = db_session.scalar(select(Event).where(Event.id == result.id))
    assert new_event is not None

    new_practice = db_session.scalar(
        select(Practice).where(Practice.id == new_event.id)
    )
    new_tournament = db_session.scalar(
        select(Tournament).where(Tournament.id == new_event.id)
    )

    if new_event.category == "practice":
        assert new_practice is not None  # in practice table
        assert new_tournament is None

    elif new_event.category == "tournament":
        assert new_tournament is not None  # in tournament table
        assert new_practice is None

    else:
        assert new_practice is None
        assert new_tournament is None


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open",
    [
        # end time is before start time
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 AM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        # start date is before end date
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-20-2026",
            "11-18-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
        # Made up event status
        (
            "FAKE NAME",
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "11:00 AM",
            "02:00 PM",
            None,
            None,  # not used
            None,  # not used
            None,  # not used
            False,
            "Fake Event Status",
            True,
        ),
        # incorrect format: single day event has end date
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-17-2026",
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        # incorrect format: multi day event has start or end time
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            "12:00 AM",
            "11:59 PM",
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
    ],
)
def test_create_event_bad_input(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    db_session: Session,
):

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    with pytest.raises(HTTPException) as e:
        create_event(event, db_session)

    assert e.value.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
    ],
)
def test_create_event_rollback(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    db_session: Session,
    monkeypatch,
):

    def exception_simulation(*args, **kwargs):
        raise Exception("simulated failure")

    monkeypatch.setattr(
        "app.services.service_events.add_practice", exception_simulation
    )
    monkeypatch.setattr(
        "app.services.service_events.add_tournament", exception_simulation
    )

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    with pytest.raises(HTTPException) as e:
        create_event(event, db_session)

    assert e.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    attempted_event = db_session.scalar(select(Event).where(Event.name == event.name))
    assert (
        attempted_event is None
    )  # not the best check because names aren't unique, but each tests gets clean db


def test_get_events(db_session: Session):
    event1 = EventCreate(
        name="FAKE TOURNAMENT",
        category="tournament",
        location_name="SOME OTHER LOCATION",
        location_address="SOME OTHER ADDRESS",
        details="Bring your JERSEY!",
        start_date="11-17-2026",
        end_date="11-19-2026",
        start_time=None,
        end_time=None,
        event_type="regional",
        additional_requirements=["group_transportation", "lodging"],
        registration_deadline_date="11-14-2026",
        registration_deadline_time="9:00 PM",
        is_multi_day=True,
        event_status="scheduled",
        rsvp_open=True,
    )

    event2 = EventCreate(
        name="FAKE PRACTICE",
        category="practice",
        location_name="SOME LOCATION",
        location_address="SOME ADDRESS",
        details="Bring your cleats!",
        start_date="11-12-2026",
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

    event3 = EventCreate(
        name="FAKE EVENT",
        category="game",
        location_name="SOME OTHER OTHER LOCATION",
        location_address="SOME OTHER OTHER ADDRESS",
        details="Bring your cleats!",
        start_date="11-20-2026",
        end_date=None,
        start_time="12:00 PM",
        end_time="03:00 PM",
        event_type="regular",
        additional_requirements=None,
        registration_deadline_date=None,
        registration_deadline_time=None,
        is_multi_day=False,
        event_status="tentative",
        rsvp_open=True,
    )
    expected_dict = {"start_datetimes": [], "ids": []}
    for event in [event1, event2, event3]:
        result = create_event(event, db_session)

        if event.event_status == "scheduled":
            expected_dict["start_datetimes"].append(result.start_datetime)
            expected_dict["ids"].append(result.id)

    sorted_pairs = sorted(zip(expected_dict["start_datetimes"], expected_dict["ids"]))
    expected_ids = [event_id for datetime, event_id in sorted_pairs]

    results = get_events(db_session)
    result_ids = [result["id"] for result in results]

    assert (
        result_ids == expected_ids
    ), f"Must retrieval only SCHEDULED events in order of start datetime"


@pytest.mark.parametrize("limit", [5, 4, 3, 2])
def test_get_n_upcoming_events(limit, db_session: Session):
    event1 = EventCreate(
        name="FAKE PRACTICE",
        category="practice",
        location_name="SOME LOCATION",
        location_address="SOME ADDRESS",
        details="Bring your cleats!",
        start_date="11-12-2026",
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

    event2 = EventCreate(
        name="FAKE TOURNAMENT",
        category="tournament",
        location_name="SOME OTHER LOCATION",
        location_address="SOME OTHER ADDRESS",
        details="Bring your JERSEY!",
        start_date="11-17-2026",
        end_date="11-19-2026",
        start_time=None,
        end_time=None,
        event_type="regional",
        additional_requirements=["group_transportation", "lodging"],
        registration_deadline_date="11-14-2026",
        registration_deadline_time="9:00 PM",
        is_multi_day=True,
        event_status="scheduled",
        rsvp_open=True,
    )

    event3 = EventCreate(
        name="FAKE EVENT",
        category="game",
        location_name="SOME OTHER OTHER LOCATION",
        location_address="SOME OTHER OTHER ADDRESS",
        details="Bring your cleats!",
        start_date="11-20-2026",
        end_date=None,
        start_time="12:00 PM",
        end_time="03:00 PM",
        event_type="regular",
        additional_requirements=None,
        registration_deadline_date=None,
        registration_deadline_time=None,
        is_multi_day=False,
        event_status="tentative",
        rsvp_open=True,
    )
    event4 = EventCreate(
        name="FAKE PRACTICE 2",
        category="practice",
        location_name="SOME LOCATION 2",
        location_address="SOME ADDRESS 2",
        details="Bring your cleats!",
        start_date="11-14-2026",
        end_date=None,
        start_time="08:30 PM",
        end_time="10:30 PM",
        event_type="regular",
        additional_requirements=None,
        registration_deadline_date=None,
        registration_deadline_time=None,
        is_multi_day=False,
        event_status="scheduled",
        rsvp_open=True,
    )

    event5 = EventCreate(
        name="FAKE TOURNAMENT 2",
        category="tournament",
        location_name="SOME OTHER LOCATION 2",
        location_address="SOME OTHER ADDRESS 2",
        details="Bring your JERSEY!",
        start_date="11-23-2026",
        end_date="11-26-2026",
        start_time=None,
        end_time=None,
        event_type="national",
        additional_requirements=["group_transportation"],
        registration_deadline_date="11-14-2026",
        registration_deadline_time="9:00 PM",
        is_multi_day=True,
        event_status="scheduled",
        rsvp_open=True,
    )

    expected_dict = {"start_datetimes": [], "ids": []}
    for event in [event1, event2, event3, event4, event5]:
        result = create_event(event, db_session)

        if event.event_status == "scheduled":
            expected_dict["start_datetimes"].append(result.start_datetime)
            expected_dict["ids"].append(result.id)

    sorted_pairs = sorted(zip(expected_dict["start_datetimes"], expected_dict["ids"]))
    expected_ids = [event_id for datetime, event_id in sorted_pairs][:limit]

    results = get_n_upcoming_events(limit, db_session)
    result_ids = [result["id"] for result in results]

    print(f"Expected: {expected_ids}\nActual: {result_ids}")

    assert (
        result_ids == expected_ids
    ), f"Must retrieval only SCHEDULED events in order of start datetime"


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open, expected_location_address, expected_details",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
        ),
        # no address
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            None,
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
            "TBD",
            "BRING YO JERSEY!",
        ),
        # no event details
        (
            "FAKE NAME",
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "",
            "11-17-2026",
            None,
            "11:00 AM",
            "02:00 PM",
            None,
            None,  # not used
            None,  # not used
            None,  # not used
            False,
            "scheduled",
            True,
            "FAKE ADDRESS",
            "N/A",
        ),
    ],
)
def test_get_event_details(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    expected_location_address,
    expected_details,
    db_session: Session,
):

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    new_event = create_event(event, db_session)

    result = get_event_details(new_event.id, db_session)

    assert (
        result["location_address"] == expected_location_address
    ), f"Location address should be {expected_location_address}, got {result["location_address"]}"

    assert (
        result["details"] == expected_details
    ), f"Event details should be {expected_details}, got {result["details"]}"


def test_get_event_details_event_not_found(db_session: Session):
    event_id = 1

    with pytest.raises(HTTPException) as e:
        get_event_details(event_id, db_session)

    assert e.value.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open, expected_event_type",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
            "regular",  # expected
        ),
        # no address
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
            "regional",  # expected
        ),
        # no event details
        (
            "FAKE NAME",
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "11:00 AM",
            "02:00 PM",
            None,
            None,  # not used
            None,  # not used
            None,  # not used
            False,
            "scheduled",
            True,
            "",  # expected
        ),
    ],
)
def test_get_event_form_responses(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    expected_event_type,
    db_session: Session,
):

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    new_event = create_event(event, db_session)

    result = get_event_form_responses(new_event.id, db_session)

    assert (
        result["event_type"] == expected_event_type
    ), f"Event type should be {expected_event_type}, got {result["event_type"]}"

    if new_event.category != "tournament":
        assert (
            result["registration_deadline_date"] == ""
        ), f"Registration deadline date should be an empty string, got {result["registration_deadline_date"]}"

        assert (
            result["registration_deadline_time"] == ""
        ), f"Registration deadline time should be an empty string, got {result["registration_deadline_time"]}"

        assert (
            result["additional_requirements"] == []
        ), f"Additional requirements should be an empty list, got {result["additional_requirements"]}"


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open, updated_name, updated_category, updated_location_name, updated_location_address, updated_details, updated_start_date, updated_end_date, updated_start_time, updated_end_time, updated_event_type, updated_additional_requirements, updated_registration_deadline_date, updated_registration_deadline_time, updated_is_multi_day, updated_event_status, updated_rsvp_open",
    [
        # practice -> practice with new practice type
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
            "UPDATED NAME",  # updated values
            "practice",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "05:30 PM",
            "07:30 PM",
            "conditioning",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        # tournament -> tournament with new tournament type
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
            "UPDATED NAME",  # updated values
            "tournament",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "national",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
        # practice -> tournament with new tournament type
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
            "UPDATED NAME",  # updated values
            "tournament",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "national",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
        # practice -> game with no event type
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
            "UPDATED NAME",
            "game",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "02:00 PM",
            "04:00 PM",
            "",
            None,
            None,
            None,
            False,
            "scheduled",
            True,
        ),
        # tournament -> practice with new practice type
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
            "UPDATED NAME",  # updated values
            "practice",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "05:30 PM",
            "07:30 PM",
            "iq",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        # tournament -> other with no event type
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
            "UPDATED NAME",
            "other",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "09:00 PM",
            "",
            None,
            None,
            None,
            False,
            "scheduled",
            True,
        ),
        # game -> tournament with new tournament type
        (
            "FAKE NAME",
            "game",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            None,
            "02:00 PM",
            "04:00 PM",
            None,
            None,
            None,
            None,
            False,
            "scheduled",
            True,
            "UPDATED NAME",  # updated values
            "tournament",
            "UPDATED LOCATION",
            "UPDATED ADDRESS",
            "BRING YO JERSEY!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
    ],
)
def test_update_event(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    updated_name,
    updated_category,
    updated_location_name,
    updated_location_address,
    updated_details,
    updated_start_date,
    updated_end_date,
    updated_start_time,
    updated_end_time,
    updated_event_type,
    updated_additional_requirements,
    updated_registration_deadline_date,
    updated_registration_deadline_time,
    updated_is_multi_day,
    updated_event_status,
    updated_rsvp_open,
    db_session: Session,
):

    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    updated = EventCreate(
        name=updated_name,
        category=updated_category,  # update the category
        location_name=updated_location_name,
        location_address=updated_location_address,
        details=updated_details,
        start_date=updated_start_date,
        end_date=updated_end_date,
        start_time=updated_start_time,
        end_time=updated_end_time,
        event_type=updated_event_type,
        additional_requirements=updated_additional_requirements,
        registration_deadline_date=updated_registration_deadline_date,
        registration_deadline_time=updated_registration_deadline_time,
        is_multi_day=updated_is_multi_day,
        event_status=updated_event_status,
        rsvp_open=updated_rsvp_open,
    )

    new_event = create_event(event, db_session)
    update_event(new_event.id, updated, db_session)
    updated_event = db_session.scalar(select(Event).where(Event.id == new_event.id))

    practice = db_session.scalar(
        select(Practice).where(Practice.id == updated_event.id)
    )
    tournament = db_session.scalar(
        select(Tournament).where(Tournament.id == updated_event.id)
    )

    if updated_event.category == "practice":
        assert practice is not None
        assert tournament is None
        assert (
            practice.practice_type == updated_event_type
        ), f"Practice type should be {practice.practice_type}, got {updated_event_type}"
    elif updated_event.category == "tournament":
        assert tournament is not None
        assert practice is None
        assert (
            tournament.tournament_type == updated_event_type
        ), f"Practice type should be an {tournament.tournament_type}, got {updated_event_type}"
    else:
        assert practice is None
        assert tournament is None


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
    ],
)
def test_cancel_event(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    db_session: Session,
):
    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    new_event = create_event(event, db_session)
    cancel_event(new_event.id, db_session)

    refreshed_event = db_session.scalar(select(Event).where(Event.id == new_event.id))

    assert (
        refreshed_event.event_status == "canceled"
    ), f"Event status should be canceled, got {refreshed_event.event_status}"


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open",
    [
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "regular",
            None,  # not used for practice
            None,  # not used for practice
            None,  # not used for practice
            False,
            "scheduled",
            True,
        ),
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            None,
            None,
            "regional",
            ["group_transportation", "lodging"],
            "12-01-2026",
            "07:00 PM",
            True,
            "scheduled",
            True,
        ),
    ],
)
def test_delete_event(
    name,
    category,
    location_name,
    location_address,
    details,
    start_date,
    end_date,
    start_time,
    end_time,
    event_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    is_multi_day,
    event_status,
    rsvp_open,
    db_session: Session,
):
    event = EventCreate(
        name=name,
        category=category,
        location_name=location_name,
        location_address=location_address,
        details=details,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
        event_type=event_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        is_multi_day=is_multi_day,
        event_status=event_status,
        rsvp_open=rsvp_open,
    )

    new_event = create_event(event, db_session)
    event_id = new_event.id
    delete_event(event_id, db_session)

    practice = db_session.scalar(select(Practice).where(Practice.id == event_id))
    tournament = db_session.scalar(select(Tournament).where(Tournament.id == event_id))

    refreshed_event = db_session.scalar(select(Event).where(Event.id == event_id))

    assert refreshed_event is None, f"Event should not be in DB"

    if category == "practice":
        assert practice is None, f"Practice should not be in DB"
    if category == "tournament":
        assert tournament is None, f"Tournament should not be in DB"
