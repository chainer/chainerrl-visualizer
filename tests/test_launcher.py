from contextlib import contextmanager
from mock import MagicMock
from mock import patch
import os

import chainer
from chainerrl.agents import a3c
import chainerrl.distribution
import gym
import numpy
import pytest

from chainerrl_visualizer import launch_visualizer
import chainerrl_visualizer.launcher as launcher


@contextmanager
def change_execution_dir(path):
    cwd = os.getcwd()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(cwd)


# argument must be a subclass of Agent, using A3c is no particular meaning.
class MockAgent(MagicMock, a3c.A3C):
    def __init__(self, *args, **kwargs):
        super(MagicMock, self).__init__(*args, **kwargs)


@pytest.mark.parametrize('outs', [
    (
        chainer.Variable(numpy.zeros(1).reshape(1, 1)),
        chainerrl.distribution.SoftmaxDistribution(chainer.Variable(numpy.zeros(2).reshape(1, 2)))
    ), (
        chainerrl.action_value.DiscreteActionValue(chainer.Variable(numpy.ones(2).reshape(1, 2)))
    )
])
def test_launch_visualizer(tmpdir, outs):
    agent = MockAgent()
    agent.model = MagicMock(side_effect=lambda *args: outs)
    gymlike_env = MagicMock(spec=gym.Env)

    # This assertion checks the instances is called correctly.
    # In the target luncher function, the instance is called from forked process internally,
    # So cannot use `assert_called` and shared values.
    # It's not smart, and address with touch file to check called or not.
    websrv_called_touch = os.path.join(tmpdir, 'websrv_called.log')
    worker_called_touch = os.path.join(tmpdir, 'worker_called.log')

    def assert_server_called(*args):
        assert len(args) == 12
        assert id(args[0]) == id(agent)
        assert id(args[1]) == id(gymlike_env)
        open(websrv_called_touch, 'w').close()

    web_server = MagicMock(side_effect=assert_server_called)

    def assert_worker_called(*args):
        assert len(args) == 6
        assert id(args[0]) == id(agent)
        assert id(args[1]) == id(gymlike_env)
        open(worker_called_touch, 'w'). close()

    job_worker = MagicMock(side_effect=assert_worker_called)

    webbrowser = MagicMock()
    webbrowser.open_new_tab = MagicMock()

    with change_execution_dir(tmpdir):
        with patch('chainerrl_visualizer.launcher.modify_gym_env_render') as modify_gymenv, \
                patch('chainerrl_visualizer.launcher.web_server', web_server), \
                patch('chainerrl_visualizer.launcher.job_worker', job_worker), \
                patch('chainerrl_visualizer.launcher.webbrowser', webbrowser):
            launch_visualizer(agent, gymlike_env)
            modify_gymenv.assert_called_once()
            assert os.path.exists(websrv_called_touch)
            assert os.path.exists(worker_called_touch)


def test_launch_visualizer_canceled(tmpdir):
    agent = MockAgent()
    gymlike_env = MagicMock()
    os.makedirs(os.path.join(tmpdir, 'log_space'))
    with change_execution_dir(tmpdir):
        with patch('chainerrl_visualizer.launcher.input', side_effect='n'), \
                patch('chainerrl_visualizer.launcher.inspect_agent') as inspect_agent:
            launch_visualizer(agent, gymlike_env)
            inspect_agent.assert_not_called()


def test_modify_gym_env_render():
    gym_env, render = MagicMock(), MagicMock()
    gym_env.render = render
    launcher.modify_gym_env_render(gym_env)

    gym_env.render()
    render.assert_called_once_with(mode='rgb_array')


@pytest.mark.parametrize(
    'input,expected', [('y', True), ('Y', True), ('n', False), ('N', False), ('x', False)])
def test_prepare_log_directory_existed(tmpdir, input, expected):
    log_dir = os.path.join(tmpdir, 'log_space', 'rollouts')
    os.makedirs(log_dir)
    with patch('chainerrl_visualizer.launcher.input', side_effect=input):
        prepared = launcher.prepare_log_directory(log_dir)
    assert prepared == expected


class UnsupportedDistribution(chainerrl.distribution.SoftmaxDistribution):
    def __init__(self):
        pass


class UnsupportedActionValue(chainerrl.action_value.DiscreteActionValue):
    def __init__(self):
        pass


@pytest.mark.parametrize('outs,err_kw', [
    (numpy.zeros(1), 'Model output type of ndarray'),
    (chainer.Variable(numpy.zeros(1)), 'Outputs of model do not contain'),
    (UnsupportedDistribution(), 'Distribution type UnsupportedDistribution'),
    (UnsupportedActionValue(), 'ActionValue type UnsupportedActionValue')
])
def test_inspect_agent(outs, err_kw):
    agent = MagicMock()
    agent.model = MagicMock(side_effect=lambda *args: outs)
    gymlike_env = MagicMock()
    contains_rnn = MagicMock()

    with pytest.raises(Exception) as excinfo:
        launcher.inspect_agent(agent, gymlike_env, contains_rnn)
    assert err_kw in str(excinfo.value)


def test_inspect_agent_reccurrent_model():
    # in this test case, agent, model and outs are nonsense scheme
    # to check only error handling logic

    outs = chainerrl.action_value.DiscreteActionValue(chainer.Variable(numpy.ones(2).reshape(1, 2)))
    agent = MagicMock()
    # to check working the function if agent does not have 'xp' attribute
    # if process of agent check is more than one, this case should be separated into another one.
    delattr(agent, 'xp')
    agent.model = MagicMock(spec=chainerrl.recurrent.RecurrentChainMixin, return_value=outs)
    gymlike_env = MagicMock()
    contains_rnn = MagicMock()

    launcher.inspect_agent(agent, gymlike_env, contains_rnn)
