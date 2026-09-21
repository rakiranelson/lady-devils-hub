from pydantic import BaseModel, ConfigDict
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from datetime import datetime

from app.db.connection import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.event import Event, GenericEventResponse
from app.models.semester import Semester
from app.models.app_config import get_current_semester_id
from app.models.practice import Practice, PracticeResponse, get_practice_type
from app.models.tournament import Tournament, TournamentResponse, get_tournament_summary
from app.models.rsvp_submission import get_rsvp_response


class EventCreate(BaseModel):
    name: str
    category: str
    location_name: str
    location_address: Optional[str] = None
    details: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None  # None for single day events
    time_start: Optional[str] = None  # None for multi-day events
    time_end: Optional[str] = None  # None for multi-day events
    auto_open_rsvp: bool


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

    # datetime logic
    if event.end_date and not event.time_start:
        start_datetime = datetime.strptime(event.start_date, "%Y-%m-%d")
        end_datetime = datetime.strptime(event.end_date, "%Y-%m-%d")
    elif event.time_start and not event.end_date:
        start_datetime = datetime.strptime(
            f"{event.start_date} {event.time_start}", "%Y-%m-%d %I:%M %p"
        )
        end_datetime = datetime.strptime(
            f"{event.start_date} {event.time_end}", "%Y-%m-%d %I:%M %p"
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Must provide either end_date OR time_start/time_end",
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
        created_by=current_user,
    )

    db.add(new)
    db.commit()
    db.refresh(new)

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
            "name": event.name,
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
            "name": event.name,
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
            "name": event.name,
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
