from flask.views import MethodView
from flask import jsonify

from chainerrlui.tasks import start_rollout


class RolloutAPI(MethodView):
    def post(self):
        rollout_path = start_rollout()

        if rollout_path is None:
            # TODO: notify there is rollout running
            return 'hoge'
        else:
            return jsonify({
                'rollout_path': rollout_path,
            })
