from flask.views import MethodView
from flask import jsonify, request

from chainerrlui.tasks.rollout import rollout

class ExperimentAPI(MethodView):
    def get(self, project_id=None, id=None):
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
