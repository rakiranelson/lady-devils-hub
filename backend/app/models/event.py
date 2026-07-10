from sqlalchemy import String, ForeignKey
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))
    location_name: Mapped[str] = mapped_column(String(255))

    location_address: Mapped[Optional[str]] = mapped_column(String(255))
    event_details: Mapped[Optional[str]]
    category: Mapped[Optional[str]] = mapped_column(String(30))

    start_datetime: Mapped[Optional[datetime]]
    end_datetime: Mapped[Optional[datetime]]
    created_time: Mapped[datetime]

    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))

    creator = relationship("User")
