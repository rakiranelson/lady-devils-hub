from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.poll_submission import PollSubmission


class PollSelection(Base):
    __tablename__ = "poll_selections"

    submission_id: Mapped[int] = mapped_column(
        ForeignKey("poll_submissions.id"), primary_key=True
    )
    option_id: Mapped[int] = mapped_column(
        ForeignKey("event_poll_options.option_id"), primary_key=True
    )

    submission = relationship("PollSubmission")
