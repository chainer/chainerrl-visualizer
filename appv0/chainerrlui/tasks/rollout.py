from chainerrl.action_value import DiscreteActionValue
from chainerrl import agents, experiments, explorers, links, misc, replay_buffer
from chainer import functions as F
from chainer import links as L
from chainer import optimizers
import numpy as np
import os
from PIL import Image
import json

from chainerrlui.utils import atari_wrappers


def _get_agent(env, load_dir):
    q_func = links.Sequence(
        links.NatureDQNHead(activation=F.relu),
        L.Linear(512, env.action_space.n),
        DiscreteActionValue,
    )
    opt = optimizers.RMSpropGraves(lr=2.5e-4, alpha=0.95, momentum=0.0, eps=1e-2)
    opt.setup(q_func)
    rep_buf = replay_buffer.ReplayBuffer(10 ** 6)
    explorer = explorers.LinearDecayEpsilonGreedy(
        1, 0, 0.1, 10 ** 6, lambda: np.random.randint(env.action_space.n),
    )

    agent = agents.DQN(q_func, opt, rep_buf, gpu=-1, gamma=0.99, explorer=explorer, replay_start_size=5 * 10 ** 4,
                       target_update_interval=10 ** 4, clip_delta=True, update_interval=4, batch_accumulator="sum",
                       phi=lambda x: np.asarray(x, np.float32) / 255)
    agent.load(load_dir)

    return agent


def _get_env(env_name, random_seed):
    env = atari_wrappers.wrap_deepmind(
        atari_wrappers.make_atari(env_name),
        episode_life=False, clip_rewards=False
    )
    env.seed(random_seed)
    # misc.env_modifiers.make_rendered(env)
    return env


def rollout(result_path, model_name, seed):
    env = _get_env("BreakoutNoFrameskip-v4", seed)
    agent = _get_agent(env, os.path.join(result_path, model_name))

    output = []

    obs = env.reset()
    done = False
    test_r = 0
    t = 0

    while not (done or t == 1800):
        image = Image.fromarray(env.render(mode='rgb_array'))
        image.save(os.path.join(result_path, 'rollout', 'images', 'step{}.png'.format(t)))

        qvalues = agent.model(agent.batch_states([np.asarray(obs)], agent.xp, agent.phi)).q_values.data[0]

        a = agent.act(obs)

        obs, r, done, info = env.step(a)

        data = {}
        data['step'] = t
        data['qvalue1'] = float(qvalues[0])
        data['qvalue2'] = float(qvalues[1])
        data['qvalue3'] = float(qvalues[2])
        data['qvalue4'] = float(qvalues[3])
        data['reward'] = r

        output.append(data)

        test_r += r
        t += 1

    agent.stop_episode()

    with open(os.path.join(result_path, 'rollout', 'log'), 'a') as f:
        json.dump(output, f, indent=4)
