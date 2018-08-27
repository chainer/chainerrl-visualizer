import os
import numpy as np
from flask.views import MethodView
from flask import jsonify, request

from chainerrlui import DB_SESSION
from chainerrlui.model.experiment import Experiment
from chainerrlui.tasks.rollout import rollout


class RolloutAPI(MethodView):
    def post(self, experiment_id=None):
        data = request.get_json()
        env_name = data["env_name"]
        agent_class = data["agent_class"]
        seed = data["seed"]

        experiment = DB_SESSION.query(Experiment).filter_by(id=experiment_id).first()

        rollout_dir = rollout(experiment, env_name, agent_class, seed)

        return jsonify({
            "rollout_dir": rollout_dir,
        })
