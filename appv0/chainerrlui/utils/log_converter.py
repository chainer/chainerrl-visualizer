import jsonlines


def convert_log(prev_log_path, new_log_path):  # full path
    with open(prev_log_path) as f:
        lines = f.readlines()

    keys = [key.rstrip() for key in lines[0].split("\t")]

    with jsonlines.open(new_log_path, mode="w") as writer:
        for line in lines[1:]:
            record = {}
            scores = [float(score.rstrip()) for score in line.split("\t")]

            for idx, key in enumerate(keys):
                record[key] = scores[idx]

            writer.write(record)

