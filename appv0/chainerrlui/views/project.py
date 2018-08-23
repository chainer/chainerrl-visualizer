from flask.views import MethodView
from flask import jsonify

from chainerrlui.model.project import Project
from chainerrlui import DB_SESSION


class ProjectAPI(MethodView):
    def get(self, id=None):
        if id is None:
            projects = DB_SESSION.query(Project).all()
            return jsonify({
                "projects": [project.serialize for project in projects],
            })
