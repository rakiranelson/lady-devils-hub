from datetime import datetime, timezone
from app.core.timezone import LOCAL_TZ


def format_expired_time(expiration_date, expiration_time):
    """Converts expired datetime into a string"""
    expires_at = datetime.strptime(
        f"{expiration_date} {expiration_time}",
        "%m-%d-%Y %I:%M %p",
    ).replace(tzinfo=LOCAL_TZ)

    return expires_at


def get_relative_time(dt: datetime):
    """Retrieves the relative time for an announcements creation"""
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
