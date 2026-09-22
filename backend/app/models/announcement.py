from sqlalchemy import ForeignKey, FetchedValue
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base
from app.models.user import User


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str]
    expires_at: Mapped[datetime]
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    pinned: Mapped[bool] = mapped_column(FetchedValue())
    created_time: Mapped[datetime] = mapped_column(FetchedValue())

    creator = relationship("User")
