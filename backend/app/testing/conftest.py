import pytest

from app.config import settings
from main import app

from pathlib import Path
from sqlalchemy import text

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.db.connection import Base, get_db
from fastapi.testclient import TestClient

from app.models.user import User
from app.models.semester import Semester
from app.models.app_config import AppConfig

TEST_DATABASE_URL = settings.TEST_DATABASE_URL

engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # create the db schema
    schema_sql = Path(__file__).parent.parent.parent.parent / "db/schema.sql"

    with engine.connect() as conn:
        conn.execute(text(schema_sql.read_text()))
        conn.commit()

    session = TestingSessionLocal(bind=engine)

    # set up semesters
    seed_semesters = [
        Semester(semester="spring", term_year=2026),
        Semester(semester="fall", term_year=2026),
        Semester(semester="spring", term_year=2027),
    ]

    session.add_all(seed_semesters)
    session.commit()

    # set up app configurations
    fall_2026 = session.scalar(
        select(Semester).where(Semester.semester == "fall", Semester.term_year == 2026)
    )

    app_config = AppConfig(current_semester_id=fall_2026.id)
    session.add(app_config)
    session.commit()

    # set up seed user
    seed_user = User(
        firstname="Anita",
        lastname="Maxwynn",
        user_type="player",
        duke_email="test@example.com",
        is_admin=True,
    )
    session.add(seed_user)
    session.commit()

    session.close()

    yield

    # drop the db schema
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE;"))
        conn.execute(text("CREATE SCHEMA public;"))
        conn.commit()


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
