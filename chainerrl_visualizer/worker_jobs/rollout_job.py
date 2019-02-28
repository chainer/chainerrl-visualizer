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
    if not hasattr(agent, 'xp'):
        agent.xp = np

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

        # workaround
        # These three agents are exceptional in that the other agents have `model` attribute
        # and `model.__call__()` returns outputs of the model.
        if type(agent).__name__ in ['TRPO', 'DDPG', 'PGT']:
            obs, r, done, action, outputs = _step_exceptional_agent(agent, gymlike_env, obs)
        else:
            obs, r, done, action, outputs = _step_agent(agent, gymlike_env, obs)

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


def _step_agent(agent, gymlike_env, obs):
    if isinstance(agent, chainerrl.recurrent.RecurrentChainMixin):
        with agent.model.state_kept():
            outputs = agent.model(agent.batch_states([obs], agent.xp, agent.phi))
    else:
        outputs = agent.model(agent.batch_states([obs], agent.xp, agent.phi))

    if not isinstance(outputs, tuple):
        outputs = tuple((outputs,))

    action = agent.act(obs)
    obs, r, done, _ = gymlike_env.step(action)

    return obs, r, done, action, outputs


def _step_exceptional_agent(agent, gymlike_env, obs):
    policy = agent.policy
    agent_type = type(agent).__name__
    b_state = agent.batch_states([obs], agent.xp, agent.phi)

    if agent_type in ['DDPG', 'PGT']:
        if isinstance(policy, chainerrl.recurrent.RecurrentChainMixin):
            with policy.state_kept():
                action_dist = policy(b_state)
        else:
            action_dist = policy(b_state)

        # workaround
        # If `agent.act()` called when `agent.q_function` has LSTM,
        # the params of the model will change. So, we have to directly get `action`
        # from `action_dist`. `action` is needed for parameter of `q_function()`.
        if agent_type == 'DDPG':
            action = action_dist.sample()
        else:  # PGT
            if agent.act_deterministically:
                action = action_dist.most_probable
            else:
                action = action_dist.sample()

        q_function = agent.q_function
        if isinstance(q_function, chainerrl.recurrent.RecurrentChainMixin):
            with q_function.state_kept():
                q_value = q_function(b_state, action)
        else:
            q_value = q_function(b_state, action)

        outputs = (action_dist, q_value)

    elif agent_type == 'TRPO':
        if isinstance(policy, chainerrl.recurrent.RecurrentChainMixin):
            with policy.state_kept():
                action_dist = policy(b_state)
        else:
            action_dist = policy(b_state)

        value_function = agent.vf
        if isinstance(value_function, chainerrl.recurrent.RecurrentChainMixin):
            with value_function.state_kept():
                state_value = value_function(b_state)
        else:
            state_value = value_function(b_state)

        outputs = (action_dist, state_value)
    else:
        raise Exception('{} is not one of the exceptional agent types'.format(agent_type))

    action = agent.act(obs)
    obs, r, done, _ = gymlike_env.step(action)

    return obs, r, done, action, outputs


def _save_env_render(rendered, rollout_dir):
    image = Image.fromarray(rendered)
    image_path = os.path.join(rollout_dir, 'images', generate_random_string(11) + '.png')
    image.save(image_path)
    return image_path
