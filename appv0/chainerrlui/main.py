import argparse
import os
import errno
import signal
import gevent
from gevent.pywsgi import WSGIServer
from flask import Flask
from flask import render_template, request, send_file
from alembic.config import Config
from alembic.command import upgrade

from chainerrlui.views.experiment import ExperimentAPI
from chainerrlui.views.project import ProjectAPI
from chainerrlui.views.rollout import RolloutAPI
from chainerrlui.views.rollout_log import RolloutLogAPI
from chainerrlui.views.saliency import SaliencyAPI
from chainerrlui.model.project import Project
from chainerrlui import DB_DIR, PACKAGE_DIR, DB_FILE_PATH
from chainerrlui import DB_SESSION


def create_app():
    app = Flask(__name__)

    @app.route("/")
    @app.route("/projects/<int:project_id>")
    @app.route("/projects/<int:project_id>/experiments/<int:experiment_id>")
    def index(**kwargs):
        return render_template("index.html")

    app.add_url_rule(
        "/api/projects",
        defaults={"id": None},
        view_func=ProjectAPI.as_view("project_resource"),
        methods=["GET"],
    )

    experiment_resource = ExperimentAPI.as_view("experiment_resource")

    app.add_url_rule(
        "/api/projects/<int:project_id>/experiments",
        defaults={"id": None},
        view_func=experiment_resource,
        methods=["GET"],
    )

    app.add_url_rule(
        "/api/projects/<int:project_id>/experiments/<int:id>",
        view_func=experiment_resource,
        methods=["GET", "POST"]
    )

    app.add_url_rule(
        "/api/experiments/<int:experiment_id>/rollouts",
        view_func=RolloutAPI.as_view("rollout_resource"),
        methods=["POST"],
    )

    app.add_url_rule(
        "/api/rollout_logs",
        view_func=RolloutLogAPI.as_view("rollout_log_resource"),
        methods=["GET"],
    )

    app.add_url_rule(
        "/api/experiments/<int:experiment_id>/saliency",
        view_func=SaliencyAPI.as_view("saliency_resource"),
        methods=["POST"]
    )

    @app.route('/images')
    def get_image():
        filename = request.args.get("image_path")
        return send_file(filename, mimetype="image/image")

    return app


def create_db():
    try:
        os.makedirs(DB_DIR)
    except OSError as e:
        if e.errno == errno.EEXIST and os.path.isdir(DB_DIR):
            pass
        else:
            raise


def upgrade_db():
    if not os.path.isdir(DB_DIR):
        print("DB is not yet initialized. Please run `chainerrlui db create` command")
        return

    def get_migration_config():
        migration_conf = Config()
        migration_conf.set_main_option(
            "script_location", os.path.join(PACKAGE_DIR, "migration")
        )
        return migration_conf

    config = get_migration_config()
    upgrade(config, "head")


def handle_server(args):
    app = create_app()

    if args.debug:
        app.config["ENV"] = "development"
        app.run(host=args.host, port=args.port, debug=True, threaded=True)
    else:
        socket_address = "{:s}:{:d}".format(args.host, args.port)
        server = WSGIServer(socket_address, application=app)

        def stop_server():
            if server.started:
                server.stop()

        gevent.signal(signal.SIGTERM, stop_server)
        gevent.signal(signal.SIGINT, stop_server)

        try:
            server.serve_forever()
        except(KeyboardInterrupt, SystemExit):
            stop_server()


def handle_db(args):
    if args.type == "create":
        create_db()

    if args.type == "drop":
        if os.path.exists(DB_FILE_PATH):
            os.remove(DB_FILE_PATH)

    if args.type == "upgrade":
        upgrade_db()


def handle_project_create(args):
    project_path = os.path.abspath(args.project_dir)
    project_name = args.project_name

    if project_name is None:
        project_name = project_path

    agent_class = args.agent_class
    env_name = args.env_name

    project = DB_SESSION.query(Project).filter_by(path=project_path).first()

    if project is None:
        Project.create(path=project_path, name=project_name, agent_class=agent_class, env_name=env_name)
        print("Project named {} has created at %{} successfully!".format(project_name, project_name))
    else:
        print("Project already exists at {}".format(project_path))


def create_parser():
    parser = argparse.ArgumentParser(description="chainerrlui commands")
    subparsers = parser.add_subparsers()

    server_parser = subparsers.add_parser("server", help="See `chainerrlui server -h`")
    server_parser.add_argument("-H", "--host", help="host", default="localhost")
    server_parser.add_argument("-p", "--port", help="port", default=5001)
    server_parser.add_argument("-d", "--debug", action="store_true", help="debug mode for development")
    server_parser.set_defaults(handler=handle_server)

    db_parser = subparsers.add_parser("db", help="See `chainerrlui db -h`")
    db_parser.add_argument("type", choices=["create", "drop", "status", "upgrade", "revision"])
    db_parser.set_defaults(handler=handle_db)

    project_parser = subparsers.add_parser("project", help="See `chainerrlui project -h`")
    project_subparsers = project_parser.add_subparsers()

    project_create_parser = project_subparsers.add_parser("create", help="See `chainerrlui project create -h`")
    project_create_parser.add_argument("-d", "--project-dir", required=True, type=str, help="project directory")
    project_create_parser.add_argument("-n", "--project-name", type=str, help="project name", default=None)
    project_create_parser.add_argument("-a", "--agent-class", type=str, required=True, help="chainerrl agent class name")
    project_create_parser.add_argument("-e", "--env-name", type=str, required=True, help="atari environment name")
    project_create_parser.set_defaults(handler=handle_project_create)

    return parser


def main():
    parser = create_parser()
    args = parser.parse_args()

    if hasattr(args, "handler"):
        args.handler(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
