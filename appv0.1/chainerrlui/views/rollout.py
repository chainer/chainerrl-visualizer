import os
from flask.views import MethodView
from flask import jsonify, current_app

from chainerrlui.server_tasks import prepare_rollout_dir, parse_rollout_log, rollout_log_last_updated, get_rollout_ids
from chainerrlui.utils.jsonize_datetime import jsonize_datetime
from chainerrlui.job_dispatchers import dispatch_rollout_job


class RolloutAPI(MethodView):
    def get(self, rollout_id=None):
        if rollout_id is not None:
            rollout_path = os.path.join(current_app.log_dir, 'rollouts', rollout_id)

            rollout_log = parse_rollout_log(rollout_path)
            last_updated_datetime = rollout_log_last_updated(rollout_path)

            return jsonify({
                'rollout_log': rollout_log,
                'last_updated': jsonize_datetime(last_updated_datetime),
            })

        rollout_ids = get_rollout_ids()

        return jsonify({
            'rollout_ids': rollout_ids,
        })

    def post(self):
        rollout_path = prepare_rollout_dir()

        dispatch_rollout_job(rollout_path)

        return jsonify({
            'rollout_path': rollout_path,
        })
