from sqlalchemy import Numeric, ForeignKey, String, select
from decimal import Decimal
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from app.models.event import GenericEventResponse
from app.models.tournament_registration import TournamentRegistration
from datetime import datetime

from app.models.event import Event


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"), primary_key=True)
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


def add_tournament(
    event_id,
    tournament_type,
    additional_requirements,
    registration_deadline_date,
    registration_deadline_time,
    db: Session,
):
    group_transportation_required = (
        True if "group_transportation" in additional_requirements else False
    )
    lodging_required = True if "lodging" in additional_requirements else False

    registration_deadline = datetime.strptime(
        f"{registration_deadline_date} {registration_deadline_time}",
        "%Y-%m-%d %I:%M %p",
    )

    new = Tournament(
        id=event_id,
        tournament_type=tournament_type,
        registration_deadline=registration_deadline,
        group_transportation_required=group_transportation_required,
        lodging_required=lodging_required,
    )

    db.add(new)
    db.commit()
    db.refresh(new)
