from sqlalchemy import String, ForeignKey
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.lodging import Lodging


class RoomSpace(Base):
    __tablename__ = "room_spaces"

    id: Mapped[int] = mapped_column(primary_key=True)
    location_id: Mapped[int] = mapped_column(ForeignKey("lodgings.id"))
    space_name: Mapped[str] = mapped_column(String(100))
    capacity: Mapped[Optional[int]]
    notes: Mapped[Optional[str]]

    location = relationship("Lodging")
