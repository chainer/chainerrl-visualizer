import signal
import gevent
from gevent.pywsgi import WSGIServer
from flask import Flask, render_template, send_file, request
from chainerrl.agent import Agent

from chainerrlui.views import RolloutAPI


def web_server(agent, gymlike_env, log_dir, host, port, debug, job_queue):
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


def create_app(agent, gymlike_env, log_dir, q):
    app = App(__name__, agent=agent, gymlike_env=gymlike_env, log_dir=log_dir, job_queue=q)

    rollout_resource = RolloutAPI.as_view('rollout_resource')

    @app.route('/')
    def index(**kwargs):
        return render_template('index.html')

    @app.route('/images')
    def get_image():
        return send_file(request.args.get('image_path'), mimetype='image/image')

    app.add_url_rule(
        '/api/rollouts',
        view_func=rollout_resource,
        methods=['GET', 'POST'],
    )

    return app


class App(Flask):
    def __init__(self, *args, **kwargs):
        agent = kwargs['agent']
        gymlike_env = kwargs['gymlike_env']
        log_dir = kwargs['log_dir']
        job_queue = kwargs['job_queue']

        del kwargs['agent']
        del kwargs['gymlike_env']
        del kwargs['log_dir']
        del kwargs['job_queue']

        super().__init__(*args, **kwargs)

        assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'
        assert hasattr(gymlike_env, 'render'), 'Env object must have `render` method'
        assert hasattr(gymlike_env, 'reset'), 'Env object must have `reset` method'
        assert hasattr(gymlike_env, 'step'), 'Env object must have `step` method'

        self.agent = agent
        self.gymlike_env = gymlike_env
        self.log_dir = log_dir
        self.job_queue = job_queue
