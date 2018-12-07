# RFC 3339 date looks like this: 1985-04-12T23:20:50.52Z
JSONIZED_DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%SZ'


def jsonize_datetime(datetime):
    return datetime.strftime(JSONIZED_DATETIME_FORMAT)
