from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Practice(Base):
    __tablename__ = "practices"

    id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    practice_type: Mapped[str] = mapped_column(String(50))

    event = relationship("Event")
