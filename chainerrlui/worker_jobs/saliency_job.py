import os

import numpy as np
from scipy.ndimage.filters import gaussian_filter
from scipy.misc import imresize
from scipy.misc import imsave
import jsonlines

from chainerrlui.utils import generate_random_string

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def create_and_save_saliency_images(agent, rollout_path, from_step, to_step,
                                    obs_list, render_img_list):
    image_paths = []

    for step in range(from_step, to_step + 1):
        obs = np.asarray(obs_list[step])
        base_img = render_img_list[step]

        # TODO: Generalize to all agent
        if type(agent).__name__ == 'CategoricalDQN':
            output = _saliency_on_atari_frame(
                _score_frame_discrete_qvalues(
                    agent, obs), base_img, 50, channel=0)
        elif type(agent).__name__ == 'A3C':
            softmax_policy_score, state_value_score =\
                _score_frame_softmax_policy_and_state_value(agent, obs)
            output = _saliency_on_atari_frame(
                state_value_score, base_img, 50, channel=0)
            output = _saliency_on_atari_frame(
                softmax_policy_score, output, 25, channel=2)
        else:
            raise Exception('unsupported agent')

        image_path = os.path.join(
            rollout_path, 'images', generate_random_string(11) + '.png')
        imsave(image_path, output)

        image_paths.append(image_path)

    log = []
    log_file_path = os.path.join(rollout_path, ROLLOUT_LOG_FILE_NAME)
    with jsonlines.open(log_file_path) as reader:
        for obj in reader:
            log.append(obj)

    for step in range(from_step, to_step + 1):
        log[step]['image_path'] = image_paths[step - from_step]

    os.remove(log_file_path)

    with jsonlines.open(log_file_path, mode='w') as writer:
        for line in log:
            writer.write(line)


def _saliency_on_atari_frame(saliency, atari, fudge_factor, size=[210, 160],
                             channel=2, sigma=0):
    pmax = saliency.max()
    S = imresize(saliency, size=size, interp="bilinear").astype(np.float32)
    S = S if sigma == 0 else gaussian_filter(S, sigma=sigma)
    S -= S.min()
    S = fudge_factor * pmax * S / S.max()
    img = atari.astype("uint16")
    img[:, :, channel] += S.astype("uint16")
    img = img.clip(1, 255).astype("uint8")
    return img


def _score_frame_discrete_qvalues(agent, input_array, radius=5, density=5,
                                  size=(4, 84, 84)):
    height = size[1]
    width = size[2]

    scores = np.zeros((int(height / density) + 1, int(width / density) + 1))

    qvalues = agent.model(
        agent.batch_states([input_array], agent.xp, agent.phi)).q_values.data

    for i in range(0, 80, density):
        for j in range(0, 80, density):
            mask = _get_mask([i, j], size=[height, width], radius=radius)
            perturbed_img = _occlude(input_array, mask)
            perturbated_qvalues = agent.model(agent.batch_states(
                [perturbed_img], agent.xp, agent.phi)).q_values.data
            scores[int(i / density), int(j / density)] =\
                np.power(qvalues - perturbated_qvalues, 2).sum()
    pmax = scores.max()
    scores = imresize(
        scores, size=[height, width], interp="bilinear").astype(np.float32)

    return pmax * scores / scores.max()


def _score_frame_softmax_policy_and_state_value(agent, input_array, radius=5,
                                                density=5, size=(4, 84, 84)):
    height = size[1]
    width = size[2]

    softmax_policy_score = np.zeros(
        (int(height / density) + 1, int(width / density) + 1))
    state_value_score = np.zeros(
        (int(height / density) + 1, int(width / density) + 1))

    softmax_dist, state_value = agent.model(
        agent.batch_states([input_array], np, agent.phi))
    dist_logits = softmax_dist.logits.data[0]
    state_value = state_value.data[0]

    for i in range(0, 80, density):
        for j in range(0, 80, density):
            mask = _get_mask([i, j], size=[height, width], radius=radius)
            perturbated_img = _occlude(input_array, mask)

            perturbated_softmax_dist, perturbated_state_value = agent.model(
                agent.batch_states([perturbated_img], np, agent.phi))
            perturbated_dist_logits = perturbated_softmax_dist.logits.data[0]
            perturbated_state_value = perturbated_state_value.data[0]

            softmax_policy_score[int(i / density), int(j / density)] =\
                np.power(dist_logits - perturbated_dist_logits, 2).sum()
            state_value_score[int(i / density), int(j / density)] =\
                np.power(state_value - perturbated_state_value, 2).sum()

    softmax_policy_pmax = softmax_policy_score.max()
    state_value_pmax = state_value_score.max()

    softmax_policy_score = imresize(
        softmax_policy_score, size=[height, width], interp='bilinear').astype(
        np.float32)
    state_value_score = imresize(
        state_value_score, size=[height, width], interp='bilinear').astype(
        np.float32)

    softmax_policy_score =\
        softmax_policy_pmax * softmax_policy_score / softmax_policy_score.max()

    state_value_score =\
        state_value_pmax * state_value_score / state_value_score.max()

    return softmax_policy_score, state_value_score


def _get_mask(center, size, radius):
    y, x = np.ogrid[
           -center[0]:size[0] - center[0], -center[1]:size[1] - center[1]]
    keep = (x * x + y * y) / (x * x + y * y).max() >= 0.01
    msk = np.zeros(size)
    msk[keep] = 1  # select a circle of pixels
    msk = gaussian_filter(msk, sigma=radius)  # blur circle of pixels
    return msk


def _occlude(img, msk):
    return img * msk + gaussian_filter(img, sigma=3) * (1 - msk)
