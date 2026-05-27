from sqlalchemy import String, ForeignKey
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class EventPollOption(Base):
    __tablename__ = "event_poll_options"

    option_id: Mapped[int] = mapped_column(primary_key=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id"))
    location_name: Mapped[Optional[str]] = mapped_column(String(255))
    start_datetime: Mapped[Optional[datetime]]
    end_datetime: Mapped[Optional[datetime]]

    poll = relationship("Poll")
