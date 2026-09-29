from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator, ConfigDict
from pathlib import Path


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool

    DATABASE_URL: str
    ALLOWED_ORIGINS: str

    SECRET_KEY: str = ""

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return v.split(",") if v else []

    model_config = ConfigDict(
        env_file=Path(__file__).parent.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
