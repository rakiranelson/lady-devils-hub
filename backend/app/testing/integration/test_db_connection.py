from app.models.app_config import get_app_config


def test_get_app_config(db_session):
    config = get_app_config(db_session)
    assert config is not None, "testing/setup_test_db must successfully set up test db"
    assert config.current.semester == "fall", "current semester must be 'fall'"
    assert config.current.term_year == 2026, "current term year must be 2026"
