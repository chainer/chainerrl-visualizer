from flask.views import MethodView
from flask import jsonify, request
import jsonlines


class RolloutLogAPI(MethodView):
    def get(self):
        log_path = request.args.get('path')

        with jsonlines.open(log_path) as reader:
            log = [obj for obj in reader]

        return jsonify({
            'log': log,
        })

