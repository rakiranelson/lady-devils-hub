from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Staff(Base):
    __tablename__ = "staff"

    staff_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    staff_role: Mapped[str] = mapped_column(String(50))
    active_semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))

    user = relationship("User")
