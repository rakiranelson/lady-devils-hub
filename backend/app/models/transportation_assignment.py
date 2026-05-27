from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.connection import Base


class TransportationAssignment(Base):
    __tablename__ = "transportation_assignments"

    group_id: Mapped[int] = mapped_column(ForeignKey("transportation_groups.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    is_driver: Mapped[bool]

    group = relationship("TransportationGroup")
    user = relationship("User")
