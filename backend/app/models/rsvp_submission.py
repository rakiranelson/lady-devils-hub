from sqlalchemy import Integer, String, DateTime, Time, Boolean, ForeignKey, select
from typing import Optional
from datetime import datetime, time
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base


class RSVPSubmission(Base):
    __tablename__ = "rsvp_submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    submission_value: Mapped[str] = mapped_column(String(10))
    submitted_time: Mapped[str]

    event = relationship("Event")
    user = relationship("User")


def get_rsvp_response(event_id, user_id, db: Session):
    return db.scalar(
        select(RSVPSubmission).where(
            RSVPSubmission.event_id == event_id, RSVPSubmission.user_id == user_id
        )
    ).submission_value
