from sqlalchemy import String, ForeignKey
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    opponent_name: Mapped[str] = mapped_column(String(20))
    duke_score: Mapped[Optional[int]]
    opp_score: Mapped[Optional[int]]

    event = relationship("Event")
