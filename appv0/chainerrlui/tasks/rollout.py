import os
from PIL import Image
import datetime
import string
import random
import jsonlines
from chainerrl import misc

from chainerrlui import DB_SESSION
from chainerrlui.tasks.restore_objects import get_agent, get_env


def _prepare_rollout_dir(experiment_dir):
    if not os.path.isdir(os.path.join(experiment_dir, 'rollouts')):
        os.makedirs(os.path.join(experiment_dir, 'rollouts'))

    rollout_dir = os.path.join(experiment_dir, 'rollouts', datetime.datetime.now().strftime("%Y%m%dT%H%M%S.%f"))
    os.makedirs(rollout_dir)
    os.makedirs(os.path.join(rollout_dir, 'images'))

    return rollout_dir


def _save_env_render(env, rollout_dir):
    image = Image.fromarray(env.render(mode='rgb_array'))
    image_path = os.path.join(rollout_dir, 'images',
                              ''.join([random.choice(string.ascii_letters + string.digits) for _ in
                                       range(11)]) + '.png')
    image.save(image_path)
    return image_path


def _rollout_categorical_dqn(env, agent, rollout_dir, log_writer):
    obs = env.reset()
    done = False
    t = 0

    while not (done or t == 1800):
        image_path = _save_env_render(env, rollout_dir)

        qvalues = agent.model(agent.batch_states([obs], agent.xp, agent.phi)).q_values.data[0]
        a = agent.act(obs)
        obs, r, done, info = env.step(a)

        log_writer.write({
            'steps': t,
            'reward': r,
            'image_path': image_path,
            'qvalues': [float(qvalue) for qvalue in qvalues],
        })

        t += 1

    agent.stop_episode()


def _rollout_ppo(env, agent, rollout_dir, log_writer):
    obs = env.reset()
    t = 0
    done = False

    while not (done or t == 1800):
        image_path = _save_env_render(env, rollout_dir)

        a_distribution, state_value = agent.model(agent.batch_states([obs], agent.xp, agent.phi))
        a = agent.act(obs)
        obs, r, done, info = env.step(a)

        log_writer.write({
            'steps': t,
            'reward': r,
            'image_path': image_path,
            'state_value': float(state_value.data[0][0]),
            'actions': [float(action) for action in a],
            'action_means': [float(action) for action in a_distribution.mean[0].data],
            'action_vars': [float(action) for action in a_distribution.ln_var[0].data],
        })

        t += 1

    agent.stop_episode()


def rollout(experiment, env_name, agent_class, seed):
    misc.set_random_seed(seed)
    env = get_env(env_name, seed)
    agent = get_agent(env, experiment.path, agent_class)

    rollout_dir = _prepare_rollout_dir(experiment.path)

    log_file = open(os.path.join(rollout_dir, 'rollout_log.jsonl'), 'w')
    writer = jsonlines.Writer(log_file)

    if agent_class == 'CategoricalDQN':
        _rollout_categorical_dqn(env, agent, rollout_dir, writer)
    elif agent_class == 'PPO':
        _rollout_ppo(env, agent, rollout_dir, writer)
    else:
        raise Exception('Unsupported agent')

    writer.close()
    log_file.close()

    experiment.rollout_path = rollout_dir
    DB_SESSION.commit()

    return rollout_dir

