from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, Literal
from datetime import datetime, timezone

from app.db.connection import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.event import (
    Event,
    GenericEventResponse,
    GenericEventDetailedResponse,
    format_event_data,
    format_date_time,
)
from app.models.app_config import get_current_semester_id
from app.models.practice import (
    PracticeResponse,
    PracticeDetailedResponse,
    get_practice_type,
    add_practice,
    delete_practice,
    update_practice,
)
from app.models.tournament import (
    TournamentResponse,
    TournamentDetailedResponse,
    get_tournament,
    add_tournament,
    get_tournament_type,
    delete_tournament,
    update_tournament,
)
from app.models.rsvp_submission import get_rsvp_response
from app.core.timezone import LOCAL_TZ


class EventCreate(BaseModel):
    name: str
    category: Literal["practice", "tournament", "game", "other"]
    location_name: str
    location_address: Optional[str] = None
    details: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None  # None for single day events
    start_time: Optional[str] = None  # None for multi-day events
    end_time: Optional[str] = None  # None for multi-day events
    event_type: Optional[str] = None
    additional_requirements: Optional[list[str]] = None
    registration_deadline_date: Optional[str] = None
    registration_deadline_time: Optional[str] = None
    is_multi_day: bool
    rsvp_open: bool


class EventCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int


class EventEditResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True)

    id: int
    name: str
    category: Literal["practice", "tournament", "game", "other"]
    location_name: str
    location_address: str
    details: str
    start_date: str
    end_date: str
    start_time: str
    end_time: str
    event_type: str
    additional_requirements: list[str]
    registration_deadline_date: str
    registration_deadline_time: str
    is_multi_day: bool
    rsvp_open: bool


EventResponse = PracticeResponse | TournamentResponse | GenericEventResponse
DetailedEventResponse = (
    PracticeDetailedResponse | TournamentDetailedResponse | GenericEventDetailedResponse
)

router = APIRouter(prefix="/events", tags=["events"])


def get_event_type(event_id, category, db):
    event_type = ""

    if category == "practice":
        event_type = get_practice_type(event_id, db=db)
    if category == "tournament":
        event_type = get_tournament_type(event_id, db=db)

    return event_type.lower()


def get_event_response_object(event, current_user, db: Session):
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


def match_db_format(event):
    is_tentative = (
        event.start_date is None
        or (event.location_name is None and event.location_address is None)
        or (
            (event.is_multi_day and event.end_date is None)
            or (not event.is_multi_day and event.start_time is None)
        )
    )

    event_status = "tentative" if is_tentative else "scheduled"

    # datetime logic
    start_datetime = None
    end_datetime = None

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
        if event.start_date and event.start_time:
            start_datetime = datetime.strptime(
                f"{event.start_date} {event.start_time}", "%m-%d-%Y %I:%M %p"
            ).replace(tzinfo=LOCAL_TZ)
        if event.start_date and event.end_time:
            end_datetime = datetime.strptime(
                f"{event.start_date} {event.end_time}", "%m-%d-%Y %I:%M %p"
            ).replace(tzinfo=LOCAL_TZ)

    if (not event.is_multi_day and event.end_date) or (
        event.is_multi_day and (event.start_time or event.end_time)
    ):
        # if a single event has extra end date
        # if multi day event has a start/end time
        raise HTTPException(
            status_code=400,
            detail="The event data does not match the expected structure for its type.",
        )

    return {
        "name": event.name,
        "category": event.category,
        "location_name": event.location_name,
        "location_address": event.location_address,
        "event_details": event.details,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "rsvp_open": event.rsvp_open,
        "event_status": event_status,
    }


@router.post("/", response_model=EventCreateResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):

    # get current semester_id
    semester_id = get_current_semester_id(db)

    # get current user
    current_user = 1

    event_dict = match_db_format(event)

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
        print("REAL ERROR INSIDE PRACTICE/TOURNAMENT INSERT:", repr(e))
        db.delete(new)
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to create event.")

    return new


@router.get("/", response_model=list[EventResponse])
def get_events(db: Session = Depends(get_db)):
    event_list = []

    events = db.scalars(
        select(Event)
        .where(Event.event_status == "scheduled")
        .order_by(Event.start_datetime)
    ).all()

    current_user = 1

    for event in events:
        event_response = get_event_response_object(event, current_user, db)
        event_list.append(event_response)

    return event_list


@router.get("/overview", response_model=list[EventResponse])
def get_n_upcoming_events(limit: int, db: Session = Depends(get_db)):
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
        event_response = get_event_response_object(event, current_user, db)
        event_list.append(event_response)

    return event_list


@router.get("/{event_id}", response_model=DetailedEventResponse)
def get_event_details(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.id == event_id))
    current_user = 1

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event_response = get_event_response_object(event, current_user, db)

    event_response["location_address"] = event.location_address or "TBD"
    event_response["details"] = event.event_details or "N/A"

    return event_response


@router.get("/{event_id}/form-responses", response_model=EventEditResponse)
def get_event_form_responses(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.id == event_id))
    current_user = 1

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    start_date, end_date, start_time, end_time, is_multi_day = format_date_time(event)
    event_type = get_event_type(event.id, event.category, db)

    registration_deadline_date = ""
    registration_deadline_time = ""
    additional_requirements = []

    if event.category == "tournament":
        tournament_details = get_tournament(event.id, current_user, db=db)
        deadline = tournament_details["registration_deadline"]

        if deadline is not None:
            registration_deadline_date = deadline.strftime("%m-%d-%Y")
            registration_deadline_time = deadline.strftime("%I:%M %p").lstrip("0")

        requirements = [
            "group_transportation",
            "lodging",
        ]  # any additional ones should be added here

        for k, v in tournament_details.items():
            if k in requirements and v is True:
                additional_requirements.append(k)

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


@router.patch("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def get_event_details(
    event_id: int, updated_event: EventCreate, db: Session = Depends(get_db)
):
    event = db.scalar(select(Event).where(Event.id == event_id))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event_dict = match_db_format(updated_event)

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


@router.patch("/{event_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
def get_event_details(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.id == event_id))

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.event_status = "canceled"
    db.commit()


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def get_event_details(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.id == event_id))

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
