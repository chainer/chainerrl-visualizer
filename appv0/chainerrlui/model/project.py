from sqlalchemy import Column, Integer, String, DateTime
import datetime

from chainerrlui import DB_BASE, DB_SESSION


class Project(DB_BASE):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    name = Column(String(512))
    path = Column(String(512), unique=True)
    agent_class = Column(String(512))
    env_name = Column(String(512))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, default=datetime.datetime.now())

    def __init__(self, name=None, path=None, agent_class=None, env_name=None):
        self.name = name
        self.path = path
        self.agent_class = agent_class
        self.env_name = env_name

    def __repr__(self):
        return "<Project id: {%d}, name: {%s}, path: {%s} />".format(self.id, self.name, self.path)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "agent_class": self.agent_class,
            "env_name": self.env_name,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def create(cls, name=None, path=None, agent_class=None, env_name=None):
        project = cls(name, path, agent_class, env_name)

        DB_SESSION.add(project)
        DB_SESSION.commit()

        return project
