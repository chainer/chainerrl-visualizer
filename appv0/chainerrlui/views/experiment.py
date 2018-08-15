from flask.views import MethodView
from flask import jsonify, request


class ExperimentAPI(MethodView):
    def get(self, project_id=None, id=None):
        return jsonify({
            'experiment': {
                project_id: project_id,
                id: id,
            }
        })

    def post(selfs, project_id=None, id=None):
        result_path = request.args.get('result_path')
        model_name = request.args.get('model_name')
        seed = request.args.get('seed')

        return jsonify({
            'experiment': {
                project_id: project_id,
                id: id,
            },
            'info': {
                result_path: result_path,
                model_name: model_name,
                seed: seed,
            }
        })
