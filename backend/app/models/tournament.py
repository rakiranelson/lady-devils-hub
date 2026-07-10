from sqlalchemy import Numeric, ForeignKey, String
from typing import Optional
from decimal import Decimal
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    player_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    team_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    tournament_type: Mapped[str] = mapped_column(String(50))
    registration_deadline: Mapped[Optional[datetime]]

    event = relationship("Event")
