from flask.views import MethodView
from flask import jsonify

from chainerrlui.server_tasks import prepare_rollout_dir
from chainerrlui.job_dispatchers import dispatch_rollout_job


class RolloutAPI(MethodView):
    def post(self):
        rollout_path = prepare_rollout_dir()

        dispatch_rollout_job(rollout_path)

        return jsonify({
            'rollout_path': rollout_path,
        })
