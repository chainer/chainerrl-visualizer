import chainer
import chainerrl
from chainerrl import explorers
from chainerrl import misc
from chainerrl import replay_buffer
import numpy as np

from chainerrlui import launch_visualizer

from chainerrl.wrappers import atari_wrappers

seed = 0
env_name = "SeaquestNoFrameskip-v4"
batch_size = 32


def make_env():
    env = atari_wrappers.wrap_deepmind(
        atari_wrappers.make_atari(env_name),
        episode_life=False,
        clip_rewards=False,
    )
    env.seed(seed)
    misc.env_modifiers.make_rendered(env)
    return env


env = make_env()

timestep_limit = env.spec.tags.get("wrapper_config.TimeLimit.max_episode_steps")
obs_size = env.observation_space.low.size
action_size = env.action_space.n
obs_space = env.observation_space
action_space = env.action_space

n_atoms = 51
v_max = 10
v_min = -10

q_func = chainerrl.links.Sequence(
    chainerrl.links.NatureDQNHead(),
    chainerrl.q_functions.DistributionalFCStateQFunctionWithDiscreteAction(
        None, action_size, n_atoms, v_min, v_max,
        n_hidden_channels=0, n_hidden_layers=0,
    )
)

explorer = explorers.LinearDecayEpsilonGreedy(
    1, 0, 0.1, 10 ** 6, lambda: np.random.randint(action_size),
)

opt = chainer.optimizers.Adam(2.5e-4, eps=1e-2 / batch_size)
opt.setup(q_func)

rbuf = replay_buffer.ReplayBuffer(10 ** 6)


def phi(x):
    return np.asarray(x, dtype=np.float32) / 255


agent = chainerrl.agents.CategoricalDQN(
    q_func, opt, rbuf, gpu=-1, gamma=0.99, explorer=explorer, replay_start_size=5 * 10 ** 4,
    target_update_interval=10 ** 4, update_interval=4, batch_accumulator="mean", phi=phi,
)

agent.load("results/213921/20180807T064140.265982/50000000_finish")

ACTION_MEANING = {
    0: "NOOP",
    1: "FIRE",
    2: "UP",
    3: "RIGHT",
    4: "LEFT",
    5: "DOWN",
    6: "UPRIGHT",
    7: "UPLEFT",
    8: "DOWNRIGHT",
    9: "DOWNLEFT",
    10: "UPFIRE",
    11: "RIGHTFIRE",
    12: "LEFTFIRE",
    13: "DOWNFIRE",
    14: "UPRIGHTFIRE",
    15: "UPLEFTFIRE",
    16: "DOWNRIGHTFIRE",
    17: "DOWNLEFTFIRE",
}

launch_visualizer(agent, env, action_meanings=ACTION_MEANING, raw_image_input=True)
