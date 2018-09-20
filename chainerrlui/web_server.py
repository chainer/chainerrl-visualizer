from flask import Flask, render_template, send_file, request
from chainerrl.agent import Agent

from chainerrlui.views import RolloutAPI, SaliencyAPI, ServerStateAPI


def web_server(agent, gymlike_env, log_dir, host, port, action_meanings, job_queue, is_job_running,
               is_rollout_on_memory):
    # is_job_running, is_rollout_on_memory : <Synchronized wrapper for c_bool>, on shared memory, process safe
    app = create_app(agent, gymlike_env, log_dir, action_meanings, job_queue, is_job_running, is_rollout_on_memory)

    app.config['ENV'] = 'development'
    app.run(host=host, port=port, debug=True, threaded=True, use_reloader=False)


def create_app(agent, gymlike_env, log_dir, action_meanings, q, is_job_running, is_rollout_on_memory):
    # is_job_running, is_rollout_on_memory : <Synchronized wrapper for c_bool>, on shared memory, process safe
    app = App(__name__, agent=agent, gymlike_env=gymlike_env, log_dir=log_dir, action_meanings=action_meanings,
              job_queue=q, is_job_running=is_job_running, is_rollout_on_memory=is_rollout_on_memory)

    server_state_resource = ServerStateAPI.as_view('server_state_resource')
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
        agent = kwargs['agent']
        gymlike_env = kwargs['gymlike_env']
        log_dir = kwargs['log_dir']
        action_meanings = kwargs['action_meanings']
        job_queue = kwargs['job_queue']
        # is_job_running, is_rollout_on_memory : <Synchronized wrapper for c_bool>, on shared memory, process safe
        is_job_running = kwargs['is_job_running']
        is_rollout_on_memory = kwargs['is_rollout_on_memory']

        del kwargs['agent']
        del kwargs['gymlike_env']
        del kwargs['log_dir']
        del kwargs['action_meanings']
        del kwargs['job_queue']
        del kwargs['is_job_running']
        del kwargs['is_rollout_on_memory']

        super().__init__(*args, **kwargs)

        assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'
        assert hasattr(gymlike_env, 'render'), 'Env object must have `render` method'
        assert hasattr(gymlike_env, 'reset'), 'Env object must have `reset` method'
        assert hasattr(gymlike_env, 'step'), 'Env object must have `step` method'

        self.agent = agent
        self.gymlike_env = gymlike_env
        self.log_dir = log_dir
        self.action_meanings = action_meanings
        self.job_queue = job_queue
        self.is_job_running = is_job_running
        self.is_rollout_on_memory = is_rollout_on_memory
