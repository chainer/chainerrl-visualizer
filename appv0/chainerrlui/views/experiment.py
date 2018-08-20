from flask.views import MethodView
from flask import jsonify, request
import os
import json

from chainerrlui.tasks.rollout import rollout


class ExperimentAPI(MethodView):
    def get(self, project_id=None, id=None):
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
