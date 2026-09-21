<<<<<<< HEAD
from sqlalchemy import Numeric, ForeignKey, String
from typing import Optional
=======
from sqlalchemy import Numeric, ForeignKey, select
>>>>>>> backend
from decimal import Decimal
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from app.models.event import GenericEventResponse
from datetime import datetime


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    player_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    team_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    tournament_type: Mapped[str] = mapped_column(String(50))
    registration_deadline: Mapped[Optional[datetime]]
    group_transportation_required: Mapped[bool]
    lodging_required: Mapped[bool]

    event = relationship("Event")


class TournamentResponse(GenericEventResponse):
    tournament_type: str
    response: str | None
    is_registered: bool
    deadline_label: str
    deadline: datetime


class TournamentDetailsResponse(TournamentResponse):
    location_address: str
    details: str


def get_tournament_summary(event_id, db: Session):
    tournament_type = db.scalar(select(Tournament).where(Tournament.id == event_id)).to
