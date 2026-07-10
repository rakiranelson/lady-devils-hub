from sqlalchemy import String
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.connection import Base


class Play(Base):
    __tablename__ = "plays"

    id: Mapped[int] = mapped_column(primary_key=True)
    play_name: Mapped[str] = mapped_column(String(255))
    play_type: Mapped[str] = mapped_column(String(20))
    play_number: Mapped[Optional[int]]
    thumbnail_url: Mapped[str]
    animation_url: Mapped[Optional[str]]
    description: Mapped[Optional[str]]
