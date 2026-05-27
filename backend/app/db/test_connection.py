from app.db.connection import engine

with engine.connect() as conn:
    print("Database connected successfully!")
