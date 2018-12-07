import os
from collections.abc import Iterable

from PIL import Image
import jsonlines
import numpy as np
import chainer
import chainerrl
from chainerrl.distribution import (Distribution,
                                    SoftmaxDistribution,
                                    MellowmaxDistribution,
                                    GaussianDistribution,
                                    ContinuousDeterministicDistribution)
from chainerrl.action_value import (ActionValue,
                                    DiscreteActionValue,
                                    DistributionalDiscreteActionValue,
                                    QuadraticActionValue,
                                    SingleActionValue)

from chainerrl_visualizer.utils import generate_random_string

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def rollout(agent, gymlike_env, rollout_dir, step_count, obs_list, render_img_list):
    obs_list[:] = []  # Clear the shared observations list
    render_img_list[:] = []  # Clear the shared render images list

    # workaround
    if hasattr(agent, 'xp'):
        xp = agent.xp
    else:
        xp = np

    log_fp = open(os.path.join(rollout_dir, ROLLOUT_LOG_FILE_NAME), 'a')
    writer = jsonlines.Writer(log_fp)

    obs = gymlike_env.reset()
    done = False
    t = 0

    # workaround: fp open closed periodically, so try..finally and with are not easy to use
    error_msg = ''

    while not (t == step_count or done):
        rendered = gymlike_env.render()
        image_path = _save_env_render(rendered, rollout_dir)

        # save to shared memory
        obs_list.append(obs)
        render_img_list.append(rendered)

        if isinstance(agent, chainerrl.recurrent.RecurrentChainMixin):
            with agent.model.state_kept():
                outputs = agent.model(agent.batch_states([obs], xp, agent.phi))
        else:
            outputs = agent.model(agent.batch_states([obs], xp, agent.phi))

        if not isinstance(outputs, tuple):
            outputs = tuple((outputs,))

        action = agent.act(obs)
        obs, r, done, info = gymlike_env.step(action)

        log_entries = dict()
        log_entries['step'] = t
        log_entries['reward'] = r
        log_entries['image_path'] = image_path

        if isinstance(action, Iterable):
            log_entries['action'] = [float(v) for v in action]
        else:
            # Object of type int32 is not JSON serializable
            log_entries['action'] = int(action)

        for output in outputs:
            if isinstance(output, chainer.Variable):
                log_entries['state_value'] = float(output.data[0][0])

            if isinstance(output, Distribution):
                if isinstance(output, SoftmaxDistribution):
                    log_entries['action_probs'] = [float(v) for v in output.all_prob.data[0]]
                elif isinstance(output, MellowmaxDistribution):
                    error_msg = 'Not implemented for MellowmaxDistribution yet'
                    break
                elif isinstance(output, GaussianDistribution):
                    log_entries['action_means'] = [float(v) for v in output.mean.data[0]]
                    log_entries['action_vars'] = [float(v) for v in output.var.data[0]]
                elif isinstance(output, ContinuousDeterministicDistribution):
                    error_msg = 'Not implemented for ContinuousDeterministicDistribution yet'
                    break
                else:
                    error_msg = 'Output of model in passed agent contains' \
                                'unsupported Distribution named {}'.format(type(output).__name__)
                    break

            if isinstance(output, ActionValue):
                if isinstance(output, DiscreteActionValue):
                    log_entries['action_values'] = output.q_values.data[0]
                elif isinstance(output, DistributionalDiscreteActionValue):
                    log_entries['action_values'] = [float(v) for v in output.q_values.data[0]]
                    log_entries['z_values'] = [float('%.2f' % float(v)) for v in output.z_values]
                    log_entries['action_value_dist'] = [['%f' % float(v) for v in dist_row]
                                                        for dist_row in output.q_dist.data[0].T]
                elif isinstance(output, QuadraticActionValue):
                    error_msg = 'Not implemented for QuadraticActionValue'
                    break
                elif isinstance(output, SingleActionValue):
                    error_msg = 'Not implemented for SingleActionValue'
                    break
                else:
                    error_msg = 'Output of model in passed agent contains unsupported' \
                                'ActionValue named {}'.format(type(output).__name__)
                    break

        writer.write(log_entries)
        t += 1

        # workaround: to change file modified time during rollout
        if t % 10 == 0:
            writer.close()
            log_fp.close()

            log_fp = open(os.path.join(rollout_dir, ROLLOUT_LOG_FILE_NAME), 'a')
            writer = jsonlines.Writer(log_fp)

    agent.stop_episode()

    writer.close()
    log_fp.close()

    if error_msg != '':
        raise Exception(error_msg)


def _save_env_render(rendered, rollout_dir):
    image = Image.fromarray(rendered)
    image_path = os.path.join(rollout_dir, 'images', generate_random_string(11) + '.png')
    image.save(image_path)
    return image_path
