from sqlalchemy import String, ForeignKey, select
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from app.models.event import GenericEventResponse, Event


class Practice(Base):
    __tablename__ = "practices"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"), primary_key=True)
    practice_type: Mapped[str] = mapped_column(String(50))

    event = relationship("Event")


class PracticeResponse(GenericEventResponse):
    practice_type: str


class PracticeDetailedResponse(PracticeResponse):
    location_address: str
    details: str


def get_practice_type(event_id, db: Session):
    practice_type = db.scalar(
        select(Practice).where(Practice.id == event_id)
    ).practice_type

    if practice_type == "iq":  # if it iq uppercase
        return practice_type.upper()

    return practice_type.capitalize()  # capitalize other practice types


def add_practice(event_id, practice_type, db: Session):
    new = Practice(id=event_id, practice_type=practice_type)

    db.add(new)
    db.commit()
    db.refresh(new)
