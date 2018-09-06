from multiprocessing import Manager, Process
import os
import signal

from chainerrlui.worker_jobs import rollout, create_and_save_saliency_images


def job_worker(agent, gymlike_env, job_queue):
    obs_manager = Manager()
    obs_list = obs_manager.list()
    render_img_list = obs_manager.list()

    latest_rollout_id = None

    while True:
        ipc_msg = job_queue.get()

        if ipc_msg['type'] == 'ROLLOUT':
            data = ipc_msg['data']
            rollout_dir = data['rollout_dir']
            latest_rollout_id = data['rollout_id']

            rollout_process = Process(target=rollout, args=(agent, gymlike_env, rollout_dir, obs_list, render_img_list))
            rollout_process.start()

            try:
                rollout_process.join()
            except(KeyboardInterrupt, SystemExit):
                os.kill(rollout_process.pid, signal.SIGTERM)
        elif ipc_msg['type'] == 'SALIENCY':
            data = ipc_msg['data']
            rollout_id = data['rollout_id']
            rollout_path = data['rollout_dir']  # full path
            from_step = data['from_step']
            to_step = data['to_step']

            if rollout_id != latest_rollout_id:
                print('rollout_id != latest_rollout_id')  # for debug
                continue

            saliency_process = Process(target=create_and_save_saliency_images,
                                       args=(agent, rollout_path, from_step, to_step, obs_list, render_img_list))
            saliency_process.start()

            try:
                saliency_process.join()
            except(KeyboardInterrupt, SystemExit):
                os.kill(saliency_process.pid, signal.SIGTERM)
