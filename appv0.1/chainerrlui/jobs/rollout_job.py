from threading import Thread, Event
import os
from PIL import Image
from flask import current_app
import jsonlines

from chainerrlui.utils import generate_random_string

ROLLOUT_JOB_ID_FORMAT = 'rollout_{}'  # {} is datetime
ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def throw_rollout_job(agent, gymlike_env, rollout_dir):
    rollout_id = os.path.basename(rollout_dir)
    job = RolloutJob(agent, gymlike_env, rollout_dir, current_app.jobs)

    current_app.jobs[ROLLOUT_JOB_ID_FORMAT.format(rollout_id)] = job

    job.start()


class RolloutJob(Thread):
    def __init__(self, agent, gymlike_env, rollout_dir, global_jobs):
        self.agent = agent
        self.gymlike_env = gymlike_env
        self.rollout_dir = rollout_dir
        self.global_jobs = global_jobs

        self.rollout_id = os.path.basename(rollout_dir)

        super().__init__()
        self.stop_event = Event()

    def stop(self):
        self.delete_id_from_global_jobs()
        self.stop_event.set()

    def run(self):
        _rollout(self.agent, self.gymlike_env, self.rollout_dir)
        self.delete_id_from_global_jobs()

    def delete_id_from_global_jobs(self):
        del self.global_jobs[ROLLOUT_JOB_ID_FORMAT.format(self.rollout_id)]


def _rollout(agent, gymlike_env, rollout_dir):
    log_fp = open(os.path.join(rollout_dir, ROLLOUT_LOG_FILE_NAME), 'w')
    writer = jsonlines.Writer(log_fp)

    # TODO: Generalize for all agents in ChainerRL
    if type(agent).__name__ == 'CategoricalDQN':
        _rollout_categorical_dqn(agent, gymlike_env, rollout_dir, writer)
    else:
        raise Exception('Unsupported agent')

    writer.close()
    log_fp.close()


def _rollout_categorical_dqn(agent, gymlike_env, rollout_dir, log_writer):
    obs = gymlike_env.reset()
    done = False
    t = 0

    while not (done or t == 1800):
        image_path = _save_env_render(gymlike_env, rollout_dir)

        qvalues = agent.model(agent.batch_states([obs], agent.xp, agent.phi)).q_values.data[0]
        a = agent.act(obs)
        obs, r, done, info = gymlike_env.step(a)

        log_writer.write({
            'steps': t,
            'reward': r,
            'image_path': image_path,
            'qvalues': [float(qvalue) for qvalue in qvalues],
        })

        t += 1

    agent.stop_episode()


def _save_env_render(gymlike_env, rollout_dir):
    image = Image.fromarray(gymlike_env.render(mode='rgb_array'))
    image_path = os.path.join(rollout_dir, 'images', generate_random_string(11) + '.png')
    image.save(image_path)
    return image_path
