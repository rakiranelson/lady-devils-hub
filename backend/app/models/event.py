from sqlalchemy import String, ForeignKey
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))
    category: Mapped[str] = mapped_column(String(30))
    location_name: Mapped[str] = mapped_column(String(255))

    # optional
    location_address: Mapped[Optional[str]] = mapped_column(String(255))
    event_details: Mapped[Optional[str]]
    start_datetime: Mapped[Optional[datetime]]
    end_datetime: Mapped[Optional[datetime]]
    created_time: Mapped[datetime]

    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))

    creator = relationship("User")


class GenericEventResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel)

    id: int
    category: str
    event_name: str
    location_name: str
    date_label: str
    end_date: datetime
    time: str


class GenericEventDetailsResponse(GenericEventResponse):
    location_address: str
    details: str
