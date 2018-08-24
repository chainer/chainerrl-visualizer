import os
from chainerrlui import DB_SESSION
from chainerrlui.model.experiment import Experiment


def search_and_create_experiments(project, log_file_name="log.jsonl"):
    log_file_dirs = []

    for _root, _dirs, _files in os.walk(os.path.abspath(project.path)):
        for _file in _files:
            if _file == log_file_name:
                log_file_dirs.append(_root)

    experiments = DB_SESSION.query(Experiment).filter_by(project_id=project.id).all()
    experiment_paths = [exp.path for exp in experiments]

    for log_file_dir in log_file_dirs:
        if log_file_dir not in experiment_paths:
            experiment = Experiment(
                project_id=project.id,
                name=os.path.basename(os.path.normpath(log_file_dir)),
                path=log_file_dir,
            )

            DB_SESSION.add(experiment)

    DB_SESSION.commit()
