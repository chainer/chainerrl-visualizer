import signal
from flask import Flask, render_template, send_file, request

from chainerrl_visualizer.views import RolloutAPI, SaliencyAPI, ServerStateAPI, AgentProfileAPI


def web_server(agent, gymlike_env, profile, log_dir, host, port, action_meanings,
               raw_image_input, job_queue, is_job_running, is_rollout_on_memory, debug):
    # is_job_running, is_rollout_on_memory :
    # <Synchronized wrapper for c_bool>, on shared memory, process safe

    app = create_app(
        agent=agent,
        gymlike_env=gymlike_env,
        profile=profile,
        log_dir=log_dir,
        action_meanings=action_meanings,
        raw_image_input=raw_image_input,
        job_queue=job_queue,
        is_job_running=is_job_running,
        is_rollout_on_memory=is_rollout_on_memory)

    if debug:
        app.config['ENV'] = 'development'
        app.debug = True
        from werkzeug.serving import run_simple
        run_simple(host, port, app, use_reloader=False, use_debugger=True, threaded=True)
    else:
        app.config['ENV'] = 'production'
        import gevent
        from gevent.pywsgi import WSGIServer
        socket_addr = '{}:{}'.format(host, port)
        server = WSGIServer(socket_addr, application=app, log=None)

        def stop_server():
            if server.started:
                server.stop()

        gevent.signal(signal.SIGTERM, stop_server)
        gevent.signal(signal.SIGINT, stop_server)
        print(' * Running on http://{}/ (Press CTRL+C to quit)'.format(socket_addr))

        try:
            server.serve_forever()
        except (KeyboardInterrupt, SystemExit):
            stop_server()


def create_app(agent, gymlike_env, profile, log_dir, action_meanings,
               raw_image_input, job_queue, is_job_running, is_rollout_on_memory):
    app = App(__name__)

    app.set_shared_properties(
        agent=agent,
        gymlike_env=gymlike_env,
        profile=profile,
        log_dir=log_dir,
        action_meanings=action_meanings,
        raw_image_input=raw_image_input)

    app.set_objects_on_shared_memory(
        job_queue=job_queue,
        is_job_running=is_job_running,
        is_rollout_on_memory=is_rollout_on_memory)

    server_state_resource = ServerStateAPI.as_view('server_state_resource')
    agent_profile_resource = AgentProfileAPI.as_view('agent_profile_resource')
    rollout_resource = RolloutAPI.as_view('rollout_resource')
    saliency_resource = SaliencyAPI.as_view('saliency_resource')

    @app.route('/')
    def index(**kwargs):
        return render_template('index.html')

    @app.route('/images')
    def get_image():
        return send_file(request.args.get('image_path'), mimetype='image/image')

    app.add_url_rule(
        '/api/server_state',
        view_func=server_state_resource,
        methods=['GET'],
    )

    app.add_url_rule(
        '/api/agent_profile',
        view_func=agent_profile_resource,
        methods=['GET'],
    )

    app.add_url_rule(
        '/api/rollouts',
        view_func=rollout_resource,
        methods=['GET', 'POST'],
    )

    app.add_url_rule(
        '/api/rollouts/<string:rollout_id>',
        view_func=rollout_resource,
        methods=['GET'],
    )

    app.add_url_rule(
        '/api/rollouts/<string:rollout_id>/saliency',
        view_func=saliency_resource,
        methods=['POST'],
    )

    return app


class App(Flask):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.agent = None
        self.gymlike_env = None
        self.profile = None
        self.log_dir = None
        self.action_meanings = None
        self.raw_image_input = None

        self.job_queue = None
        self.is_job_running = None
        self.is_rollout_on_memory = None

    def set_shared_properties(self, agent, gymlike_env, profile, log_dir,
                              action_meanings, raw_image_input):
        self.agent = agent
        self.gymlike_env = gymlike_env
        self.profile = profile
        self.log_dir = log_dir
        self.action_meanings = action_meanings
        self.raw_image_input = raw_image_input

    def set_objects_on_shared_memory(self, job_queue, is_job_running, is_rollout_on_memory):
        # is_job_running, is_rollout_on_memory :
        # <Synchronized wrapper for c_bool>, on shared memory, process safe

        self.job_queue = job_queue
        self.is_job_running = is_job_running
        self.is_rollout_on_memory = is_rollout_on_memory
