import os
from PIL import Image
import dill
import datetime
import string
import random
import jsonlines
from chainerrl import misc

from chainerrlui import DB_SESSION
from chainerrlui.tasks.restore_objects import get_agent, get_env


def rollout(experiment, env_name, agent_class, seed):
    misc.set_random_seed(seed)
    env = get_env(env_name, seed)
    agent = get_agent(env, experiment.path, agent_class)

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
        image_path = os.path.join(rollout_dir, 'images',
                                  ''.join([random.choice(string.ascii_letters + string.digits) for _ in
                                           range(11)]) + '.png')
        image.save(image_path)

        qvalues = agent.model(agent.batch_states([obs], agent.xp, agent.phi)).q_values.data[0]

        a = agent.act(obs)

        obs, r, done, info = env.step(a)

        writer.write({
            'steps': t,
            'reward': r,
            'qvalues': [float(qvalue) for qvalue in qvalues],
            'image_path': image_path,
        })

        test_r += r
        t += 1

    agent.stop_episode()

    writer.close()
    log_file.close()

    experiment.rollout_path = rollout_dir
    DB_SESSION.commit()

    return os.path.join(rollout_dir)
