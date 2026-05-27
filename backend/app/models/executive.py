from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class Executive(Base):
    __tablename__ = "executives"

    executive_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    position: Mapped[str] = mapped_column(String(50))
    term_start_year: Mapped[int]

    user = relationship("User")
