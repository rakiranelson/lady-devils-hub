from sqlalchemy import Numeric, ForeignKey
from decimal import Decimal
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    player_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    team_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    event = relationship("Event")
