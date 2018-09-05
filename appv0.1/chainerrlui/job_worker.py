from chainerrlui.worker_jobs import rollout


def job_worker(agent, gymlike_env, job_queue):
    while True:
        ipc_msg = job_queue.get()

        if ipc_msg['type'] == 'ROLLOUT':
            data = ipc_msg['data']
            rollout_dir = data['rollout_dir']

            rollout(agent, gymlike_env, rollout_dir)
