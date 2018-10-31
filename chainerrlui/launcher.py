import os
from multiprocessing import Process, Queue, Value
from ctypes import c_bool
import signal
import webbrowser
import numpy as np
import chainer
import chainerrl
from chainerrl.agent import Agent

from chainerrlui.web_server import web_server
from chainerrlui.job_worker import job_worker


def launch_visualizer(agent, gymlike_env, log_dir='log_space', host='localhost', port=5002, action_meanings={}):
    assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'

    assert hasattr(gymlike_env, 'render'), 'Env object must have `render` method'
    assert hasattr(gymlike_env, 'reset'), 'Env object must have `reset` method'
    assert hasattr(gymlike_env, 'step'), 'Env object must have `step` method'

    # TODO: When other agents supported, change this validation.
    if not type(agent).__name__ in ['CategoricalDQN', 'A3C', 'PPO']:
        raise Exception(
            '\033[93m' + 'For now, only `CategoricalDQN`, `A3C` and `PPO` agents are supported . Please wait support'
                         'for other agents or feel free to contribute to development of this library!' + '\033[0m')

    """
    if os.path.isdir(os.path.join(os.getcwd(), log_dir)):
        reply = str(input('Directory `{}` is already exists. Do you use this directory for log output? (y/n) '.format(
            log_dir))).lower().strip()

        if not reply == 'y':
            return EmptyServer()
    else:
        os.makedirs(log_dir)
    """

    os.environ['OBJC_DISABLE_INITIALIZE_FORK_SAFETY'] = 'YES'

    log_dir = os.path.join(os.getcwd(), log_dir)
    rollouts_dir = os.path.join(log_dir, 'rollouts')

    if not os.path.isdir(log_dir):
        os.makedirs(log_dir)

    if not os.path.isdir(rollouts_dir):
        os.makedirs(rollouts_dir)

    profile = inspect_agent(agent, gymlike_env)

    job_queue = Queue()
    is_job_running = Value(c_bool, False)
    is_rollout_on_memory = Value(c_bool, False)

    server_process = Process(target=web_server, args=(
        agent, gymlike_env, profile, log_dir, host, port, action_meanings, job_queue, is_job_running,
        is_rollout_on_memory))
    worker_process = Process(target=job_worker,
                             args=(agent, gymlike_env, job_queue, is_job_running, is_rollout_on_memory))

    server_process.start()
    worker_process.start()

    webbrowser.open_new_tab('http://{}:{}'.format(host, port))

    try:
        server_process.join()
        worker_process.join()
    except(KeyboardInterrupt, SystemExit):
        os.kill(worker_process.pid, signal.SIGTERM)
        os.kill(server_process.pid, signal.SIGTERM)


# Create and return dict contains agent profile
def inspect_agent(agent, gymlike_env):
    profile = {
        'contains_recurrent_model': False,
        'state_value_returned': False,
        'distribution_type': None,
        'action_value_type': None,
    }
    model = agent.model
    obs = gymlike_env.reset()

    # workaround
    if hasattr(agent, 'xp'):
        xp = agent.xp
    else:
        xp = np

    if isinstance(model, chainerrl.recurrent.RecurrentChainMixin):
        profile['contains_recurrent_model'] = True
        with model.state_kept():
            outputs = model(agent.batch_states([obs], xp, agent.phi))
    else:
        outputs = model(agent.batch_states([obs], xp, agent.phi))

    if not isinstance(outputs, tuple):
        outputs = tuple((outputs,))

    for output in outputs:
        if isinstance(output, chainer.Variable):  # state value returned as chainer.Variable
            profile['state_value_returned'] = True

        if isinstance(output, chainerrl.distribution.Distribution):
            profile['distribution_type'] = type(output).__name__

        if isinstance(output, chainerrl.action_value.ActionValue):
            profile['action_value_type'] = type(output).__name__

    return profile
