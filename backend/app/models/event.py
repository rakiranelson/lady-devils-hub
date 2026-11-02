from sqlalchemy import String, ForeignKey, FetchedValue
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from app.core.timezone import LOCAL_TZ

from app.models.user import User


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))
    category: Mapped[str] = mapped_column(String(30))

    # optional
    location_name: Mapped[Optional[str]] = mapped_column(String(255))
    location_address: Mapped[Optional[str]] = mapped_column(String(255))
    event_details: Mapped[Optional[str]]
    start_datetime: Mapped[Optional[datetime]]
    end_datetime: Mapped[Optional[datetime]]
    created_time: Mapped[datetime] = mapped_column(FetchedValue())
    event_status: Mapped[str]

    rsvp_open: Mapped[bool]

    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    creator = relationship("User")


class GenericEventResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True)

    id: int
    category: str
    event_name: str
    location_name: str
    date_label: str
    end_date: datetime | None
    time: str
    response: str | None
    is_tentative: bool


class GenericEventDetailedResponse(GenericEventResponse):
    location_address: str
    details: str


def format_event_data(event: Event):
    is_tentative = event.event_status == "tentative"

    date_label = None
    time = None

    start_datetime = (
        event.start_datetime.astimezone(LOCAL_TZ) if event.start_datetime else None
    )
    end_datetime = (
        event.end_datetime.astimezone(LOCAL_TZ) if event.end_datetime else None
    )

    same_day = start_datetime.date() == end_datetime.date()

    # format date and time labels
    if start_datetime and end_datetime:
        if same_day:
            date_label = start_datetime.strftime("%A, %b %d")
            start_period = start_datetime.strftime("%p")
            end_period = end_datetime.strftime("%p")

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


def format_date_time(event: Event):
    """
    Used to format into start_date, end_date, start_time, end_time, is_multi_day format
    so we can view previous responses to the create/edit event form
    """

    start_date = ""
    end_date = ""
    start_time = ""
    end_time = ""
    is_multi_day = False

    start_datetime = (
        event.start_datetime.astimezone(LOCAL_TZ) if event.start_datetime else None
    )
    end_datetime = (
        event.end_datetime.astimezone(LOCAL_TZ) if event.end_datetime else None
    )

    if start_datetime:
        same_day = start_datetime.date() == end_datetime.date()
        start_date = start_datetime.strftime("%m-%d-%Y")

        if same_day:
            start_time = start_datetime.strftime("%I:%M %p")
            end_time = end_datetime.strftime("%I:%M %p")
        else:
            end_date = end_datetime.strftime("%m-%d-%Y")
            is_multi_day = not same_day

    return start_date, end_date, start_time, end_time, is_multi_day
