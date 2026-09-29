from pydantic import BaseModel, ConfigDict
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Literal
from datetime import datetime

from app.db.connection import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.event import Event, GenericEventResponse
from app.models.semester import Semester
from app.models.app_config import get_current_semester_id
from app.models.practice import (
    Practice,
    PracticeResponse,
    get_practice_type,
    add_practice,
)
from app.models.tournament import (
    Tournament,
    TournamentResponse,
    get_tournament_summary,
    add_tournament,
)
from app.models.rsvp_submission import get_rsvp_response


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


EventResponse = PracticeResponse | TournamentResponse | GenericEventResponse

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventCreateResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):

    # get current semester_id
    semester_id = get_current_semester_id(db)

    # get current user
    current_user = 1

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
            start_datetime = datetime.strptime(event.start_date, "%m-%d-%Y")
        if event.end_date:
            end_datetime = datetime.strptime(event.end_date, "%m-%d-%Y")

    else:
        # single day events
        if event.start_date and event.start_time:
            start_datetime = datetime.strptime(
                f"{event.start_date} {event.start_time}", "%m-%d-%Y %I:%M %p"
            )
        if event.start_date and event.end_time:
            end_datetime = datetime.strptime(
                f"{event.start_date} {event.end_time}", "%m-%d-%Y %I:%M %p"
            )

    if (not event.is_multi_day and event.end_date) or (
        event.is_multi_day and (event.start_time or event.end_time)
    ):
        # if a single event has extra end date
        # if multi day event has a start/end time
        raise HTTPException(
            status_code=400,
            detail="The event data does not match the expected structure for its type.",
        )

    new = Event(
        name=event.name,
        semester_id=semester_id,
        category=event.category,
        location_name=event.location_name,
        location_address=event.location_address,
        event_details=event.details,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        rsvp_open=event.rsvp_open,
        is_multi_day=event.is_multi_day,
        event_status=event_status,
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
    except Exception:
        db.delete(new)
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to create event.")

    return new


@router.get("/{event_id}", response_model=EventResponse)
def get_event_summary(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.id == event_id))
    current_user = 1

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    same_day = event.start_datetime.date() == event.end_datetime.date()

    # format date and time labels
    if same_day:
        date_label = event.start_datetime.strftime("%A, %b %d")
        start_period = event.start_datetime.strftime("%p")
        end_period = event.end_datetime.strftime("%p")

        if start_period == end_period:  # both am or both pm
            start = event.start_datetime.strftime("%I:%M").lstrip("0")
        else:
            start = event.start_datetime.strftime("%I:%M%p").lstrip("0").lower()

        end = event.end_datetime.strftime("%I:%M%p").lstrip("0").lower()
        time = f"{start} - {end}"

    else:
        start_day = event.start_datetime.strftime("%b %d")
        end_day = event.end_datetime.strftime("%b %d")
        date_label = f"{start_day} - {end_day}"
        time = "All Day"

    # fetch response
    response = get_rsvp_response(event_id=event.id, user_id=current_user, db=db)

    if event.category == "other":
        return {
            "id": event.id,
            "event_name": event.name,
            "category": event.category,
            "location_name": event.location_name,
            "date_label": date_label,
            "end_date": event.end_datetime,
            "time": time,
            "response": response,
        }

    if event.category == "practice":
        practice_type = get_practice_type(event.id, db=db)

        return {
            "id": event.id,
            "event_name": event.name,
            "category": event.category,
            "location_name": event.location_name,
            "date_label": date_label,
            "end_date": event.end_datetime,
            "time": time,
            "practice_type": practice_type,
            "response": response,
        }

    if event.category == "tournament":
        summary = get_tournament_summary(event.id, current_user, db=db)
        tournament_type = summary["tournament_type"]
        is_registered = summary["is_registered"]
        deadline = summary["registration_deadline"]
        deadline_label = deadline.strftime("%A, %b %d")

        return {
            "id": event.id,
            "event_name": event.name,
            "category": event.category,
            "location_name": event.location_name,
            "date_label": date_label,
            "end_date": event.end_datetime,
            "time": time,
            "tournament_type": tournament_type,
            "response": response,
            "is_registered": is_registered,
            "registration_deadline": deadline,
            "deadline_label": deadline_label,
        }

    raise HTTPException(
        status_code=500, detail=f"Invalid event category: {event.category}"
    )
