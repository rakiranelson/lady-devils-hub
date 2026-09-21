from sqlalchemy import String, ForeignKey, select
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from app.models.event import GenericEventResponse


class Practice(Base):
    __tablename__ = "practices"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    practice_type: Mapped[str] = mapped_column(String(50))

    event = relationship("Event")


class PracticeResponse(GenericEventResponse):
    practice_type: str
    response: str | None


class PracticeDetailsResponse(PracticeResponse):
    location_address: str
    details: str


def get_practice_type(event_id, db: Session):
    return db.scalar(select(Practice).where(Practice.id == event_id)).practice_type
