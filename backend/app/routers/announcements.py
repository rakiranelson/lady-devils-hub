from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone

from app.db.connection import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.announcement import Announcement
from app.models.app_config import get_current_semester_id
from app.core.timezone import LOCAL_TZ


class AnnouncementCreate(BaseModel):
    content: str
    expiration_date: str
    expiration_time: str
    pinned: bool


class AnnouncementResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True)

    id: int
    content: str
    pinned: bool
    created_time: str


router = APIRouter(prefix="/announcements", tags=["announcements"])


def get_relative_time(dt: datetime):
    now = datetime.now(timezone.utc)
    diff = now - dt

    seconds = diff.total_seconds()
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24
    weeks = days / 7
    months = days / 30.44  # average days per month

    if months >= 1:
        months = int(months)
        return f"{months} month{'s' if months != 1 else ''} ago"
    if weeks >= 1:
        weeks = int(weeks)
        return f"{weeks} week{'s' if weeks != 1 else ''} ago"
    if days >= 1:
        days = int(days)
        return f"{days} day{'s' if days != 1 else ''} ago"
    if hours >= 1:
        hours = int(hours)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    if minutes >= 1:
        minutes = int(minutes)
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"

    return "just now"


@router.post("/", status_code=status.HTTP_204_NO_CONTENT)
def create_announcement(
    announcement: AnnouncementCreate, db: Session = Depends(get_db)
):

    # get current semester_id
    semester_id = get_current_semester_id(db)

    # get current user
    current_user = 1

    # datetime logic
    expires_at = datetime.strptime(
        f"{announcement.expiration_date} {announcement.expiration_time}",
        "%m-%d-%Y %I:%M %p",
    ).replace(tzinfo=LOCAL_TZ)

    new = Announcement(
        content=announcement.content,
        expires_at=expires_at,
        pinned=announcement.pinned,
        created_by=current_user,
    )

    db.add(new)
    db.commit()
    db.refresh(new)


@router.get("/", response_model=list[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):

    now = datetime.now(timezone.utc)

    announcements = db.scalars(
        select(Announcement)
        .where(Announcement.expires_at > now)
        .order_by(Announcement.created_time.desc())
    ).all()

    return [
        {
            "id": a.id,
            "content": a.content,
            "pinned": a.pinned,
            "created_time": get_relative_time(a.created_time),
        }
        for a in announcements
    ]
