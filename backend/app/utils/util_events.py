from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.event import Event
from app.models.practice import get_practice_type
from app.models.tournament import get_tournament, get_tournament_type
from app.models.rsvp_submission import get_rsvp_response
from app.core.timezone import LOCAL_TZ


def get_event_type(event_id, category, db):
    """Retrieves the specific type of a practice or tournament."""

    event_type = ""

    if category == "practice":
        event_type = get_practice_type(event_id, db=db)
    if category == "tournament":
        event_type = get_tournament_type(event_id, db=db)

    return event_type


def format_event_data(event: Event):
    """Formats event dates, times, and general details for display."""

    is_tentative = event.event_status == "tentative"

    date_label = None
    time = None

    start_datetime = (
        event.start_datetime.astimezone(LOCAL_TZ) if event.start_datetime else None
    )
    end_datetime = (
        event.end_datetime.astimezone(LOCAL_TZ) if event.end_datetime else None
    )

    # format date and time labels
    if start_datetime and end_datetime:

        if not event.is_multi_day:
            date_label = start_datetime.strftime("%A, %b %d")
            start_period = start_datetime.strftime("%p")
            end_period = end_datetime.strftime("%p")

            if event.start_time_provided:
                if start_period == end_period:  # both am or both pm
                    start = start_datetime.strftime("%I:%M").lstrip("0")
                else:
                    start = start_datetime.strftime("%I:%M%p").lstrip("0").lower()

                end = end_datetime.strftime("%I:%M%p").lstrip("0").lower()
                time = f"{start} - {end}"

        else:
            start_day = start_datetime.strftime("%a, %b %d")
            end_day = end_datetime.strftime("%a, %b %d")
            date_label = f"{start_day} - {end_day}"

            day_count = (end_datetime.date() - start_datetime.date()).days + 1
            time = f"{day_count} days"

    elif start_datetime:
        # date known, but no end time
        date_label = start_datetime.strftime("%A, %b %d")

    return {
        "id": event.id,
        "event_name": event.name,
        "category": event.category,
        "location_name": event.location_name or "TBD",
        "date_label": date_label or "TBD",
        "end_date": event.end_datetime or None,
        "time": time or "TBD",
        "is_tentative": is_tentative,
    }


def get_event_response_dict(event, current_user, db: Session):
    """Builds an event response dictionary with category-specific details."""

    event_response_base = format_event_data(event)

    # rsvp_response = get_rsvp_response(event_id=event.id, user_id=current_user, db=db)
    rsvp_response = None
    event_response_base["response"] = rsvp_response

    if event.category == "other" or event.category == "game":
        return event_response_base

    if event.category == "practice":
        practice_type = get_practice_type(event.id, db=db)
        event_response_base["practice_type"] = practice_type

        return event_response_base

    if event.category == "tournament":
        tournament = get_tournament(event.id, current_user, db=db)

        deadline = tournament["registration_deadline"]

        if deadline is not None:
            deadline = deadline.astimezone(LOCAL_TZ)
        deadline_label = (
            f"{deadline.strftime('%m/%d')} @ {deadline.strftime('%I:%M%p').lstrip('0').lower()}"
            if deadline
            else "TBD"
        )

        event_response_base["tournament_type"] = tournament["tournament_type"]
        event_response_base["is_registered"] = tournament["is_registered"]
        event_response_base["deadline_label"] = deadline_label
        event_response_base["deadline"] = deadline
        event_response_base["group_transportation_required"] = tournament[
            "group_transportation"
        ]
        event_response_base["lodging_required"] = tournament["lodging"]

        return event_response_base

    raise HTTPException(
        status_code=500, detail=f"Invalid event category: {event.category}"
    )


def format_event_form_datetime(event: Event):
    """
    Converts event datetimes into start_date, end_date, start_time, end_time, is_multi_day format used by the edit event form
    """

    start_date = ""
    end_date = ""
    start_time = ""
    end_time = ""
    is_multi_day = event.is_multi_day

    start_datetime = (
        event.start_datetime.astimezone(LOCAL_TZ) if event.start_datetime else None
    )
    end_datetime = (
        event.end_datetime.astimezone(LOCAL_TZ) if event.end_datetime else None
    )

    if start_datetime:
        start_date = start_datetime.strftime("%m-%d-%Y")

        if not is_multi_day:  # same day
            if event.start_time_provided:
                start_time = start_datetime.strftime("%I:%M %p")
                if end_datetime:
                    end_time = end_datetime.strftime("%I:%M %p")

    if end_datetime and event.is_multi_day:
        end_date = end_datetime.strftime("%m-%d-%Y")

    return start_date, end_date, start_time, end_time, is_multi_day


def convert_event_input(event):
    """Converts event input data into the format expected by the database."""

    if (not event.is_multi_day and event.end_date) or (
        event.is_multi_day and (event.start_time or event.end_time)
    ):
        # if a single event has extra end date OR if multi day event has a start/end time
        raise ValueError(
            "The event data does not match the expected structure for its type."
        )

    missing_required_info = (
        event.start_date is None
        or (event.location_name is None and event.location_address is None)
        or (
            (event.is_multi_day and event.end_date is None)
            or (not event.is_multi_day and (event.start_time is None))
        )
    )

    if missing_required_info:
        event_status = "tentative"
        rsvp_open = False
    else:
        if event.event_status not in ("scheduled", "tentative"):
            raise ValueError(f"Invalid event_status: {event.event_status}")
        event_status = event.event_status
        rsvp_open = event.rsvp_open

    # datetime logic
    start_datetime = None
    end_datetime = None
    start_time_provided = False

    if event.is_multi_day:
        # multi day events
        if event.start_date:
            start_datetime = datetime.strptime(event.start_date, "%m-%d-%Y").replace(
                tzinfo=LOCAL_TZ
            )
        if event.end_date:
            end_datetime = datetime.strptime(event.end_date, "%m-%d-%Y").replace(
                tzinfo=LOCAL_TZ
            )

    else:
        # single day events
        if event.start_date:
            if event.start_time:
                start_datetime = datetime.strptime(
                    f"{event.start_date} {event.start_time}", "%m-%d-%Y %I:%M %p"
                ).replace(tzinfo=LOCAL_TZ)
                start_time_provided = True
            else:
                start_datetime = datetime.strptime(
                    event.start_date, "%m-%d-%Y"
                ).replace(tzinfo=LOCAL_TZ)

        if event.start_date and event.end_time:
            end_datetime = datetime.strptime(
                f"{event.start_date} {event.end_time}", "%m-%d-%Y %I:%M %p"
            ).replace(tzinfo=LOCAL_TZ)

    if start_datetime and end_datetime and end_datetime <= start_datetime:
        raise ValueError("End datetime must be after start datetime.")

    return {
        "name": event.name,
        "category": event.category,
        "location_name": event.location_name,
        "location_address": event.location_address,
        "event_details": event.details,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "rsvp_open": rsvp_open,
        "event_status": event_status,
        "is_multi_day": event.is_multi_day,
        "start_time_provided": start_time_provided,
    }


def get_tournament_form_data(tournament_details):
    """Converts tournament details into the fields expected by the event form."""

    deadline = tournament_details["registration_deadline"]

    if deadline is not None:
        deadline = deadline.astimezone(LOCAL_TZ)
        registration_deadline_date = deadline.strftime("%m-%d-%Y")
        registration_deadline_time = deadline.strftime("%I:%M %p")
    else:
        registration_deadline_date = ""
        registration_deadline_time = ""

    requirements = [
        "group_transportation",
        "lodging",
    ]  # any additional ones should be added here

    additional_requirements = [req for req in requirements if tournament_details[req]]

    return (
        registration_deadline_date,
        registration_deadline_time,
        additional_requirements,
    )
