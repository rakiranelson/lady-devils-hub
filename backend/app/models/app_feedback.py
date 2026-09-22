from sqlalchemy import ForeignKey, FetchedValue
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.user import User


class AppFeedback(Base):
    __tablename__ = "app_feedback"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    feedback_message: Mapped[str]
    submitted_time: Mapped[datetime] = mapped_column(FetchedValue())

    user = relationship("User")
