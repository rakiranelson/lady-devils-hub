from sqlalchemy import String, ForeignKey, FetchedValue
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.connection import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    firstname: Mapped[str] = mapped_column(String(255))
    lastname: Mapped[str] = mapped_column(String(255))
    user_type: Mapped[str] = mapped_column(String(20))

    joined_semester_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("semesters.id")
    )
    class_year: Mapped[Optional[int]]
    jersey_num: Mapped[Optional[int]]

    duke_email: Mapped[Optional[str]] = mapped_column(String(255))
    external_email: Mapped[Optional[str]] = mapped_column(String(255))
    hash_password: Mapped[Optional[str]]

    is_admin: Mapped[bool] = mapped_column(FetchedValue())
