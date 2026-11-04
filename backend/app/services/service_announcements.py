from fastapi import HTTPException
from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.announcement import Announcement
from app.models.app_config import get_app_config
from app.core.timezone import LOCAL_TZ

from app.utils.util_announcements import *


def create_announcement(announcement, db: Session):
    """Creates a new announcement"""

    # get current semester_id
    semester_id = get_app_config(db).current_semester_id

    # get current user
    current_user = 1

    # datetime logic
    expires_at = format_expired_time(
        announcement.expiration_date, announcement.expiration_time
    )

    new = Announcement(
        content=announcement.content,
        expires_at=expires_at,
        pinned=announcement.pinned,
        created_by=current_user,
    )

    db.add(new)
    db.commit()
    db.refresh(new)


def get_announcements(db: Session):
    """Retrieves all active announcements with relative creation times"""

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


def get_announcement(announcement_id, db: Session):
    """Retrieves an announcement's details by its id"""

    announcement = db.scalar(
        select(Announcement).where(Announcement.id == announcement_id)
    )

    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    expires_at = announcement.expires_at.astimezone(LOCAL_TZ)

    expiration_date = expires_at.strftime("%m-%d-%Y")
    expiration_time = expires_at.strftime("%I:%M %p")

    return {
        "id": announcement.id,
        "content": announcement.content,
        "expiration_date": expiration_date,
        "expiration_time": expiration_time,
        "pinned": announcement.pinned,
    }


# full update
def update_announcement(announcement_id, update, db: Session):
    """Updates an announcement's content, expiration, and pinned status"""

    announcement = db.scalar(
        select(Announcement).where(Announcement.id == announcement_id)
    )

    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    expires_at = format_expired_time(update.expiration_date, update.expiration_time)

    announcement.content = update.content
    announcement.expires_at = expires_at
    announcement.pinned = update.pinned

    db.commit()


def update_pin(announcement_id, update, db: Session):
    """Updates an announcement's pinned status"""

    announcement = db.scalar(
        select(Announcement).where(Announcement.id == announcement_id)
    )

    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    announcement.pinned = update.pinned
    db.commit()


def remove_announcement(announcement_id, db: Session):
    """Expires an announcement by setting its expiration time to the past"""

    minutes_before = 3

    announcement = db.scalar(
        select(Announcement).where(Announcement.id == announcement_id)
    )

    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    announcement.expires_at = datetime.now(timezone.utc) - timedelta(
        minutes=minutes_before
    )
    db.commit()
