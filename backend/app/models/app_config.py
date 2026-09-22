from sqlalchemy import ForeignKey, select
from sqlalchemy.orm import Mapped, mapped_column, relationship, Session

from app.db.connection import Base
from fastapi import Depends
from app.models.semester import Semester


class AppConfig(Base):
    __tablename__ = "app_config"

    config_id: Mapped[int] = mapped_column(primary_key=True)
    current_semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))

    current = relationship("Semester")


def get_current_semester_id(db: Session):
    return db.scalar(select(AppConfig)).current_semester_id
