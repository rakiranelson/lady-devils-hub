from sqlalchemy import ForeignKey, FetchedValue
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.poll import Poll


class PollSubmission(Base):
    __tablename__ = "poll_submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    submitted_time: Mapped[datetime] = mapped_column(FetchedValue())

    poll = relationship("Poll")
