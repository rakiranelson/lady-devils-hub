from sqlalchemy import String, ForeignKey, FetchedValue
from datetime import datetime, time
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.connection import Base


class UserAvailability(Base):
    __tablename__ = "user_availability"

    id: Mapped[int] = mapped_column(primary_key=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    day_of_week: Mapped[str] = mapped_column(String(10))
    start_time: Mapped[time]
    end_time = Mapped[time]
    last_updated = Mapped[datetime] = mapped_column(FetchedValue())
