import os
import gym
import numpy as np
import chainer
import chainerrl
from chainerrl import explorers
from chainerrl import replay_buffer

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

    agent.load(os.path.join(experiment_path, _find_model(experiment_path)))

    return agent


def _find_model(experiment_path):
    for file_name in os.listdir(experiment_path):
        if 'finish' in file_name:
            return file_name

    return None
