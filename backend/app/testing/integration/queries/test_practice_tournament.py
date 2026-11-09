import pytest

from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from app.core.timezone import LOCAL_TZ

from app.models.practice import *
from app.models.tournament import *

"""
Unit tests for practice methods
"""


def test_add_practice(db_session: Session):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=1, name="FAKE NAME", semester_id=2, category="practice")
    db_session.add(event)
    db_session.commit()

    add_practice(event_id=1, practice_type="regular", db=db_session)

    practice = db_session.scalar(select(Practice))
    assert practice is not None, "Must successfully write practice to db"


@pytest.mark.parametrize(
    "event_id, practice_type, expected",
    [
        (1, "regular", "Regular"),
        (2, "iq", "IQ"),
        (3, "conditioning", "Conditioning"),
        (4, "other", "Other"),
    ],
)
def test_get_practice_type(event_id, practice_type, expected, db_session: Session):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="practice")
    db_session.add(event)
    db_session.commit()

    add_practice(event_id=event_id, practice_type=practice_type, db=db_session)

    result = get_practice_type(event_id=event_id, db=db_session)
    assert result == expected, f"practice type should be {expected}"


def test_delete_practice(db_session: Session):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=1, name="FAKE NAME", semester_id=2, category="practice")
    db_session.add(event)
    db_session.commit()

    add_practice(event_id=1, practice_type="regular", db=db_session)
    delete_practice(event_id=1, db=db_session)

    result = db_session.scalar(
        select(Practice).where(Practice.id == 1)
    )  # see if None is returned

    assert result is None, "Practice must be removed from the db"


@pytest.mark.parametrize(
    "practice_type, expected",
    [
        ("iq", "IQ"),
        ("conditioning", "Conditioning"),
        ("other", "Other"),
    ],
)
def test_update_practice(practice_type, expected, db_session):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=1, name="FAKE NAME", semester_id=2, category="practice")
    db_session.add(event)
    db_session.commit()

    add_practice(event_id=1, practice_type="regular", db=db_session)
    update_practice(event_id=1, practice_type=practice_type, db=db_session)

    result = get_practice_type(event_id=1, db=db_session)
    assert result == expected, f"practice type should be {expected}"


"""
Unit tests for tournament methods
"""


@pytest.mark.parametrize(
    "event_id, tournament_type, additional_requirements, registration_deadline_date, registration_deadline_time",
    [
        (
            1,
            "regional",
            ["group_transportation", "lodging"],
            "11-30-2026",
            "04:00 PM",
        ),  # traditional format
        (
            2,
            "regional",
            ["group_transportation"],
            "1-28-2027",
            "08:00 AM",
        ),  # date without leading 0
        (3, "regional", ["lodging"], "11-25-2026", "8:00 PM"),  # time without leading 0
        (
            4,
            "regional",
            [],
            "1-30-2027",
            "8:00 AM",
        ),  # date without leading 0 + time without leading 0
    ],
)
def test_add_tournament(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    db_session: Session,
):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="tournament")
    db_session.add(event)
    db_session.commit()

    add_tournament(
        event_id=event_id,
        tournament_type=tournament_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        db=db_session,
    )

    tournament = db_session.scalar(select(Tournament))
    assert tournament is not None, "Must successfully write tournament to db"


@pytest.mark.parametrize(
    "event_id, tournament_type, additional_requirements, registration_deadline_date, registration_deadline_time, expected",
    [
        (
            1,
            "regional",
            ["group_transportation", "lodging"],
            "11-30-2026",
            "04:00 PM",
            "Regional",
        ),
    ],
)
def test_get_tournament_type(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    expected,
    db_session: Session,
):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="tournament")
    db_session.add(event)
    db_session.commit()

    add_tournament(
        event_id=event_id,
        tournament_type=tournament_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        db=db_session,
    )

    result = get_tournament_type(event_id=event_id, db=db_session)
    assert result == expected, f"Tournament type should be {expected}"


@pytest.mark.parametrize(
    "event_id, tournament_type, additional_requirements, registration_deadline_date, registration_deadline_time, expected_tournament_type, expected_registration_deadline, expected_group_transportation_required, expected_lodging_required",
    [
        (
            1,
            "regional",
            ["group_transportation", "lodging"],
            "11-30-2026",
            "07:00 PM",
            "Regional",
            datetime(2026, 11, 30, 19, 0, 0, tzinfo=LOCAL_TZ),
            True,
            True,
        ),
    ],
)
def test_get_tournament(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    expected_tournament_type,
    expected_registration_deadline,
    expected_group_transportation_required,
    expected_lodging_required,
    db_session: Session,
):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="tournament")
    db_session.add(event)
    db_session.commit()

    add_tournament(
        event_id=event_id,
        tournament_type=tournament_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        db=db_session,
    )

    tournament = get_tournament(
        event_id=event_id, user_id=1, db=db_session
    )  # NOT testing to get is_registered yet
    assert (
        tournament["tournament_type"] == expected_tournament_type
    ), f"Tournament type is not {expected_tournament_type}"
    assert (
        tournament["registration_deadline"].astimezone(LOCAL_TZ)
        == expected_registration_deadline
    ), f"Registration deadlines do not match. Got {tournament["registration_deadline"].astimezone(LOCAL_TZ)} expect {expected_registration_deadline}"
    assert (
        tournament["group_transportation"] is expected_group_transportation_required
    ), f"Group transportation required is not {expected_group_transportation_required}"
    assert (
        tournament["lodging"] is expected_lodging_required
    ), f"Lodging required is not {expected_lodging_required}"

    # needs to be updated later
    assert tournament["is_registered"] is False, f"Is registered is not  False"


@pytest.mark.parametrize(
    "event_id, tournament_type, additional_requirements, registration_deadline_date, registration_deadline_time",
    [
        (
            1,
            "regional",
            ["group_transportation", "lodging"],
            "11-30-2026",
            "04:00 PM",
        )
    ],
)
def test_delete_tournament(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    db_session: Session,
):
    # add an event directly due to satisfy foreign key constraints
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="tournament")
    db_session.add(event)
    db_session.commit()

    add_tournament(
        event_id=event_id,
        tournament_type=tournament_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        db=db_session,
    )

    delete_tournament(event_id=event_id, db=db_session)

    result = db_session.scalar(
        select(Tournament).where(Tournament.id == event_id)
    )  # see if None is returned

    assert result is None, "tournament must be removed from the db"


@pytest.mark.parametrize(
    "event_id, tournament_type, additional_requirements, registration_deadline_date, registration_deadline_time, new_tournament_type, new_additional_requirements, new_registration_deadline_date, new_registration_deadline_time, expected_tournament_type, expected_registration_deadline, expected_group_transportation_required, expected_lodging_required",
    [
        (
            1,
            "regional",
            ["group_transportation", "lodging"],
            "11-30-2026",
            "04:00 PM",
            "other",  # updated values
            ["group_transportation"],
            "11-28-2026",
            "07:00 PM",
            "Other",  # expected values
            datetime(2026, 11, 28, 19, 0, 0, tzinfo=LOCAL_TZ),
            True,
            False,
        )
    ],
)
def test_update_tournament(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    new_tournament_type,
    new_additional_requirements,
    new_registration_deadline_date,
    new_registration_deadline_time,
    expected_tournament_type,
    expected_registration_deadline,
    expected_group_transportation_required,
    expected_lodging_required,
    db_session: Session,
):
    event = Event(id=event_id, name="FAKE NAME", semester_id=2, category="tournament")
    db_session.add(event)
    db_session.commit()

    add_tournament(
        event_id=event_id,
        tournament_type=tournament_type,
        additional_requirements=additional_requirements,
        registration_deadline_date=registration_deadline_date,
        registration_deadline_time=registration_deadline_time,
        db=db_session,
    )

    update_tournament(
        event_id=event_id,
        tournament_type=new_tournament_type,
        additional_requirements=new_additional_requirements,
        registration_deadline_date=new_registration_deadline_date,
        registration_deadline_time=new_registration_deadline_time,
        db=db_session,
    )

    tournament = get_tournament(
        event_id=event_id, user_id=1, db=db_session
    )  # NOT testing to get is_registered yet
    assert (
        tournament["tournament_type"] == expected_tournament_type
    ), f"Tournament type is not {expected_tournament_type}"
    assert (
        tournament["registration_deadline"].astimezone(LOCAL_TZ)
        == expected_registration_deadline
    ), f"Registration deadlines do not match. Got {tournament["registration_deadline"].astimezone(LOCAL_TZ)} expect {expected_registration_deadline}"
    assert (
        tournament["group_transportation"] is expected_group_transportation_required
    ), f"Group transportation required is not {expected_group_transportation_required}"
    assert (
        tournament["lodging"] is expected_lodging_required
    ), f"Lodging required is not {expected_lodging_required}"

    # needs to be updated later
    assert tournament["is_registered"] is False, f"is_registered should not be False"
