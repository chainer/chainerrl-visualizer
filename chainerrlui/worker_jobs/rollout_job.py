import os
from PIL import Image
import jsonlines
import numpy as np

from chainerrlui.utils import generate_random_string

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def rollout(agent, gymlike_env, rollout_dir, obs_list, render_img_list):
    obs_list[:] = []  # Clear the shared observations list
    render_img_list[:] = []  # Clear the shared render images list

    log_fp = open(os.path.join(rollout_dir, ROLLOUT_LOG_FILE_NAME), 'w')
    writer = jsonlines.Writer(log_fp)

    # TODO: Generalize for all agents in ChainerRL
    if type(agent).__name__ == 'CategoricalDQN':
        _rollout_categorical_dqn(agent, gymlike_env, rollout_dir, writer, obs_list, render_img_list)
    elif type(agent).__name__ == 'PPO':
        _rollout_ppo(agent, gymlike_env, rollout_dir, writer, obs_list, render_img_list)
    elif type(agent).__name__ == 'A3C':
        _rollout_a3c(agent, gymlike_env, rollout_dir, writer, obs_list, render_img_list)
    else:
        raise Exception('Unsupported agent')

    writer.close()
    log_fp.close()


def _rollout_categorical_dqn(agent, gymlike_env, rollout_dir, log_writer, obs_list, render_img_list):
    obs = gymlike_env.reset()
    done = False
    t = 0

    while not (done or t == 1800):
        rendered = gymlike_env.render(mode='rgb_array')

        obs_list.append(obs)
        render_img_list.append(rendered)

        image_path = _save_env_render(rendered, rollout_dir)

        action_value = agent.model(agent.batch_states([obs], agent.xp, agent.phi))
        qvalues = action_value.q_values.data[0]
        z_values = action_value.z_values
        qvalue_dist = action_value.q_dist.data[0].T
        a = agent.act(obs)
        obs, r, done, info = gymlike_env.step(a)

        log_writer.write({
            'steps': t,
            'action': int(a),
            'reward': r,
            'image_path': image_path,
            'qvalues': [float(qvalue) for qvalue in qvalues],
            'z_values': [float('%.2f' % float(v)) for v in z_values],
            'qvalue_dist': [['%f' % float(v) for v in qvalue_dist_row] for qvalue_dist_row in qvalue_dist],
        })

        t += 1

    agent.stop_episode()


def _rollout_a3c(agent, gymlike_env, rollout_dir, log_writer, obs_list, render_img_list):
    obs = gymlike_env.reset()
    done = False
    t = 0

    while not (done or t == 1800):
        rendered = gymlike_env.render(mode='rgb_array')

        obs_list.append(obs)
        render_img_list.append(rendered)

        image_path = _save_env_render(rendered, rollout_dir)

        softmax_dist, state_value = agent.model(agent.batch_states([obs], np, agent.phi))
        a = agent.act(obs)
        obs, r, done, info = gymlike_env.step(a)

        log_writer.write({
            'steps': t,
            'action': int(a),
            'reward': r,
            'image_path': image_path,
            'state_value': float(state_value.data[0][0]),
            'action_probs': [float(v) for v in softmax_dist.all_prob.data[0]],
        })

        t += 1

    agent.stop_episode()


def _rollout_ppo(agent, gymlike_env, rollout_dir, log_writer, obs_list, render_img_list):
    obs = gymlike_env.reset()
    done = False
    t = 0

    while not (done or t == 100):
        rendered = gymlike_env.render(mode='rgb_array')

        obs_list.append(obs)
        render_img_list.append(rendered)

        image_path = _save_env_render(rendered, rollout_dir)

        action_dist, state_value = agent.model(agent.batch_states([obs], agent.xp, agent.phi))
        a = agent.act(obs)
        obs, r, done, info = gymlike_env.step(a)

        log_writer.write({
            'steps': t,
            'reward': r,
            'image_path': image_path,
            'action': [float(v) for v in a],
            'state_value': float(state_value.data[0][0]),
            'action_means': [float(v) for v in action_dist.mean.data[0]],
            'action_vars': [float(v) for v in action_dist.var.data[0]],
        })

        t += 1

    agent.stop_episode()


def _save_env_render(rendered, rollout_dir):
    image = Image.fromarray(rendered)
    image_path = os.path.join(rollout_dir, 'images', generate_random_string(11) + '.png')
    image.save(image_path)
    return image_path
