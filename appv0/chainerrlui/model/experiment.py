from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
import datetime
import os
import jsonlines

from chainerrlui import DB_SESSION, DB_BASE


class Experiment(DB_BASE):
    __tablename__ = "experiment"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("project.id"))
    name = Column(String(512))
    path = Column(String(512))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, default=datetime.datetime.now())

    def __init__(self, project_id, name, path):
        self.project_id = project_id
        self.name = name
        self.path = path

    def __repr__(self):
        return "<Experiment id: {}, name: {}, path: {}>".format(self.id, self.name, self.path)

    @property
    def serialize(self):
        experiment = {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "log": [],
            "command": "",
            "args": {},
            "environ": {},
            "agents": [],
            "envs": [],
        }

        log_file_name = os.path.join(self.path, "log.jsonl")
        command_file_name = os.path.join(self.path, "command.txt")
        args_file_name = os.path.join(self.path, "args.jsonl")
        environ_file_name = os.path.join(self.path, "environ.jsonl")

        if os.path.isfile(log_file_name):
            with jsonlines.open(log_file_name) as reader:
                for obj in reader:
                    experiment["log"].append(obj)

        if os.path.isfile(command_file_name):
            with open(command_file_name) as f:
                experiment["command"] = f.readline()

        if os.path.isfile(args_file_name):
            with jsonlines.open(args_file_name) as reader:
                for obj in reader:
                    experiment["args"] = obj

        if os.path.isfile(environ_file_name):
            with jsonlines.open(environ_file_name) as reader:
                for obj in reader:
                    experiment["environ"] = obj

        """
        for env_dill in os.listdir(os.path.join(self.path, "envs")):
            experiment["envs"].append({
                "path": os.path.join(self.path, 'envs', env_dill),
                "name": env_dill,
            })

        for agent_dill in os.listdir(os.path.join(self.path, "agents")):
            experiment["agents"].append({
                "path": os.path.join(self.path, "agents", agent_dill),
                "name": agent_dill,
            })
        """

        return experiment

    @classmethod
    def create(cls, name=None, path=None):
        experiment = cls(name, path)

        DB_SESSION.add(experiment)
        DB_SESSION.commit()

        return experiment
