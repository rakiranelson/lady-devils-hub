from sqlalchemy import String, ForeignKey
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Lodging(Base):
    __tablename__ = "lodgings"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    location_name: Mapped[Optional[str]] = mapped_column(String(100))
    location_address: Mapped[Optional[str]] = mapped_column(String(255))
    notes: Mapped[Optional[str]]

    event = relationship("Event")
