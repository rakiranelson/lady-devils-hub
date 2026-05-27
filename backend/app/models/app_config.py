from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class AppConfig(Base):
    __tablename__ = "app_config"

    config_id: Mapped[int]
    current_semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"))

    current = relationship("Semester")
