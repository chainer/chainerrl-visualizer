import argparse
import signal
import gevent
from gevent.pywsgi import WSGIServer
from flask import Flask
from flask import render_template, request, send_file

from chainerrlui.views.experiment import ExperimentAPI


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


def create_parser():
    parser = argparse.ArgumentParser(description="chainerrlui commands")
    subparsers = parser.add_subparsers()

    server_parser = subparsers.add_parser("server", help="See `chainerrlui server -h`")
    server_parser.add_argument("-H", "--host", help="host", default="localhost")
    server_parser.add_argument("-p", "--port", help="port", default=5001)
    server_parser.add_argument("-d", "--debug", action="store_true", help="debug mode for development")
    server_parser.set_defaults(handler=handle_server)

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
