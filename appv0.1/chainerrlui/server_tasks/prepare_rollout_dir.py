from flask import current_app
import os

from chainerrlui.utils import generate_timestamp


def prepare_rollout_dir():
    log_root_dir = current_app.log_dir
    rollouts_root_dir = os.path.join(log_root_dir, 'rollouts')

    if not os.path.isdir(rollouts_root_dir):
        os.makedirs(rollouts_root_dir)

    rollout_dir = os.path.join(rollouts_root_dir, generate_timestamp())
    images_dir = os.path.join(rollout_dir, 'images')

    os.makedirs(rollout_dir)
    os.makedirs(images_dir)

    rollout_dir = os.path.join(os.getcwd(), rollout_dir)

    return rollout_dir

