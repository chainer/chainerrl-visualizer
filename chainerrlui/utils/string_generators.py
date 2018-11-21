import datetime
import random
import string

timestamp_format = '%Y%m%dT%H%M%S.%f'


def generate_timestamp():
    return datetime.datetime.now().strftime(timestamp_format)


def generate_random_string(length):
    return ''.join([random.choice(string.ascii_letters + string.digits) for _ in range(length)])
