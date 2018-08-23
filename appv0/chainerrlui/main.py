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
from chainerrlui import DB_DIR, PACKAGE_DIR, DB_FILE_PATH


def create_app():
    app = Flask(__name__)

    @app.route("/")
    @app.route("/projects/<int:project_id>")
    @app.route("/projects/<int:project_id>/experiments/<int:experiment_id>")
    def index(**kwargs):
        return render_template("index.html")

    app.add_url_rule(
        "/api/projects/<int:project_id>/experiments/<int:id>",
        view_func=ExperimentAPI.as_view('experiment_resource'),
        methods=["GET", "POST"]
    )

    @app.route('/images')
    def get_image():
        result_path = "/Users/sykwer/work/i18-sykwer/experiments/visualize_atari/results/211288/20180804T155228.325999"
        filename = result_path + "/rollout/images/step" + request.args.get("step") + ".png"
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
            "script_location", os.path.join(PACKAGE_DIR, "alembic")
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
