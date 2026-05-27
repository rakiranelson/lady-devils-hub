from sqlalchemy import String
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.connection import Base


class Semester(Base):
    __tablename__ = "semesters"

    id: Mapped[int] = mapped_column(primary_key=True)
    semester: Mapped[str] = mapped_column(String(10))
    term_year: Mapped[int]
