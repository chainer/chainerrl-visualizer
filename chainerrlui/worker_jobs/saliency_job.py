import os
import numpy as np
from scipy.ndimage.filters import gaussian_filter
from scipy.misc import imresize
from scipy.misc import imsave
import jsonlines

from chainerrlui.utils import generate_random_string

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def create_and_save_saliency_images(agent, rollout_path, from_step, to_step, obs_list,
                                    render_img_list):  # rollout_path is full path
    image_paths = []

    for step in range(from_step, to_step + 1):
        obs = np.asarray(obs_list[step])
        base_img = render_img_list[step]

        output = _saliency_on_atari_frame(_score_frame(agent, obs), base_img, 50, channel=0)
        image_path = os.path.join(rollout_path, 'images', generate_random_string(11) + '.png')
        imsave(image_path, output)

        image_paths.append(image_path)

    # TODO: image_paths たちで, logを更新する
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


def _saliency_on_atari_frame(saliency, atari, fudge_factor, size=[210, 160], channel=2, sigma=0):
    pmax = saliency.max()
    S = imresize(saliency, size=[210, 160], interp="bilinear").astype(np.float32)
    S = S if sigma == 0 else gaussian_filter(S, sigma=sigma)
    S -= S.min()
    S = fudge_factor * pmax * S / S.max()
    I = atari.astype("uint16")
    I[:, :, channel] += S.astype("uint16")
    I = I.clip(1, 255).astype("uint8")
    return I


def _score_frame(agent, input_array, radius=5, density=5, size=(4, 84, 84)):
    channel_num = size[0]
    height = size[1]
    width = size[2]

    scores = np.zeros((int(height / density) + 1, int(width / density) + 1))
    qvalues = agent.model(agent.batch_states([input_array], agent.xp, agent.phi)).q_values.data

    for i in range(0, 80, density):
        for j in range(0, 80, density):
            mask = _get_mask([i, j], size=[height, width], radius=radius)
            perturbed_img = _occlude(input_array, mask)
            perturbated_qvalues = agent.model(agent.batch_states([perturbed_img], agent.xp, agent.phi)).q_values.data
            scores[int(i / density), int(j / density)] = np.power(qvalues - perturbated_qvalues, 2).sum()
    pmax = scores.max()
    scores = imresize(scores, size=[size[1], size[2]], interp="bilinear").astype(np.float32)
    return pmax * scores / scores.max()

    return scores


def _get_mask(center, size, radius):
    y, x = np.ogrid[-center[0]:size[0] - center[0], -center[1]:size[1] - center[1]]
    keep = (x * x + y * y) / (x * x + y * y).max() >= 0.01
    msk = np.zeros(size)
    msk[keep] = 1  # select a circle of pixels
    msk = gaussian_filter(msk, sigma=radius)  # blur circle of pixels
    return msk


def _occlude(img, msk):
    return img * msk + gaussian_filter(img, sigma=3) * (1 - msk)
