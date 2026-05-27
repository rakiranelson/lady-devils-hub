from sqlalchemy import Integer, String, DateTime, Time, Boolean, ForeignKey
from typing import Optional
from datetime import datetime, time
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class RSVPSubmission(Base):
    __tablename__ = "rsvp_submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    submission_vale: Mapped[str] = mapped_column(String(10))
    submitted_time: Mapped[str]

    event = relationship("Event")
    user = relationship("User")
