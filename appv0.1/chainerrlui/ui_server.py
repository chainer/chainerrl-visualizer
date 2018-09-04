import os
import signal
import gevent
from gevent.pywsgi import WSGIServer
from chainerrl.agent import Agent

from chainerrlui.app import create_app


class UIServer:
    def __init__(self, agent, env, log_dir='log_space'):
        self.app = create_app(agent, env, log_dir)

    def run(self, host='localhost', port=5001, debug=False):
        if debug:
            self.app.config['ENV'] = 'development'
            self.app.run(host, port=port, debug=True, threaded=True)
        else:
            socket_address = '{}:{}'.format(host, port)
            server = WSGIServer(socket_address, application=self.app)

            def stop_server():
                if server.started:
                    server.stop()

            gevent.signal(signal.SIGTERM, stop_server)
            gevent.signal(signal.SIGINT, stop_server)

            try:
                server.serve_forever()
            except(KeyboardInterrupt, SystemExit):
                stop_server()


class EmptyServer:
    def run(self, host='localhost', port=5001, debug=False):
        pass


def create_ui_server(agent, env, log_dir='log_space'):
    assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'
    assert hasattr(env, 'render'), 'Env object must have `render` method'
    assert hasattr(env, 'reset'), 'Env object must have `reset` method'
    assert hasattr(env, 'step'), 'Env object must have `step` method'

    """
    if os.path.isdir(os.path.join(os.getcwd(), log_dir)):
        reply = str(input('Directory `{}` is already exists. Do you use this directory for log output? (y/n) '.format(
            log_dir))).lower().strip()

        if not reply == 'y':
            return EmptyServer()
    else:
        os.makedirs(log_dir)
    """

    if not os.path.isdir(os.path.join(os.getcwd(), log_dir)):
        os.makedirs(log_dir)

    return UIServer(agent, env, log_dir)
