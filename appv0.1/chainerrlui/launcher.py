import os
from multiprocessing import Process, Queue, Value
from ctypes import c_bool
import signal
from chainerrl.agent import Agent

from chainerrlui.web_server import web_server
from chainerrlui.job_worker import job_worker


def launch_visualizer(agent, gymlike_env, log_dir='log_space', host='localhost', port=5002, debug=False):
    assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'

    assert hasattr(gymlike_env, 'render'), 'Env object must have `render` method'
    assert hasattr(gymlike_env, 'reset'), 'Env object must have `reset` method'
    assert hasattr(gymlike_env, 'step'), 'Env object must have `step` method'

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

    if not os.path.isdir(log_dir):
        os.makedirs(log_dir)

    job_queue = Queue()
    is_job_running = Value(c_bool, False)
    is_rollout_on_memory = Value(c_bool, False)

    server_process = Process(target=web_server, args=(
        agent, gymlike_env, log_dir, host, port, debug, job_queue, is_job_running, is_rollout_on_memory))
    worker_process = Process(target=job_worker,
                             args=(agent, gymlike_env, job_queue, is_job_running, is_rollout_on_memory))

    server_process.start()
    worker_process.start()

    try:
        server_process.join()
        worker_process.join()
    except(KeyboardInterrupt, SystemExit):
        os.kill(worker_process.pid, signal.SIGTERM)
        os.kill(server_process.pid, signal.SIGTERM)
