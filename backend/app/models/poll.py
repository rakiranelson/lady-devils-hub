from sqlalchemy import String, ForeignKey, FetchedValue
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.event import Event


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    title: Mapped[str] = mapped_column(String(255))
    created_time: Mapped[datetime] = mapped_column(FetchedValue())

    event = relationship("Event")
