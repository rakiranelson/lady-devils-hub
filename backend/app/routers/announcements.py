from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from fastapi import APIRouter, Depends, status

from app.db.connection import get_db
from sqlalchemy.orm import Session

from app.services.service_announcements import *


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


class AnnouncementEditResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True)

    id: int
    content: str
    expiration_date: str
    expiration_time: str
    pinned: bool


class PinUpdate(BaseModel):
    pinned: bool


router = APIRouter(prefix="/announcements", tags=["announcements"])


@router.post("/", status_code=status.HTTP_204_NO_CONTENT)
def create_announcement_endpoint(
    announcement: AnnouncementCreate, db: Session = Depends(get_db)
):
    return create_announcement(announcement, db)


@router.get("/", response_model=list[AnnouncementResponse])
def get_announcements_endpoint(db: Session = Depends(get_db)):
    return get_announcements(db)


@router.get("/{announcement_id}", response_model=AnnouncementEditResponse)
def get_announcement_endpoint(announcement_id: int, db: Session = Depends(get_db)):
    return get_announcement(announcement_id, db)


@router.patch("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_announcement_endpoint(
    announcement_id: int, update: AnnouncementCreate, db: Session = Depends(get_db)
):
    return update_announcement(announcement_id, update, db)


@router.patch("/{announcement_id}/pin", status_code=status.HTTP_204_NO_CONTENT)
def update_pin_endpoint(
    announcement_id: int, update: PinUpdate, db: Session = Depends(get_db)
):
    return update_pin(announcement_id, update, db)


@router.patch("/{announcement_id}/remove", status_code=status.HTTP_204_NO_CONTENT)
def remove_announcement_endpoint(announcement_id: int, db: Session = Depends(get_db)):
    return remove_announcement(announcement_id, db)
