import os
from multiprocessing import Process, Queue
import signal
import gevent
from gevent.pywsgi import WSGIServer
from chainerrl.agent import Agent

from chainerrlui.app import create_app
from chainerrlui.jobs import rollout


def launch_visualize(agent, gymlike_env, log_dir='log_space', host='localhost', port=5001, debug=False):
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

    if not os.path.isdir(os.path.join(os.getcwd(), log_dir)):
        os.makedirs(log_dir)

    job_queue = Queue()

    server_process = Process(target=start_server, args=(agent, gymlike_env, log_dir, host, port, debug, job_queue))
    worker_process = Process(target=start_worker, args=(agent, gymlike_env, job_queue))

    server_process.start()
    worker_process.start()

    try:
        server_process.join()
        worker_process.join()
    except(KeyboardInterrupt, SystemExit):
        os.kill(worker_process.pid, signal.SIGTERM)
        os.kill(server_process.pid, signal.SIGTERM)


def start_server(agent, gymlike_env, log_dir, host, port, debug, job_queue):
    app = create_app(agent, gymlike_env, log_dir, job_queue)

    if debug:
        app.config['ENV'] = 'development'
        app.run(host=host, port=port, debug=True, threaded=True)
    else:
        socket_address = '{}:{}'.format(host, port)
        server = WSGIServer(socket_address, application=app)

        def stop_server():
            if server.started:
                server.stop()

        gevent.signal(signal.SIGTERM, stop_server)
        gevent.signal(signal.SIGINT, stop_server)

        try:
            server.serve_forever()
        except(KeyboardInterrupt, SystemExit):
            stop_server()


def start_worker(agent, gymlike_env, job_queue):
    while True:
        ipc_msg = job_queue.get()

        if ipc_msg['type'] == 'ROLLOUT':
            data = ipc_msg['data']
            rollout_dir = data['rollout_dir']

            rollout(agent, gymlike_env, rollout_dir)
