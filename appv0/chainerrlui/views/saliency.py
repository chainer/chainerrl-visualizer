from flask.views import MethodView
from flask import jsonify, request

from chainerrlui.tasks.saliency import create_saliency_images
from chainerrlui.model.experiment import Experiment
from chainerrlui.model.experiment import Project
from chainerrlui import DB_SESSION


class SaliencyAPI(MethodView):
    def post(self, experiment_id=None):
        data = request.get_json()
        from_step = int(data["from_step"])
        to_step = int(data["to_step"])
        seed = int(data["seed"])

        experiment = DB_SESSION.query(Experiment).filter_by(id=experiment_id).first()
        project = DB_SESSION.query(Project).filter_by(id=experiment.project_id).first()

        image_paths = create_saliency_images(from_step, to_step, experiment.path, experiment.rollout_path,
                                             project.env_name, project.agent_class, seed)

        return jsonify({
            "image_paths": image_paths,
        })
