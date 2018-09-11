import os
from datetime import datetime
from flask import current_app

timestamp_format = '%Y%m%dT%H%M%S.%f'


def get_rollout_ids():
    rollouts_path = os.path.join(current_app.log_dir, 'rollouts')
    return os.listdir(rollouts_path)


def get_latest_rollout_info():
    rollout_ids = get_rollout_ids()

    if len(rollout_ids) == 0:
        return None, None

    latest = datetime.strptime(rollout_ids[0], timestamp_format)
    for rollout_id in rollout_ids[1:]:
        now = datetime.strptime(rollout_id, timestamp_format)
        if now > latest:
            latest = now

    latest_rollout_id = latest.strftime(timestamp_format)

    return latest_rollout_id, os.path.join(current_app.log_dir, 'rollouts', latest_rollout_id)
