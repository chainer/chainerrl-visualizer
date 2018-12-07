import os
from mock import MagicMock
import pytest
import chainer
import chainerrl
import numpy as np
import jsonlines

from chainerrl_visualizer.worker_jobs import rollout


ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


@pytest.mark.parametrize('test_case,model_outs,act_outs', [
    # A3C example
    #
    # SoftmaxDistribution:
    #   batch size: 1
    #   action dim: 4
    (
        'A3C',
        (
            chainer.Variable(np.zeros(1).reshape(1, 1)),
            chainerrl.distribution.SoftmaxDistribution(chainer.Variable(np.random.rand(1, 4))),
        ),
        2,  # always select index-2 action
    ),
    # PPO example
    #
    # GaussianDistribution:
    #   batch size: 1
    #   action dim: 4
    (
        'PPO',
        (
            chainer.Variable(np.zeros(1).reshape(1, 1)),
            chainerrl.distribution.GaussianDistribution(np.zeros((1, 4)), np.ones((1, 4))),
        ),
        np.random.rand(4),  # randomly select action for each dimension
    ),
    # CategoricalDQN example
    #
    # DistributionalDiscreteActionValue
    #   batch size: 1
    #   action dim: 4
    #   atoms num: 51
    #   value range: [-10, 10)
    (
        'CategoricalDQN',
        chainerrl.action_value.DistributionalDiscreteActionValue(
            chainer.Variable(np.random.dirichlet(alpha=np.ones(51), size=(1, 4))),
            np.linspace(-10, 10, num=51)),
        2,  # always select index-2 action
    ),
    # Unsupported modules
    #
    (
        'Unsupported',
        chainerrl.distribution.MellowmaxDistribution(chainer.Variable(np.zeros((1, 4)))),
        0,
    ),
    (
        'Unsupported',
        chainerrl.distribution.ContinuousDeterministicDistribution(
            chainer.Variable(np.zeros((1, 4)))),
        0,
    ),
    (
        'Unsupported',
        chainerrl.action_value.QuadraticActionValue(
            chainer.Variable(np.zeros((1, 4))), chainer.Variable(np.zeros((1, 4, 4))),
            chainer.Variable(np.zeros(0))),
        0,
    ),
    (
        'Unsupported',
        chainerrl.action_value.SingleActionValue(
            lambda *args: chainer.Variable(np.zeros(1)),
            lambda *args: chainer.Variable(np.zeros((1, 4)))),
        0,
    ),
])
def test_rollout(tmpdir, test_case, model_outs, act_outs):
    agent = MagicMock()
    agent.model = MagicMock(side_effect=lambda *args: model_outs)
    agent.act = MagicMock(side_effect=lambda *args: act_outs)
    agent.xp = np

    observation = np.zeros(300).reshape(10, 10, 3)
    rendered = np.uint8(observation)

    gymlike_env = MagicMock()
    gymlike_env.reset = MagicMock(side_effect=lambda *args: observation)
    gymlike_env.render = MagicMock(side_effect=lambda *args: rendered)
    gymlike_env.step = MagicMock(side_effect=lambda *args: (observation, 0.0, False, {}))

    rollout_dir = tmpdir  # use tmpdir as this rollout directory
    step_count = 15
    obs_list = MagicMock()
    render_img_list = MagicMock()

    os.makedirs(os.path.join(tmpdir, 'images'))

    if test_case == 'Unsupported':
        with pytest.raises(Exception):
            rollout(agent, gymlike_env, rollout_dir, step_count, obs_list, render_img_list)
            agent.stop_episode.assert_called_once()
        return

    rollout(agent, gymlike_env, rollout_dir, step_count, obs_list, render_img_list)
    agent.stop_episode.assert_called_once()

    with jsonlines.open('{}/{}'.format(tmpdir, ROLLOUT_LOG_FILE_NAME)) as reader:
        lines_num = 0
        for log_line in reader.iter(type=dict):
            lines_num += 1
        assert lines_num == 15

        # Common log entries for each test case
        assert 'step' in log_line
        assert 'reward' in log_line
        assert 'image_path' in log_line
        assert 'action' in log_line

        if test_case == 'A3C':
            assert 'state_value' in log_line
            assert len(log_line['action_probs']) == 4
        elif test_case == 'PPO':
            assert 'state_value' in log_line
            assert len(log_line['action_means']) == 4
            assert len(log_line['action_vars']) == 4
        elif test_case == 'CategoricalDQN':
            assert len(log_line['action_values']) == 4
            assert len(log_line['z_values']) == 51
            assert np.array(log_line['action_value_dist']).shape == (51, 4)
