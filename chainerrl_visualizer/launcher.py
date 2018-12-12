import os
from multiprocessing import Process, Queue, Value
from ctypes import c_bool
import signal
import webbrowser
import numpy as np
import chainer
import chainerrl
from chainerrl.agent import Agent

from chainerrl_visualizer.web_server import web_server
from chainerrl_visualizer.job_worker import job_worker
from chainerrl_visualizer.config import SUPPORTED_ACTION_VALUES, SUPPORTED_DISTRIBUTIONS
import gym


def launch_visualizer(agent, gymlike_env, action_meanings, log_dir='log_space',
                      port=5002, raw_image_input=False, debug=False, contains_rnn=False):
    assert issubclass(type(agent), Agent), 'Agent object has to be ' \
                                           'subclass of chainerrl.agent.Agent'

    assert hasattr(gymlike_env, 'render'), 'Env object must have `render` method'
    assert hasattr(gymlike_env, 'reset'), 'Env object must have `reset` method'
    assert hasattr(gymlike_env, 'step'), 'Env object must have `step` method'

    validate_action_meanings(action_meanings)

    host = 'localhost'  # this app is assumed to run only on localhost

    log_dir = os.path.join(os.getcwd(), log_dir)
    if not prepare_log_directory(log_dir):
        return

    if isinstance(gymlike_env, gym.Env):
        modify_gym_env_render(gymlike_env)

    profile = inspect_agent(agent, gymlike_env, contains_rnn)

    job_queue = Queue()
    is_job_running = Value(c_bool, False)
    is_rollout_on_memory = Value(c_bool, False)

    server_process = Process(target=web_server, args=(
        agent, gymlike_env, profile, log_dir, host, port, action_meanings,
        raw_image_input, job_queue, is_job_running, is_rollout_on_memory, debug))

    worker_process = Process(target=job_worker, args=(
        agent, gymlike_env, profile, job_queue, is_job_running, is_rollout_on_memory))

    server_process.start()
    worker_process.start()

    webbrowser.open_new_tab('http://{}:{}'.format(host, port))

    try:
        server_process.join()
        worker_process.join()
    except(KeyboardInterrupt, SystemExit):
        os.kill(worker_process.pid, signal.SIGTERM)
        os.kill(server_process.pid, signal.SIGTERM)


def validate_action_meanings(action_meanings):
    if type(action_meanings) is not dict:
        raise Exception('`action_meanings` has to be dictionary.')

    if not len(action_meanings) > 0:
        raise Exception('The number of entries in `action_meanings` is invalid')

    if list(action_meanings.keys()) != list(range(len(action_meanings))):
        raise Exception('Invalid key index in `action_meanings. '
                        'See README for how to write valid `action_meanings` dictionary.')


def modify_gym_env_render(gym_env):
    old_render = gym_env.render

    def render():
        return old_render(mode='rgb_array')

    gym_env.render = render


def prepare_log_directory(log_dir):  # log_dir is assumed to be full path
    if os.path.isdir(log_dir):
        reply = str(input('\u001b[32m Directory `{}` is already exists. Do you use this directory '
                          'for log output? (y/n) \u001b[0m'.format(log_dir))).lower().strip()

        if not reply == 'y':
            return False
    else:
        os.makedirs(log_dir)

    rollouts_dir = os.path.join(log_dir, 'rollouts')

    if not os.path.isdir(rollouts_dir):
        os.makedirs(rollouts_dir)

    return True


# Create and return dict contains agent profile
def inspect_agent(agent, gymlike_env, contains_rnn):
    profile = {
        'contains_recurrent_model': contains_rnn,
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
        with model.state_kept():
            outputs = model(agent.batch_states([obs], xp, agent.phi))
    else:
        outputs = model(agent.batch_states([obs], xp, agent.phi))

    if not isinstance(outputs, tuple):
        outputs = tuple((outputs,))

    for output in outputs:
        # state value returned as chainer.Variable
        if isinstance(output, chainer.Variable):
            profile['state_value_returned'] = True
            continue

        if isinstance(output, chainerrl.distribution.Distribution):
            profile['distribution_type'] = type(output).__name__
            continue

        if isinstance(output, chainerrl.action_value.ActionValue):
            profile['action_value_type'] = type(output).__name__
            continue

        raise Exception(
            'Model output type of {} is not supported for now'.format(type(output).__name__))

    # Validations
    if profile['distribution_type'] is None and profile['action_value_type'] is None:
        raise Exception('Outputs of model do not contain ActionValue nor DistributionType')

    if profile['action_value_type'] is not None \
            and profile['action_value_type'] not in SUPPORTED_ACTION_VALUES:
        raise Exception('ActionValue type {} is not supported for now'.format(
            profile['action_value_type']))

    if profile['distribution_type'] is not None \
            and profile['distribution_type'] not in SUPPORTED_DISTRIBUTIONS:
        raise Exception('Distribution type {} is not supported for now'.format(
            profile['distribution_type']))

    return profile
