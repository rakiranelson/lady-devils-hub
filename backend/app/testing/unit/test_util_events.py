import pytest
from unittest.mock import MagicMock

from datetime import datetime
from app.core.timezone import LOCAL_TZ

from app.models.event import Event
from app.routers.events import EventCreate
from app.utils.util_events import *


@pytest.mark.parametrize(
    "event_id, category, expected",
    [
        (1, "practice", "Regular"),
        (2, "tournament", "Regional"),
        (3, "game", ""),
        (4, "other", ""),
    ],
)
def test_get_event_type(event_id, category, expected, mocker):
    mock_get_practice_type: MagicMock = mocker.patch(
        "app.utils.util_events.get_practice_type", return_value="Regular", autospec=True
    )

    mock_get_tournament_type: MagicMock = mocker.patch(
        "app.utils.util_events.get_tournament_type",
        return_value="Regional",
        autospec=True,
    )

    result = get_event_type(event_id=event_id, category=category, db=None)

    assert result == expected, f"Event type should be {expected}, got {result}"

    if category == "practice":
        mock_get_practice_type.assert_called_once_with(event_id=event_id, db=None)
    elif category == "tournament":
        mock_get_tournament_type.assert_called_once_with(event_id=event_id, db=None)
    else:
        mock_get_practice_type.assert_not_called()
        mock_get_tournament_type.assert_not_called()


@pytest.mark.parametrize(
    "id, name, semester_id, category, location_name, location_address, event_details, start_datetime, end_datetime, created_time, event_status, is_multi_day, start_time_provided, rsvp_open, created_by, expected_id, expected_event_name, expected_category, expected_location_name, expected_date_label, expected_end_date, expected_time, expected_is_tentative",
    [
        # test regular (single day) event
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "Tuesday, Nov 17",
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            "6:30 - 8:30pm",
            False,
        ),
        # test missing location name/address
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            None,
            None,
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "practice",
            "TBD",
            "Tuesday, Nov 17",
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            "6:30 - 8:30pm",
            False,
        ),
        # test with no end datetime.
        #    - should still get a date label if start datetime exists
        #    - should not get an end date
        #    - time should also be "TBD" because there is not end datetime to determine is single day or multi-day event
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            None,
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "Tuesday, Nov 17",
            None,
            "TBD",
            False,
        ),
        # test with no start time
        #    - date label and time should both be TBD
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            None,
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            False,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "TBD",
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            "TBD",
            False,
        ),
        # test when time periods differ (has both AM and PM)
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring you a good attitude!",
            datetime(2026, 11, 17, 11, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 16, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "other",
            "FAKE LOCATION",
            "Tuesday, Nov 17",
            datetime(2026, 11, 17, 16, 30, 0, tzinfo=LOCAL_TZ),
            "11:30am - 4:30pm",
            False,
        ),
        # test multiple day events
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 19, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            True,
            True,
            False,
            1,
            1,  # expected values
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "Tue, Nov 17 - Thu, Nov 19",
            datetime(2026, 11, 19, 20, 30, 0, tzinfo=LOCAL_TZ),
            "3 days",
            False,
        ),
    ],
)
def test_format_event_data(
    id,
    name,
    semester_id,
    category,
    location_name,
    location_address,
    event_details,
    start_datetime,
    end_datetime,
    created_time,
    event_status,
    is_multi_day,
    start_time_provided,
    rsvp_open,
    created_by,
    expected_id,
    expected_event_name,
    expected_category,
    expected_location_name,
    expected_date_label,
    expected_end_date,
    expected_time,
    expected_is_tentative,
):
    event = Event(
        id=id,
        name=name,
        semester_id=semester_id,
        category=category,
        location_name=location_name,
        location_address=location_address,
        event_details=event_details,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        created_time=created_time,
        event_status=event_status,
        is_multi_day=is_multi_day,
        start_time_provided=start_time_provided,
        rsvp_open=rsvp_open,
        created_by=created_by,
    )

    result = format_event_data(event)

    assert (
        result["id"] == expected_id
    ), f"ID should be {expected_id}, got {result["id"]}"
    assert (
        result["event_name"] == expected_event_name
    ), f"Event name id should be {expected_event_name}, got {result["event_name"]}"
    assert (
        result["category"] == expected_category
    ), f"Category should be {expected_category}, got {result["category"]}"
    assert (
        result["location_name"] == expected_location_name
    ), f"Location name should be {expected_location_name}, got {result["location_name"]}"
    assert (
        result["date_label"] == expected_date_label
    ), f"Date label should be {expected_date_label}, got {result["date_label"]}"
    assert (
        result["end_date"] == expected_end_date
    ), f"End date should be {expected_end_date}, got {result["end_date"]}"
    assert (
        result["time"] == expected_time
    ), f"Time should be {expected_time}, got {result["time"]}"
    assert (
        result["is_tentative"] == expected_is_tentative
    ), f"Is tentative should be {expected_is_tentative}, got {result["is_tentative"]}"


@pytest.mark.parametrize(
    "id, name, semester_id, category, location_name, location_address, event_details, start_datetime, end_datetime, created_time, event_status, is_multi_day, start_time_provided, rsvp_open, created_by, expected_deadline_label",
    [
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            None,  # expected value
        ),
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "other",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring you a good attitude!",
            datetime(2026, 11, 17, 11, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 16, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            None,  # expected value
        ),
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 19, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            True,
            True,
            False,
            1,
            "11/26 @ 6:00pm",  # expected values
        ),
    ],
)
def test_get_event_response_dict(
    id,
    name,
    semester_id,
    category,
    location_name,
    location_address,
    event_details,
    start_datetime,
    end_datetime,
    created_time,
    event_status,
    is_multi_day,
    start_time_provided,
    rsvp_open,
    created_by,
    expected_deadline_label,
    mocker,
):
    mock_get_practice_type: MagicMock = mocker.patch(
        "app.utils.util_events.get_practice_type", return_value="Regular", autospec=True
    )

    mock_get_tournament: MagicMock = mocker.patch(
        "app.utils.util_events.get_tournament",
        return_value={
            "tournament_type": "Regional",
            "is_registered": False,
            "registration_deadline": datetime(2026, 11, 26, 18, 0, 0, tzinfo=LOCAL_TZ),
            "group_transportation": True,
            "lodging": False,
        },
        autospec=True,
    )

    event = Event(
        id=id,
        name=name,
        semester_id=semester_id,
        category=category,
        location_name=location_name,
        location_address=location_address,
        event_details=event_details,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        created_time=created_time,
        event_status=event_status,
        is_multi_day=is_multi_day,
        start_time_provided=start_time_provided,
        rsvp_open=rsvp_open,
        created_by=created_by,
    )

    result = get_event_response_dict(event=event, current_user=1, db=None)

    if event.category == "practice":
        # not checking for correct practice type because this was already tested

        mock_get_practice_type.assert_called_once_with(event_id=event.id, db=None)
        mock_get_tournament.assert_not_called()

    elif event.category == "tournament":
        # not checking for tournament_type, is_registered, registration_deadline, group_transportation, and lodging) was already tested

        assert (
            result["deadline_label"] == expected_deadline_label
        ), f"Deadline label should be {expected_deadline_label}, got {result["deadline_label"]}"

        mock_get_tournament.assert_called_once_with(
            event_id=event.id, user_id=1, db=None
        )
        mock_get_practice_type.assert_not_called()

    else:
        mock_get_practice_type.assert_not_called()
        mock_get_tournament.assert_not_called()


@pytest.mark.parametrize(
    "id, name, semester_id, category, location_name, location_address, event_details, start_datetime, end_datetime, created_time, event_status, is_multi_day, start_time_provided, rsvp_open, created_by, expected_start_date, expected_end_date, expected_start_time, expected_end_time, expected_is_multi_day",
    [
        # single day event: no end date and is not multi-day
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            True,
            False,
            1,
            "11-17-2026",  # expected values
            "",
            "06:30 PM",
            "08:30 PM",
            False,
        ),
        # if no start datetime at all
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            None,
            None,
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            False,
            False,
            False,
            1,
            "",  # expected values
            "",
            "",
            "",
            False,
        ),
        # if multi-day
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 19, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            True,
            False,
            False,
            1,
            "11-17-2026",  # expected values
            "11-19-2026",
            "",
            "",
            True,
        ),
        # multi day with end datetime and no start datetime
        (
            1,  # testing data
            "FAKE NAME",
            2,
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "Bring your cleats!",
            None,
            datetime(2026, 11, 19, 20, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 1, 10, 12, 0, tzinfo=LOCAL_TZ),
            "scheduled",
            True,
            False,
            False,
            1,
            "",  # expected values
            "11-19-2026",
            "",
            "",
            True,
        ),
    ],
)
def test_format_event_form_datetime(
    id,
    name,
    semester_id,
    category,
    location_name,
    location_address,
    event_details,
    start_datetime,
    end_datetime,
    created_time,
    event_status,
    is_multi_day,
    start_time_provided,
    rsvp_open,
    created_by,
    expected_start_date,
    expected_end_date,
    expected_start_time,
    expected_end_time,
    expected_is_multi_day,
):
    event = Event(
        id=id,
        name=name,
        semester_id=semester_id,
        category=category,
        location_name=location_name,
        location_address=location_address,
        event_details=event_details,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        created_time=created_time,
        event_status=event_status,
        is_multi_day=is_multi_day,
        start_time_provided=start_time_provided,
        rsvp_open=rsvp_open,
        created_by=created_by,
    )

    start_date, end_date, start_time, end_time, is_multi_day = (
        format_event_form_datetime(event)
    )

    assert (
        start_date == expected_start_date
    ), f"Start date should be {expected_start_date}, got {start_date}"

    assert (
        end_date == expected_end_date
    ), f"End date should be {expected_end_date}, got {end_date}"

    assert (
        start_time == expected_start_time
    ), f"Start time should be {expected_start_time}, got {start_time}"

    assert (
        end_time == expected_end_time
    ), f"End time should be {expected_end_time}, got {end_time}"

    assert (
        is_multi_day == expected_is_multi_day
    ), f"Is multi day should be {expected_is_multi_day}, got {is_multi_day}"


@pytest.mark.parametrize(
    "name, category, location_name, location_address, details, start_date, end_date, start_time, end_time, event_type, additional_requirements, registration_deadline_date, registration_deadline_time, is_multi_day, event_status, rsvp_open, expected_start_datetime, expected_end_datetime, expected_rsvp_open, expected_event_status",
    [
        # single day event
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
            "",  # not being used in this test
            [],  # not being used in this test
            "",  # not being used in this test
            "",  # not being used in this test
            False,  # not being used in this test
            "scheduled",
            True,
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            True,
            "scheduled",
        ),
        # single day event: missing location name address
        (
            "FAKE NAME",
            "practice",
            None,
            None,
            "BRING YO CLEATS!",
            "11-17-2026",
            None,
            "06:30 PM",
            "08:30 PM",
            "",  # not being used in this test
            [],  # not being used in this test
            "",  # not being used in this test
            "",  # not being used in this test
            False,  # not being used in this test
            "scheduled",
            False,
            datetime(2026, 11, 17, 18, 30, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 17, 20, 30, 0, tzinfo=LOCAL_TZ),
            False,
            "tentative",
        ),
        # single day event: missing start date
        (
            "FAKE NAME",
            "practice",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            None,
            None,
            "06:30 PM",
            "08:30 PM",
            "",  # not being used in this test
            [],  # not being used in this test
            "",  # not being used in this test
            "",  # not being used in this test
            False,  # not being used in this test
            "scheduled",
            False,
            None,
            None,
            False,
            "tentative",
        ),
        # multi-day event
        (
            "FAKE NAME",
            "tournament",
            "FAKE LOCATION",
            "FAKE ADDRESS",
            "BRING YO CLEATS!",
            "11-17-2026",
            "11-19-2026",
            "",
            "",
            "",  # not being used in this test
            [],  # not being used in this test
            "",  # not being used in this test
            "",  # not being used in this test
            True,  # not being used in this test
            "scheduled",
            True,
            datetime(2026, 11, 17, 0, 0, 0, tzinfo=LOCAL_TZ),
            datetime(2026, 11, 19, 0, 0, 0, tzinfo=LOCAL_TZ),
            True,
            "scheduled",
        ),
    ],
)
def test_convert_event_input(
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
    expected_start_datetime,
    expected_end_datetime,
    expected_rsvp_open,
    expected_event_status,
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

    result = convert_event_input(event)

    assert (
        result["start_datetime"] == expected_start_datetime
    ), f"Start datetime should be {expected_start_datetime}, got {result["start_datetime"]}"

    assert (
        result["end_datetime"] == expected_end_datetime
    ), f"End datetime should be {expected_end_datetime}, got {result["start_datetime"]}"

    assert (
        result["rsvp_open"] == expected_rsvp_open
    ), f"RSVP open should be {expected_rsvp_open}, got {result["rsvp_open"]}"

    assert (
        result["event_status"] == expected_event_status
    ), f"Event status should be {expected_event_status}, got {result["event_status"]}"


@pytest.mark.parametrize(
    "tournament_type, is_registered, registration_deadline, group_transportation, lodging, expected_registration_deadline_date, expected_registration_deadline_time, expected_additional_requirements",
    [
        (
            "Regional",  # not used later
            False,  # also not used
            datetime(2026, 12, 1, 19, 0, 0, tzinfo=LOCAL_TZ),
            True,
            False,
            "12-01-2026",  # expected values
            "07:00 PM",
            ["group_transportation"],
        ),
        # deadline is None
        (
            "Regional",  # not used later
            False,  # also not used
            None,
            True,
            False,
            "",  # expected values
            "",
            ["group_transportation"],
        ),
        # no additional requirements
        (
            "Regional",  # not used later
            False,  # also not used
            datetime(2026, 12, 1, 19, 0, 0, tzinfo=LOCAL_TZ),
            False,
            False,
            "12-01-2026",  # expected values
            "07:00 PM",
            [],
        ),
    ],
)
def test_get_tournament_form_data(
    tournament_type,
    is_registered,
    registration_deadline,
    group_transportation,
    lodging,
    expected_registration_deadline_date,
    expected_registration_deadline_time,
    expected_additional_requirements,
):

    (
        registration_deadline_date,
        registration_deadline_time,
        additional_requirements,
    ) = get_tournament_form_data(
        {
            "tournament_type": tournament_type,
            "is_registered": is_registered,
            "registration_deadline": registration_deadline,
            "group_transportation": group_transportation,
            "lodging": lodging,
        }
    )

    assert (
        registration_deadline_date == expected_registration_deadline_date
    ), f"Registration deadline date should be {expected_registration_deadline_date}, got {registration_deadline_date}"

    assert (
        registration_deadline_time == expected_registration_deadline_time
    ), f"Registration deadline time should be {expected_registration_deadline_time}, got {registration_deadline_time}"

    assert (
        additional_requirements == expected_additional_requirements
    ), f"Additional requirements should be {expected_additional_requirements}, got {additional_requirements}"
