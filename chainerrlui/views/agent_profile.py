from flask.views import MethodView
from flask import jsonify, current_app


class AgentProfileAPI(MethodView):
    def get(self):
        profile = current_app.profile
        profile = profile.copy()
        profile.update({
            'agent_type': type(current_app.agent).__name__,
        })
        return jsonify(profile)
