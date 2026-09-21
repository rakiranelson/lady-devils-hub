from sqlalchemy import Numeric, ForeignKey, String, select
from decimal import Decimal
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from app.models.event import GenericEventResponse
from app.models.tournament_registration import TournamentRegistration
from datetime import datetime


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    player_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    team_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    tournament_type: Mapped[str] = mapped_column(String(50))
    registration_deadline: Mapped[datetime]
    group_transportation_required: Mapped[bool]
    lodging_required: Mapped[bool]

    event = relationship("Event")


class TournamentResponse(GenericEventResponse):
    tournament_type: str
    response: str | None
    is_registered: bool
    registration_deadline: datetime
    deadline_label: str


class TournamentDetailsResponse(TournamentResponse):
    location_address: str
    details: str


def get_tournament_summary(event_id, user_id, db: Session):
    tournament = db.scalar(select(Tournament).where(Tournament.id == event_id))

    tournament_type = tournament.tournament_type
    registration_deadline = tournament.registration_deadline

    is_registered = db.scalar(
        select(TournamentRegistration)
        .where(
            TournamentRegistration.tournament_id == event_id,
            TournamentRegistration.user_id == user_id,
        )
        .exists()
    )

    return {
        "tournament_type": tournament_type,
        "is_registered": is_registered,
        "registration_deadline": registration_deadline,
    }
