from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class TournamentRegistration(Base):
    __tablename__ = "tournament_registrations"

    tournament_id: Mapped[int] = mapped_column(ForeignKey("tournaments.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    payment_status: Mapped[str] = mapped_column(String(20))

    tournament = relationship("Tournament")
    user = relationship("User")
