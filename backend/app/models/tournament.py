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
    is_registered: bool
    deadline: datetime | None
    deadline_label: str


class TournamentDetailedResponse(TournamentResponse):
    location_address: str
    details: str
    group_transportation_required: bool
    lodging_required: bool


def get_tournament(event_id, user_id, db: Session):
    tournament = db.scalar(select(Tournament).where(Tournament.id == event_id))

    tournament_type = tournament.tournament_type.capitalize()
    registration_deadline = tournament.registration_deadline or None
    group_transportation_required = tournament.group_transportation_required
    lodging_required = tournament.lodging_required

    is_registered = db.scalar(
        select(
            select(TournamentRegistration)
            .where(
                TournamentRegistration.tournament_id == event_id,
                TournamentRegistration.user_id == user_id,
            )
            .exists()
        )
    )

    return {
        "tournament_type": tournament_type,
        "is_registered": is_registered,
        "registration_deadline": registration_deadline,
        "group_transportation_required": group_transportation_required,
        "lodging_required": lodging_required,
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
        "%m-%d-%Y %I:%M %p",
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
