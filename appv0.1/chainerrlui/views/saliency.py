from flask.views import MethodView
from flask import request, jsonify, current_app

from chainerrlui.job_dispatchers import dispatch_saliency_job


class SaliencyAPI(MethodView):
    def post(self, rollout_id=None):
        data = request.get_json()
        from_step = int(data['from_step'])
        to_step = int(data['to_step'])

        if current_app.is_job_running or (not current_app.is_rollout_on_memory):
            return jsonify({
                'is_saliency_started': False,
            })

        dispatch_saliency_job(rollout_id, from_step, to_step)

        return jsonify({
            'is_saliency_started': True,
        })
