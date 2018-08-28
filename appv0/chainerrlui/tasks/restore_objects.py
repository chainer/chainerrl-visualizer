import os
import gym
import numpy as np
import chainer
import chainerrl

from chainerrlui.utils import atari_wrappers


def get_env(env_name, seed):
    env = gym.make(env_name)

    if 'NoFrameskip' in env_name:
        env = atari_wrappers.wrap_deepmind(
            atari_wrappers.make_atari(env_name),
            episode_life=False,
            clip_rewards=False,
        )

    env.seed(seed)
    return env


def get_agent(env, experiment_path, agent_class):
    if agent_class == 'CategoricalDQN':
        return _get_categorical_dqn(env, experiment_path)
    elif agent_class == 'PPO':
        return _get_ppo(env, experiment_path)
    elif agent_class == 'DQN':
        return _get_dqn(env, experiment_path)
    else:
        raise Exception("Cannot deal with agent {}".format(agent_class))


def _get_categorical_dqn(env, experiment_path):
    batch_size = 32
    n_atoms = 51
    v_max = 10
    v_min = -10

    action_size = env.action_space.n

    q_func = chainerrl.links.Sequence(
        chainerrl.links.NatureDQNHead(),
        chainerrl.q_functions.DistributionalFCStateQFunctionWithDiscreteAction(
            None, action_size, n_atoms, v_min, v_max,
            n_hidden_channels=0, n_hidden_layers=0,
        )
    )

    explorer = chainerrl.explorers.LinearDecayEpsilonGreedy(
        1, 0, 0.1, 10 ** 6, lambda: np.random.randint(action_size),
    )

    opt = chainer.optimizers.Adam(2.5e-4, eps=1e-2 / batch_size)
    opt.setup(q_func)

    rbuf = chainerrl.replay_buffer.ReplayBuffer(10 ** 6)

    def phi(x):
        return np.asarray(x, dtype=np.float32) / 255

    agent = chainerrl.agents.CategoricalDQN(
        q_func, opt, rbuf, gpu=-1, gamma=0.99, explorer=explorer, replay_start_size=5 * 10 ** 4,
        target_update_interval=10 ** 4, update_interval=4, batch_accumulator="mean", phi=phi,
    )

    agent.load(os.path.join(experiment_path, _find_model(experiment_path)))

    return agent


def _get_ppo(env, experiment_path):
    class A3CFFGaussian(chainer.Chain, chainerrl.agents.a3c.A3CModel):
        """An example of A3C feedforward Gaussian policy."""

        def __init__(self, obs_size, action_space,
                     n_hidden_layers=2, n_hidden_channels=64,
                     bound_mean=None, normalize_obs=None):
            assert bound_mean in [False, True]
            assert normalize_obs in [False, True]
            super().__init__()
            hidden_sizes = (n_hidden_channels,) * n_hidden_layers
            self.normalize_obs = normalize_obs
            with self.init_scope():
                self.pi = chainerrl.policies.FCGaussianPolicyWithStateIndependentCovariance(
                    obs_size, action_space.low.size,
                    n_hidden_layers, n_hidden_channels,
                    var_type='diagonal', nonlinearity=chainer.functions.tanh,
                    bound_mean=bound_mean,
                    min_action=action_space.low, max_action=action_space.high,
                    mean_wscale=1e-2)
                self.v = chainerrl.links.MLP(obs_size, 1, hidden_sizes=hidden_sizes)
                if self.normalize_obs:
                    self.obs_filter = chainerrl.links.EmpiricalNormalization(
                        shape=obs_size
                    )

        def pi_and_v(self, state):
            if self.normalize_obs:
                state = chainer.functions.clip(self.obs_filter(state, update=False),
                                               -5.0, 5.0)

            return self.pi(state), self.v(state)

    def phi(obs):
        return obs.astype(np.float32)

    obs_space = env.observation_space
    action_space = env.action_space
    model = A3CFFGaussian(obs_space.low.size, action_space, bound_mean=False, normalize_obs=False)

    opt = chainer.optimizers.Adam(alpha=3e-4, eps=1e-5)
    opt.setup(model)

    agent = chainerrl.agents.PPO(model, opt, gpu=-1, phi=phi, update_interval=2048, minibatch_size=64, epochs=10,
                                 clip_eps_vf=None,
                                 entropy_coef=0.0, standardize_advantages=False)

    agent.load(os.path.join(experiment_path, _find_model(experiment_path)))

    return agent


def _get_dqn(env, experiment_path):
    q_func = chainerrl.links.Sequence(
        chainerrl.links.NatureDQNHead(activation=chainer.functions.relu),
        chainer.links.Linear(512, env.action_space.n),
        chainerrl.action_value.DiscreteActionValue,
    )

    opt = chainer.optimizers.RMSpropGraves(lr=2.5e-4, alpha=0.95, momentum=0.0, eps=1e-2)
    opt.setup(q_func)
    rep_buf = chainerrl.replay_buffer.ReplayBuffer(10 ** 6)
    explorer = chainerrl.explorers.LinearDecayEpsilonGreedy(
        1, 0, 0.1, 10 ** 6, lambda: np.random.randint(env.action_space.n),
    )

    agent = chainerrl.agents.DQN(q_func, opt, rep_buf, gpu=-1, gamma=0.99, explorer=explorer,
                                 replay_start_size=5 * 10 ** 4,
                                 target_update_interval=10 ** 4, clip_delta=True, update_interval=4,
                                 batch_accumulator="sum",
                                 phi=lambda x: np.asarray(x, np.float32) / 255)

    agent.load(os.path.join(experiment_path, _find_model(experiment_path)))

    return agent


def _find_model(experiment_path):
    for file_name in os.listdir(experiment_path):
        if 'finish' in file_name:
            return file_name

    return None


"""
if __name__ == '__main__':
    # https://github.com/openai/gym/blob/master/gym/envs/box2d/bipedal_walker.py#L446
    # https://github.com/openai/gym/blob/master/gym/envs/classic_control/rendering.py#L81

    env = get_env('BipedalWalker-v2', 0).env

    from gym.envs.classic_control import rendering
    from gym.envs.box2d.bipedal_walker import VIEWPORT_H, VIEWPORT_W
    import pyglet

    env.viewer = rendering.Viewer(VIEWPORT_W, VIEWPORT_H)

    def new_render(return_rgb_array=True):
        env.viewer.window.set_visible(visible=False)
        pyglet.gl.glClearColor(1, 1, 1, 1)
        env.viewer.window.clear()
        env.viewer.window.switch_to()
        env.viewer.window.dispatch_events()
        env.viewer.transform.enable()

        for geom in env.viewer.geoms:
            geom.render()
        for geom in env.viewer.onetime_geoms:
            geom.render()

        buffer = pyglet.image.get_buffer_manager().get_color_buffer()
        image_data = buffer.get_image_data()
        arr = np.fromstring(image_data.data, dtype=np.uint8, sep='')
        arr = arr.reshape(buffer.height, buffer.width, 4)
        arr = arr[::-1, :, 0:3]

        env.viewer.window.flip()
        env.viewer.onetime_geoms = []

        return arr

    env.viewer.render = new_render

    import matplotlib.pyplot as plt
    print(env.render())
"""
