from flask.views import MethodView
from flask import jsonify, request
import os
import json

from chainerrlui.tasks.rollout import rollout
from chainerrlui.tasks.search_and_create_experiments import search_and_create_experiments
from chainerrlui.model.project import Project
from chainerrlui.model.experiment import Experiment
from chainerrlui import DB_SESSION


class ExperimentAPI(MethodView):
    def get(self, project_id=None, id=None):
        if id is None:
            project = DB_SESSION.query(Project).filter_by(id=project_id).first()
            search_and_create_experiments(project)
            experiments = DB_SESSION.query(Experiment).filter_by(project_id=project.id).all()

            return jsonify({
                "experiments": [experiment.serialize for experiment in experiments]
            })
        else:
            experiment = DB_SESSION.query(Experiment).filter_by(id=id).first()
            exp_dict = experiment.serialize
            del exp_dict["log"]
            return jsonify(exp_dict)

        """ code for `Get Log` command
        result_path = request.args.get('result_path')

        if result_path is not None:
            log_file = os.path.join(result_path, 'rollout', 'log')
            with open(log_file) as f:
                log_data = json.load(f)

            return jsonify({
                'log': log_data,
            })

        return jsonify({
            'experiment': {
                'project_id': project_id,
                'id': id,
            }
        })
        """

    def post(self, project_id=None, id=None):
        data = request.get_json()

        result_path = data['result_path']
        model_name = data['model_name']
        seed = data['seed']

        rollout(result_path, model_name, seed)

        return jsonify({
            'experiment': {
                'project_id': project_id,
                'id': id,
            },
            'info': request.get_json(),
        })
