from sqlalchemy import ForeignKey
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class DriverResponse(Base):
    __tablename__ = "driver_responses"

    id: Mapped[int] = mapped_column(primary_key=True)
    tournament_id: Mapped[int] = mapped_column(ForeignKey("tournaments.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    can_drive: Mapped[bool]
    seat_capacity: Mapped[Optional[int]]
    notes: Mapped[Optional[str]]
    submitted_time: Mapped[datetime]

    user = relationship("User")
