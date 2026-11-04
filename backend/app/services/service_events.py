from fastapi import HTTPException
from datetime import datetime, timezone
from sqlalchemy import select

from app.models.event import Event
from app.models.app_config import get_app_config
from app.models.practice import (
    add_practice,
    delete_practice,
    update_practice,
)
from app.models.tournament import (
    get_tournament,
    add_tournament,
    delete_tournament,
    update_tournament,
)
from app.models.rsvp_submission import get_rsvp_response
from app.core.timezone import LOCAL_TZ
from app.utils.util_events import *


def create_event(event, db: Session):
    """Creates an event and its associated practice or tournament record in db"""

    # get current semester_id
    semester_id = get_app_config(db).current_semester_id

    # get current user
    current_user = 1

    try:
        event_dict = convert_event_input(event)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    new = Event(
        name=event_dict["name"],
        semester_id=semester_id,
        category=event_dict["category"],
        location_name=event_dict["location_name"],
        location_address=event_dict["location_address"],
        event_details=event_dict["event_details"],
        start_datetime=event_dict["start_datetime"],
        end_datetime=event_dict["end_datetime"],
        rsvp_open=event_dict["rsvp_open"],
        event_status=event_dict["event_status"],
        created_by=current_user,
    )

    db.add(new)
    db.commit()
    db.refresh(new)

    try:
        if new.category == "practice":
            add_practice(new.id, event.event_type, db)
        if new.category == "tournament":
            add_tournament(
                new.id,
                event.event_type,
                event.additional_requirements,
                event.registration_deadline_date,
                event.registration_deadline_time,
                db,
            )
    except Exception as e:
        print("ERROR INSIDE PRACTICE/TOURNAMENT INSERT:", repr(e))
        db.delete(new)
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to create event.")

    return new


def get_events(db: Session):
    """Retrieves all scheduled events with their response details"""

    event_list = []

    events = db.scalars(
        select(Event)
        .where(Event.event_status == "scheduled")
        .order_by(Event.start_datetime)
    ).all()

    current_user = 1

    for event in events:
        event_response = get_event_response_dict(event, current_user, db)
        event_list.append(event_response)

    return event_list


def get_n_upcoming_events(limit, db: Session):
    """Retrieves a limited (n) number of upcoming scheduled events"""

    event_list = []

    events = db.scalars(
        select(Event)
        .where(
            Event.event_status == "scheduled",
            Event.end_datetime > datetime.now(timezone.utc),
        )
        .order_by(Event.start_datetime)
        .limit(limit)
    ).all()

    current_user = 1

    for event in events:
        event_response = get_event_response_dict(event, current_user, db)
        event_list.append(event_response)

    return event_list


def get_event_details(event_id, db: Session):
    """Retrieves an event and its details by event id"""

    event = db.scalar(select(Event).where(Event.id == event_id))
    current_user = 1

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event_response = get_event_response_dict(event, current_user, db)

    event_response["location_address"] = event.location_address or "TBD"
    event_response["details"] = event.event_details or "N/A"

    return event_response


def get_event_form_responses(event_id, db: Session):
    """Retrieves an event's data and formats it so previous responses can be viewed in the edit event form"""

    event = db.scalar(select(Event).where(Event.id == event_id))
    current_user = 1

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    start_date, end_date, start_time, end_time, is_multi_day = (
        format_event_form_datetime(event)
    )
    event_type = get_event_type(event.id, event.category, db)

    registration_deadline_date = ""
    registration_deadline_time = ""
    additional_requirements = []

    if event.category == "tournament":
        tournament_details = get_tournament(event.id, current_user, db=db)

        (
            registration_deadline_date,
            registration_deadline_time,
            additional_requirements,
        ) = get_tournament_form_data(tournament_details)

    return {
        "id": event.id,
        "name": event.name,
        "category": event.category,
        "location_name": event.location_name or "",
        "location_address": event.location_address or "",
        "details": event.event_details or "",
        "start_date": start_date,
        "end_date": end_date,
        "start_time": start_time,
        "end_time": end_time,
        "event_type": event_type,
        "additional_requirements": additional_requirements,
        "registration_deadline_date": registration_deadline_date,
        "registration_deadline_time": registration_deadline_time,
        "is_multi_day": is_multi_day,
        "rsvp_open": event.rsvp_open,
    }


def update_event(event_id, updated_event, db: Session):
    """Updates an event and its associated practice or tournament record"""

    event = db.scalar(select(Event).where(Event.id == event_id))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    try:
        event_dict = convert_event_input(updated_event)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    old_category = event.category
    new_category = event_dict["category"]

    if old_category != new_category:
        if old_category == "practice":
            delete_practice(event_id, db)
        if old_category == "tournament":
            delete_tournament(event_id, db)

        if new_category == "practice":
            add_practice(event_id, updated_event.event_type, db)
        if new_category == "tournament":
            add_tournament(
                event_id,
                updated_event.event_type,
                updated_event.additional_requirements,
                updated_event.registration_deadline_date,
                updated_event.registration_deadline_time,
                db,
            )
    else:
        if new_category == "practice":
            update_practice(event.id, updated_event.event_type, db)

        if new_category == "tournament":
            update_tournament(
                event.id,
                updated_event.event_type,
                updated_event.additional_requirements,
                updated_event.registration_deadline_date,
                updated_event.registration_deadline_time,
                db,
            )

    # update event
    event.name = event_dict["name"]
    event.category = event_dict["category"]
    event.location_name = event_dict["location_name"]
    event.location_address = event_dict["location_address"]
    event.event_details = event_dict["event_details"]
    event.start_datetime = event_dict["start_datetime"]
    event.end_datetime = event_dict["end_datetime"]
    event.rsvp_open = event_dict["rsvp_open"]
    event.event_status = event_dict["event_status"]

    db.commit()


def cancel_event(event_id, db: Session):
    """Changes an event's status to canceled"""

    event = db.scalar(select(Event).where(Event.id == event_id))

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.event_status = "canceled"
    db.commit()


def delete_event(event_id, db: Session):
    """Deletes an event from the database"""

    event = db.scalar(select(Event).where(Event.id == event_id))

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
