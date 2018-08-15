from flask.views import MethodView
from flask import jsonify


class ExperimentAPI(MethodView):
    def get(self, project_id=None, id=None):
        return jsonify({
            'experiment': {
                project_id: project_id,
                id: id,
            }
        })
