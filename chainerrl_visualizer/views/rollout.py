import os
from flask.views import MethodView
from flask import jsonify, current_app, request

from chainerrl_visualizer.server_tasks import (
    prepare_rollout_dir, parse_rollout_log, rollout_log_last_updated,
    get_rollout_ids, get_latest_rollout_info)
from chainerrl_visualizer.utils.jsonize_datetime import jsonize_datetime
from chainerrl_visualizer.job_dispatchers import dispatch_rollout_job

ROLLOUT_LOGFILE_NAME = 'rollout_log.jsonl'


class RolloutAPI(MethodView):
    def get(self, rollout_id=None):
        if rollout_id is not None:
            rollout_path = os.path.join(current_app.log_dir, 'rollouts', rollout_id)

            if not os.path.isfile(os.path.join(rollout_path, ROLLOUT_LOGFILE_NAME)):
                return jsonify({
                    'rollout_log': [],
                    'last_updated': None,
                })

            rollout_log = parse_rollout_log(rollout_path)
            last_updated_datetime = rollout_log_last_updated(rollout_path)

            return jsonify({
                'rollout_log': rollout_log,
                'last_updated': jsonize_datetime(last_updated_datetime),
            })

        if request.args.get('q') == 'latest':
            latest_rollout_id, latest_rollout_path = get_latest_rollout_info()

            if latest_rollout_id is None:
                return jsonify({
                    'rollout_id': '',
                    'rollout_path': '',
                })

            return jsonify({
                'rollout_id': latest_rollout_id,
                'rollout_path': latest_rollout_path,
            })

        rollout_ids = get_rollout_ids()

        return jsonify({
            'rollout_ids': rollout_ids,
        })

    def post(self):
        if current_app.is_job_running.value:
            return jsonify({
                'rollout_path': '',
                'is_rollout_started': False,
            })

        data = request.get_json()
        step_count = int(data['step_count'])

        rollout_path = prepare_rollout_dir()
        dispatch_rollout_job(rollout_path, step_count)

        return jsonify({
            'rollout_path': rollout_path,
            'is_rollout_started': True,
        })
