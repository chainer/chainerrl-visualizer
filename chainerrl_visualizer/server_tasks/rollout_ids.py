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

    timestamps = [datetime.strptime(r_id, timestamp_format) for r_id in rollout_ids]
    # `rollout_ids[timestamps.index(max(timestamps))]` is safer but consumes O(n) time in `index()`,
    # to reduce the cost, apply re-converting datetime -> str
    latest_rollout_id = max(timestamps).strftime(timestamp_format)

    return latest_rollout_id, os.path.join(current_app.log_dir, 'rollouts', latest_rollout_id)
