import numpy as np
import chainer
from chainer import functions as F
from chainerrl.agents import a3c
from chainerrl.agents import PPO
from chainerrl import links
from chainerrl import misc
from chainerrl import policies
import gym
import gym.wrappers

from chainerrl_visualizer import launch_visualizer


class A3CFFGaussian(chainer.Chain, a3c.A3CModel):
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
            self.pi = policies.FCGaussianPolicyWithStateIndependentCovariance(
                obs_size, action_space.low.size,
                n_hidden_layers, n_hidden_channels,
                var_type='diagonal', nonlinearity=F.tanh,
                bound_mean=bound_mean,
                min_action=action_space.low, max_action=action_space.high,
                mean_wscale=1e-2)
            self.v = links.MLP(obs_size, 1, hidden_sizes=hidden_sizes)
            if self.normalize_obs:
                self.obs_filter = links.EmpiricalNormalization(
                    shape=obs_size
                )

    def pi_and_v(self, state):
        if self.normalize_obs:
            state = F.clip(self.obs_filter(state, update=False),
                           -5.0, 5.0)

        return self.pi(state), self.v(state)


def phi(obs):
    return obs.astype(np.float32)


gpu = -1
env_name = "BipedalWalker-v2"
seed = 0


def make_env():
    env = gym.make(env_name)
    env.seed(seed)
    misc.env_modifiers.make_rendered(env)
    return env


env = make_env()

timestep_limit = env.spec.tags.get("wrapper_config.TimeLimit.max_episode_steps")
obs_space = env.observation_space
action_space = env.action_space

model = A3CFFGaussian(obs_space.low.size, action_space, bound_mean=False, normalize_obs=False)
opt = chainer.optimizers.Adam(alpha=3e-4, eps=1e-5)
opt.setup(model)

agent = PPO(model, opt, gpu=-1, phi=phi, update_interval=2048, minibatch_size=64, epochs=10, clip_eps_vf=None,
            entropy_coef=0.0, standardize_advantages=False)

agent.load("parameters")

ACTION_MEANINGS = {
    0: 'Hip1(Torque/Velocity)',
    1: 'Knee1(Torque/Velocity)',
    2: 'Hip2(Torque/Velocity)',
    3: 'Knee2(Torque/Velocity)',
}

launch_visualizer(agent, env, action_meanings=ACTION_MEANINGS)
