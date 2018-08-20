from chainerrl.action_value import DiscreteActionValue
from chainerrl import agents, explorers, links, replay_buffer
from chainer import functions as F
from chainer import links as L
from chainer import optimizers
import numpy as np
import os

from scipy.ndimage.filters import gaussian_filter
from scipy.misc import imresize
from scipy.misc import imsave

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


def get_mask(center, size, radius):
    y, x = np.ogrid[-center[0]:size[0] - center[0], -center[1]:size[1] - center[1]]
    keep = (x * x + y * y) / (x * x + y * y).max() >= 0.01
    msk = np.zeros(size)
    msk[keep] = 1  # select a circle of pixels
    msk = gaussian_filter(msk, sigma=radius)  # blur circle of pixels
    return msk


def occlude(img, msk):
    return img * msk + gaussian_filter(img, sigma=3) * (1 - msk)


def score_frame(agent, input_array, radius=5, density=5, size=(4, 84, 84)):
    channel_num = size[0]
    height = size[1]
    width = size[2]

    scores = np.zeros((int(height / density) + 1, int(width / density) + 1))
    qvalues = agent.model(agent.batch_states([input_array], agent.xp, agent.phi)).q_values.data

    for i in range(0, 80, density):
        for j in range(0, 80, density):
            mask = get_mask([i, j], size=[height, width], radius=radius)
            perturbed_img = occlude(input_array, mask)
            perturbated_qvalues = agent.model(agent.batch_states([perturbed_img], agent.xp, agent.phi)).q_values.data
            scores[int(i / density), int(j / density)] = np.power(qvalues - perturbated_qvalues, 2).sum()
    pmax = scores.max()
    scores = imresize(scores, size=[size[1], size[2]], interp="bilinear").astype(np.float32)
    return pmax * scores / scores.max()

    return scores


def saliency_on_atari_frame(saliency, atari, fudge_factor, size=[210, 160], channel=2, sigma=0):
    pmax = saliency.max()
    S = imresize(saliency, size=[210, 160], interp="bilinear").astype(np.float32)
    S = S if sigma == 0 else gaussian_filter(S, sigma=sigma)
    S -= S.min()
    S = fudge_factor * pmax * S / S.max()
    I = atari.astype("uint16")
    I[:, :, channel] += S.astype("uint16")
    I = I.clip(1, 255).astype("uint8")
    return I


def create_saliency_images(fromStep, toStep, result_path, model_name, seed):
    env = _get_env("BreakoutNoFrameskip-v4", seed)
    agent = _get_agent(env, os.path.join(result_path, model_name))

    obs = env.reset()
    image = env.render(mode="rgb_array")
    test_r = 0
    t = 0

    obs_list = []
    image_list = []

    if fromStep == 0:
        obs_list.append(obs)
        image_list.append(image)

    while t <= toStep:
        a = agent.act(obs)
        obs, r, done, info = env.step(a)
        image = env.render(mode="rgb_array")
        obs_list.append(obs)
        image_list.append(image)
        test_r += r
        t += 1

    agent.stop_episode()

    for step in range(fromStep, toStep + 1):
        output = saliency_on_atari_frame(score_frame(agent, np.asarray(obs_list[step])), image_list[step], 50,
                                         channel=2)
        filepath = os.path.join(result_path, 'rollout', 'images', 'step{}.png'.format(step))
        if os.path.exists(filepath):
            os.remove(filepath)

        imsave(filepath, output)

