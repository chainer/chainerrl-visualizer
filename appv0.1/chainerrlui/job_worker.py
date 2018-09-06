from multiprocessing import Manager, Process
import os
import signal

from chainerrlui.worker_jobs import rollout


def job_worker(agent, gymlike_env, job_queue):
    obs_manager = Manager()
    obs_list = obs_manager.list()

    while True:
        ipc_msg = job_queue.get()

        if ipc_msg['type'] == 'ROLLOUT':
            data = ipc_msg['data']
            rollout_dir = data['rollout_dir']

            rollout_process = Process(target=rollout, args=(agent, gymlike_env, rollout_dir, obs_list))
            rollout_process.start()

            try:
                rollout_process.join()
            except(KeyboardInterrupt, SystemExit):
                os.kill(rollout_process.pid, signal.SIGTERM)

