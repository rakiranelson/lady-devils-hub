from sqlalchemy import String, ForeignKey
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class TransportationGroup(Base):
    __tablename__ = "transportation_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    group_name: Mapped[str] = mapped_column(String(100))
    capacity: Mapped[Optional[int]]
    notes: Mapped[Optional[str]]

    event = relationship("Event")
