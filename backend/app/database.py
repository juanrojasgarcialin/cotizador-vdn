"""
Configuración de SQLAlchemy.
- Desarrollo: SQLite (por defecto)
- Producción: PostgreSQL via DATABASE_URL env var
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./cotizador.db")

# Render usa "postgres://" pero SQLAlchemy requiere "postgresql://"
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

# SQLite necesita check_same_thread=False; PostgreSQL no acepta ese argumento
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
