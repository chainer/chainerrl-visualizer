from flask.views import MethodView
from flask import jsonify, current_app


class ServerStateAPI(MethodView):
    def get(self):
        return jsonify({
            'agent_type': type(current_app.agent).__name__,
            'is_job_running': current_app.is_job_running.value,
            'is_rollout_on_memory': current_app.is_rollout_on_memory.value,
        })
