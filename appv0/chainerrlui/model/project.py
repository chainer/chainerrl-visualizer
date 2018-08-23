from sqlalchemy import Column, Integer, String, DateTime
import datetime

from chainerrlui import DB_BASE, DB_SESSION


class Project(DB_BASE):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    name = Column(String(512))
    path = Column(String(512), unique=True)
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, default=datetime.datetime.now())

    def __init__(self, name=None, path=None):
        self.name = name
        self.path = path

    def __repr__(self):
        return "<Project id: {%d}, name: {%s}, path: {%s} />".format(self.id, self.name, self.path)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
        }

    @classmethod
    def create(cls, name=None, path=None):
        project = cls(name, path)

        DB_SESSION.add(project)
        DB_SESSION.commit()

        return project
