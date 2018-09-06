from flask.views import MethodView
from flask import request, jsonify

from chainerrlui.job_dispatchers import dispatch_saliency_job


class SaliencyAPI(MethodView):
    def post(self, rollout_id=None):
        data = request.get_json()
        from_step = int(data['from_step'])
        to_step = int(data['to_step'])

        dispatch_saliency_job(rollout_id, from_step, to_step)

        return jsonify({
            'some_key': 'some_value',
        })
