import os
from PIL import Image
import dill
import datetime
import jsonlines
import numpy as np
import gym
import chainer
import chainerrl
from chainerrl import explorers
from chainerrl import misc
from chainerrl import replay_buffer

from chainerrlui import DB_SESSION
from chainerrlui.utils import atari_wrappers


def rollout(experiment, env_name, agent_class, seed):
    misc.set_random_seed(seed)
    env = _get_env(env_name, seed)
    agent = _get_agent(env, experiment.path, agent_class)

    """
    with open(agent_path, 'rb') as f:
        agent = dill.load(f)

    with open(env_path, 'rb') as f:
        env = dill.load(f)
    """

    if not os.path.isdir(os.path.join(experiment.path, 'rollouts')):
        os.makedirs(os.path.join(experiment.path, 'rollouts'))

    rollout_dir = os.path.join(experiment.path, 'rollouts', datetime.datetime.now().strftime("%Y%m%dT%H%M%S.%f"))
    os.makedirs(rollout_dir)
    os.makedirs(os.path.join(rollout_dir, 'images'))

    obs = env.reset()
    done = False
    test_r = 0
    t = 0

    log_file = open(os.path.join(rollout_dir, 'rollout_log.jsonl'), 'w')
    writer = jsonlines.Writer(log_file)

    while not (done or t == 1800):
        image = Image.fromarray(env.render(mode='rgb_array'))
        image.save(os.path.join(rollout_dir, 'images', 'step{}.png'.format(t)))

        qvalues = agent.model(agent.batch_states([obs], agent.xp, agent.phi)).q_values.data[0]

        a = agent.act(obs)

        obs, r, done, info = env.step(a)

        writer.write({
            'steps': t,
            'reward': r,
            'qvalues': [float(qvalue) for qvalue in qvalues],
        })

        test_r += r
        t += 1

    agent.stop_episode()

    writer.close()
    log_file.close()

    experiment.rollout_path = rollout_dir
    DB_SESSION.commit()

    return os.path.join(rollout_dir)


def _get_env(env_name, seed):
    env = gym.make(env_name)

    if 'NoFrameskip' in env_name:
        env = atari_wrappers.wrap_deepmind(
            atari_wrappers.make_atari(env_name),
            episode_life=False,
            clip_rewards=False,
        )

    env.seed(seed)
    return env


def _get_agent(env, experiment_path, agent_class):
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
