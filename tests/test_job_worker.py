from contextlib import contextmanager
from mock import MagicMock
from mock import patch
from multiprocessing.managers import ListProxy
import os

from chainerrl_visualizer import job_worker


@contextmanager
def change_loop_count(limit=1):
    default_limit = job_worker._WORKER_LOOP_LIMIT
    try:
        job_worker._WORKER_LOOP_LIMIT = limit
        yield
    finally:
        job_worker._WORKER_LOOP_LIMIT = default_limit


def test_job_workder(tmpdir):
    agent, gymlike_env, profile, job_queue = MagicMock(), MagicMock(), MagicMock(), MagicMock()
    is_job_running, is_rollout_on_memory = MagicMock(), MagicMock()

    ipc_msgs = (
        {
            'type': 'ROLLOUT',
            'data': {
                'rollout_dir': tmpdir,
                'rollout_id': 1,
                'step_count': 1,
            },
        }, {
            'type': 'SALIENCY',
            'data': {
                'rollout_dir': tmpdir,
                'rollout_id': 0,
                'from_step': 1,
                'to_step': 10,
                'intensity': {},
            },
        }, {
            'type': 'SALIENCY',
            'data': {
                'rollout_dir': tmpdir,
                'rollout_id': 1,
                'from_step': 11,
                'to_step': 20,
                'intensity': {},
            },
        }
    )
    job_queue.get = MagicMock(side_effect=ipc_msgs)

    # see test_launcher.py::test_launch_visualizer
    rollout_called_touch = os.path.join(tmpdir, 'rollout_called.log')
    saliency_called_touch = os.path.join(tmpdir, 'saliency_called.log')

    def assert_rollout_called(*args):
        assert len(args) == 6
        assert id(args[0]) == id(agent)
        assert id(args[1]) == id(gymlike_env)
        assert args[2] == ipc_msgs[0]['data']['rollout_dir']
        assert args[3] == ipc_msgs[0]['data']['step_count']
        assert isinstance(args[4], ListProxy)
        assert isinstance(args[5], ListProxy)
        open(rollout_called_touch, 'w').close()

    rollout = MagicMock(side_effect=assert_rollout_called)

    def assert_saliency_called(*args):
        assert len(args) == 8
        assert id(args[0]) == id(agent)
        assert id(args[1]) == id(profile)
        assert args[2] == ipc_msgs[2]['data']['rollout_dir']
        assert args[3] == ipc_msgs[2]['data']['from_step']
        assert args[4] == ipc_msgs[2]['data']['to_step']
        assert args[5] == ipc_msgs[2]['data']['intensity']
        assert isinstance(args[6], ListProxy)
        assert isinstance(args[7], ListProxy)
        open(saliency_called_touch, 'w').close()

    saliency = MagicMock(side_effect=assert_saliency_called)

    with change_loop_count(limit=3):
        with patch('chainerrl_visualizer.job_worker.rollout', rollout), \
                patch('chainerrl_visualizer.job_worker.create_and_save_saliency_images', saliency):
            job_worker.job_worker(
                agent, gymlike_env, profile, job_queue, is_job_running, is_rollout_on_memory)
        assert is_rollout_on_memory.value
        assert not is_job_running.value
        assert os.path.exists(rollout_called_touch)
        assert os.path.exists(saliency_called_touch)
