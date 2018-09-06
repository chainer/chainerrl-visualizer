import os
import jsonlines
from datetime import datetime

ROLLOUT_LOG_FILE_NAME = 'rollout_log.jsonl'


def parse_rollout_log(rollout_path):
    rollout_log = []

    with jsonlines.open(os.path.join(rollout_path, ROLLOUT_LOG_FILE_NAME)) as reader:
        for obj in reader:
            rollout_log.append(obj)

    return rollout_log


def rollout_log_last_updated(rollout_path):
    unix_timestamp = os.path.getmtime(rollout_path)
    return datetime.fromtimestamp(unix_timestamp)
