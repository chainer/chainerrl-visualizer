from flask.views import MethodView
from flask import request, jsonify, current_app

from chainerrl_visualizer.job_dispatchers import dispatch_saliency_job


class SaliencyAPI(MethodView):
    def post(self, rollout_id=None):
        if current_app.is_job_running.value or (not current_app.is_rollout_on_memory.value):
            return jsonify({
                'is_saliency_started': False,
            })

        data = request.get_json()
        from_step = int(data['from_step'])
        to_step = int(data['to_step'])

        intensity = {'actor_intensity': 0, 'critic_intensity': 0, 'qfunc_intensity': 0}
        for key in intensity.keys():
            if key in data:
                intensity[key] = int(data[key])

        dispatch_saliency_job(rollout_id, from_step, to_step, intensity)

        return jsonify({
            'is_saliency_started': True,
        })
