import os
from flask import current_app


def dispatch_rollout_job(rollout_dir):
    current_app.job_queue.put({
        'type': 'ROLLOUT',
        'data': {
            'rollout_dir': rollout_dir,
            'rollout_id': os.path.basename(rollout_dir),
        }
    })
