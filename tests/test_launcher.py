from mock import MagicMock
from mock import patch
import os

import chainer
from chainerrl.agents import a3c
import chainerrl.distribution
import numpy
import pytest

from chainerrlui import launch_visualizer


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
    gymlike_env = MagicMock()

    # This assertion checks the instances is called correctly.
    # In the target luncher function, the instance is called from  forked process internally,
    # which process is created internally. So cannot use `assert_called` and shared values.
    # It's not smart, and address with touch file to check called or not.
    websrv_called_touch = os.path.join(tmpdir, 'websrv_called.log')
    worker_called_touch = os.path.join(tmpdir, 'worker_called.log')

    def assert_server_called(*args):
        assert len(args) == 11
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

    cwd = os.getcwd()
    try:
        os.chdir(tmpdir)
        with patch('chainerrlui.launcher.web_server', web_server), \
                patch('chainerrlui.launcher.job_worker', job_worker), \
                patch('chainerrlui.launcher.webbrowser', webbrowser):
            launch_visualizer(agent, gymlike_env)
            assert os.path.exists(websrv_called_touch)
            assert os.path.exists(worker_called_touch)
    finally:
        os.chdir(cwd)
