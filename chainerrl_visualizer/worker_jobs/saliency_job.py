import os

import numpy as np
from scipy.ndimage.filters import gaussian_filter
from scipy.misc import imresize
from scipy.misc import imsave
import jsonlines

from chainerrl_visualizer.utils import generate_random_string
from chainerrl_visualizer.config import (
    DISCRETE_ACTION_VALUE, DISTRIBUTIONAL_DISCRETE_ACTION_VALUE, SOFTMAX_DISTRIBUTION)

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def create_and_save_saliency_images(agent, profile, rollout_path, from_step, to_step,
                                    intensity, obs_list, render_img_list):
    image_paths = []

    for step in range(from_step, to_step + 1):
        obs = np.asarray(obs_list[step])
        base_img = render_img_list[step]

        if profile['action_value_type'] in \
                [DISCRETE_ACTION_VALUE, DISTRIBUTIONAL_DISCRETE_ACTION_VALUE]:
            output = _saliency_on_base_image(_score_frame_discrete_qvalues(agent, obs),
                                             base_img, intensity['qfunc_intensity'], channel=0)
        elif profile['state_value_returned'] and \
                profile['distribution_type'] == SOFTMAX_DISTRIBUTION:
            softmax_policy_score, state_value_score =\
                _score_frame_softmax_policy_and_state_value(agent, obs)
            output = _saliency_on_base_image(
                state_value_score, base_img, intensity['critic_intensity'], channel=0)
            output = _saliency_on_base_image(
                softmax_policy_score, output, intensity['actor_intensity'], channel=2)
        else:
            raise Exception('unsupported agent for saliency map create')

        image_path = os.path.join(rollout_path, 'images', generate_random_string(11) + '.png')
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


def _saliency_on_base_image(saliency, base_img, fudge_factor, channel=2, sigma=0):
    # base_img shape is intended to be (height, width, channel)
    size = base_img.shape[0:2]  # height, width
    saliency_max = saliency.max()
    saliency = imresize(saliency, size=size, interp="bilinear").astype(np.float32)

    if sigma is not 0:
        saliency = gaussian_filter(saliency, sigma=sigma)

    saliency -= saliency.min()
    saliency = fudge_factor * saliency_max * saliency / saliency.max()

    img = base_img.astype("uint16")
    img[:, :, channel] += saliency.astype("uint16")
    img = img.clip(1, 255).astype("uint8")

    return img


def _score_frame_discrete_qvalues(agent, input_np_array, radius=5, density=10):
    size = input_np_array.shape
    height = size[1]
    width = size[2]

    scores = np.zeros((int(height / density) + 1, int(width / density) + 1))

    qvalues = agent.model(
        agent.batch_states([input_np_array], agent.xp, agent.phi)).q_values.data

    for i in range(0, height, density):
        for j in range(0, width, density):
            mask = _get_mask([i, j], size=[height, width], radius=radius)
            perturbed_img = _occlude(input_np_array, mask)
            perturbated_qvalues = agent.model(
                agent.batch_states([perturbed_img], agent.xp, agent.phi)).q_values.data
            scores[int(i / density), int(j / density)] =\
                np.power(qvalues - perturbated_qvalues, 2).sum()
    scores_max = scores.max()
    scores = imresize(scores, size=[height, width], interp="bilinear").astype(np.float32)

    return scores_max * scores / scores.max()


def _score_frame_softmax_policy_and_state_value(
        agent, input_np_array, radius=5, density=10):
    size = input_np_array.shape
    height = size[1]
    width = size[2]

    softmax_policy_score = np.zeros((int(height / density) + 1, int(width / density) + 1))
    state_value_score = np.zeros((int(height / density) + 1, int(width / density) + 1))

    softmax_dist, state_value = agent.model(agent.batch_states([input_np_array], np, agent.phi))
    dist_logits = softmax_dist.logits.data[0]
    state_value = state_value.data[0]

    for i in range(0, height, density):
        for j in range(0, width, density):
            mask = _get_mask([i, j], size=[height, width], radius=radius)
            perturbated_img = _occlude(input_np_array, mask)

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
        softmax_policy_score, size=[height, width], interp='bilinear').astype(np.float32)
    state_value_score = imresize(
        state_value_score, size=[height, width], interp='bilinear').astype(np.float32)

    softmax_policy_score = softmax_policy_pmax * softmax_policy_score / softmax_policy_score.max()
    state_value_score = state_value_pmax * state_value_score / state_value_score.max()

    return softmax_policy_score, state_value_score


def _get_mask(center, size, radius):
    y, x = np.ogrid[-center[0]:size[0] - center[0], -center[1]:size[1] - center[1]]
    keep = (x * x + y * y) / (x * x + y * y).max() >= 0.01
    msk = np.zeros(size)
    msk[keep] = 1  # select a circle of pixels
    msk = gaussian_filter(msk, sigma=radius)  # blur circle of pixels
    return msk


def _occlude(img, msk):
    return img * msk + gaussian_filter(img, sigma=3) * (1 - msk)
