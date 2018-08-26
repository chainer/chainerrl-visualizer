import os
import numpy as np
from PIL import Image
import dill
import datetime
import jsonlines


def rollout(experiment_path, agent_path, env_path):
    # TODO: ソースコードベタがきでdemoをつくる
    """
    with open(agent_path, 'rb') as f:
        agent = dill.load(f)

    with open(env_path, 'rb') as f:
        env = dill.load(f)

    if not os.path.isdir(os.path.join(experiment_path, 'rollouts')):
        os.makedirs(os.path.join(experiment_path, 'rollouts'))

    rollout_dir = os.path.join(experiment_path, 'rollouts', datetime.datetime.now().strftime("%Y%m%dT%H%M%S.%f"))
    os.makedirs(rollout_dir)
    os.makedirs(os.path.join(rollout_dir, 'images'))

    obs = env.reset()
    done = False
    test_r = 0
    t = 0

    log_file = open(os.path.join(rollout_dir, 'log.jsonl'), 'w')
    writer = jsonlines.Writer(log_file)

    while not (done or t == 1800):
        image = Image.fromarray(env.render(mode='rgb_array'))
        image.save(os.path.join(rollout_dir, 'images', 'step{}.png'.format(t)))

        qvalues = agent.model(agent.batch_states([obs], agent.xp, agent.phi)).q_values.data[0]

        a = agent.act(obs)

        obs, r, done, info = env.step(a)

        writer.write({
            'steps': t,
            'reward': r,
            'qvalues': [float(qvalue) for qvalue in qvalues],
        })

        test_r += r
        t += 1

    agent.stop_episode()

    writer.close()
    log_file.close()

    return os.path.join(rollout_dir)
    """


