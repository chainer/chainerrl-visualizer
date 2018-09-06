import os
from flask import current_app


def get_rollout_ids():
    rollouts_path = os.path.join(current_app.log_dir, 'rollouts')
    return os.listdir(rollouts_path)
