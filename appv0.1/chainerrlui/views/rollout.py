from flask.views import MethodView
from flask import jsonify, request

from chainerrlui.server_tasks import prepare_rollout_dir, parse_rollout_log
from chainerrlui.job_dispatchers import dispatch_rollout_job


class RolloutAPI(MethodView):
    def get(self):
        rollout_path = request.args.get('rollout_path')
        rollout_log = parse_rollout_log(rollout_path)

        return jsonify({
            'rollout_log': rollout_log,
        })

    def post(self):
        rollout_path = prepare_rollout_dir()

        dispatch_rollout_job(rollout_path)

        return jsonify({
            'rollout_path': rollout_path,
        })
