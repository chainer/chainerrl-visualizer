from flask import current_app
import os

from chainerrl_visualizer.utils import generate_timestamp


def prepare_rollout_dir():
    rollouts_root_dir = os.path.join(current_app.log_dir, 'rollouts')

    rollout_dir = os.path.join(rollouts_root_dir, generate_timestamp())
    images_dir = os.path.join(rollout_dir, 'images')

    os.makedirs(rollout_dir)
    os.makedirs(images_dir)

    rollout_dir = os.path.join(os.getcwd(), rollout_dir)

    return rollout_dir
