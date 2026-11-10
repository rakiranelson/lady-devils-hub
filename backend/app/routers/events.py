from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from fastapi import APIRouter, Depends, status
from typing import Optional, Literal

from app.db.connection import get_db
from sqlalchemy.orm import Session

from app.models.event import (
    GenericEventResponse,
    GenericEventDetailedResponse,
)
from app.models.practice import (
    PracticeResponse,
    PracticeDetailedResponse,
)
from app.models.tournament import (
    TournamentResponse,
    TournamentDetailedResponse,
)
from app.services.service_events import *


class EventCreate(BaseModel):
    name: str
    category: Literal["practice", "tournament", "game", "other"]
    location_name: Optional[str] = None
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
    event_status: str
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
    event_status: str
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


@router.post(
    "/", response_model=EventCreateResponse, status_code=status.HTTP_201_CREATED
)
def create_event_endpoint(event: EventCreate, db: Session = Depends(get_db)):
    return create_event(event, db)  # from service_events.py


@router.get("/", response_model=list[EventResponse], status_code=status.HTTP_200_OK)
def get_events_endpoint(db: Session = Depends(get_db)):
    return get_events(db)  # from service_events.py


@router.get(
    "/overview", response_model=list[EventResponse], status_code=status.HTTP_200_OK
)
def get_overview_events(limit: int, db: Session = Depends(get_db)):
    return get_n_upcoming_events(limit, db)  # from service_events.py


@router.get(
    "/{event_id}", response_model=DetailedEventResponse, status_code=status.HTTP_200_OK
)
def get_event_details_endpoint(event_id: int, db: Session = Depends(get_db)):
    return get_event_details(event_id, db)  # from service_events.py


@router.patch("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_event_endpoint(
    event_id: int, updated_event: EventCreate, db: Session = Depends(get_db)
):
    return update_event(event_id, updated_event, db)  # from service_events.py


@router.patch("/{event_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
def cancel_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    return cancel_event(event_id, db)  # from service_events.py


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    return delete_event(event_id, db)  # from service_events.py
