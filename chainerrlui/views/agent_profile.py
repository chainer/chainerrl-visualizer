from flask.views import MethodView
from flask import jsonify, current_app


class AgentProfileAPI(MethodView):
    def get(self):
        profile = current_app.profile
        return jsonify(profile)
