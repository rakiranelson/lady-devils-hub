from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.user import User
from app.models.event import Event


class Attendance(Base):
    __tablename__ = "attendance"

    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    attended: Mapped[bool]

    user = relationship("User")
    event = relationship("Event")
