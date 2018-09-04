from flask import Flask, render_template
from chainerrl.agent import Agent

class App(Flask):
    def __init__(self, *args, **kwargs):
        agent = kwargs['agent']
        env = kwargs['env']
        log_space = kwargs['log_space']

        del kwargs['agent']
        del kwargs['env']
        del kwargs['log_space']

        super().__init__(*args, **kwargs)

        assert issubclass(type(agent), Agent), 'Agent object has to be subclass of Agent class defined in chainerrl'
        assert hasattr(env, 'render'), 'Env object must have `render` method'
        assert hasattr(env, 'reset'), 'Env object must have `reset` method'
        assert hasattr(env, 'step'), 'Env object must have `step` method'

        self.agent = agent
        self.env = env
        self.log_space = log_space


def create_app(agent, env, log_space):
    app = App(__name__, agent=agent, env=env, log_space=log_space)

    @app.route('/')
    def index(**kwargs):
        return render_template('index.html')

    return app
