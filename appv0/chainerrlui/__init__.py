import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

CHAINERRLUI_ENV = os.getenv("CHAINERRLUI_ENV", "production")
CHAINERRLUI_ROOT = os.path.abspath(os.path.expanduser(os.getenv("CHAINERRLUI_ROOT", "~/.chainerrlui")))
PACKAGE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(CHAINERRLUI_ROOT, "db")
DB_FILE_NAME = "chainerrlui_test.db" if CHAINERRLUI_ENV == "test" else "chainerrlui.db"
DB_FILE_PATH = os.path.join(DB_DIR, DB_FILE_NAME)
SQLALCHEMY_DB_URI = "sqlite:///" + DB_FILE_PATH

DB_ENGINE = create_engine(
    SQLALCHEMY_DB_URI,
    convert_unicode=True,
    connect_args={"check_same_thread": False},
    echo=(CHAINERRLUI_ENV == "development"),
)

DB_BASE = declarative_base()

DB_SESSION = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=DB_ENGINE)
)
