import os
from flask import current_app


def dispatch_saliency_job(rollout_id, from_step, to_step, intensity):
    current_app.job_queue.put({
        'type': 'SALIENCY',
        'data': {
            'rollout_id': rollout_id,
            'rollout_dir': os.path.join(current_app.log_dir, 'rollouts', rollout_id),
            'from_step': from_step,
            'to_step': to_step,
            'intensity': intensity,
        },
    })
