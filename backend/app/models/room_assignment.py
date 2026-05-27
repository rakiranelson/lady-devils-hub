from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class RoomAssignment(Base):
    __tablename__ = "room_assignments"

    room_id: Mapped[int] = mapped_column(ForeignKey("room_spaces.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    room = relationship("RoomSpace")
    user = relationship("User")
