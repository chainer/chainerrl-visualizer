from flask import current_app
import os

from chainerrlui.utils import generate_timestamp
from chainerrlui.jobs import throw_rollout_job


def _prepare_rollout_dir():
    log_root_dir = current_app.log_dir
    rollouts_root_dir = os.path.join(log_root_dir, 'rollouts')

    if not os.path.isdir(rollouts_root_dir):
        os.makedirs(rollouts_root_dir)

    rollout_dir = os.path.join(rollouts_root_dir, generate_timestamp())
    images_dir = os.path.join(rollout_dir, 'images')

    os.makedirs(rollout_dir)
    os.makedirs(images_dir)

    return rollout_dir


def start_rollout():
    # TODO: Check there is rollout job is now running. If exists, return None.
    # return None

    rollout_dir = _prepare_rollout_dir()

    # Threadオブジェクトを作成し, rollout_<timestamp>をjob_id(key), jobのオブジェクトをvalueとした
    # グローバルなdictionaryにつっこむ.
    #
    # agent_clone = copy.deepcopy(current_app.agent)  # agent internal state may change during rollout
    throw_rollout_job(rollout_dir)

    return rollout_dir
