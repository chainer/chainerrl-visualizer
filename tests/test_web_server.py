import datetime
import json
from mock import MagicMock
from mock import patch
import os

import pytest

from chainerrl_visualizer.server_tasks.rollout_ids import timestamp_format
from chainerrl_visualizer.views.rollout import ROLLOUT_LOGFILE_NAME
from chainerrl_visualizer.web_server import create_app
from chainerrl_visualizer.web_server import web_server


def test_web_server_debug(tmpdir):
    agent, gymlike_env = MagicMock(), MagicMock()
    profile, action_meanings, raw_image_input = {}, {}, {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    host = 'localhost'
    port = 5002

    mock_app = MagicMock()
    mock_app_creator = MagicMock(return_value=mock_app)
    with patch('werkzeug.serving.run_simple', MagicMock()) as f, \
            patch('chainerrl_visualizer.web_server.create_app', mock_app_creator):
        web_server(
            agent, gymlike_env, profile, tmpdir, host, port, action_meanings, raw_image_input,
            job_queue, is_job_running, is_rollout_on_memory, True)
        assert mock_app.debug
        f.assert_called_once()
        f.assert_called_with(
            host, port, mock_app, use_reloader=False, use_debugger=True, threaded=True)


def test_web_server_production(tmpdir):
    agent, gymlike_env = MagicMock(), MagicMock()
    profile, action_meanings, raw_image_input = {}, {}, {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    host = 'localhost'
    port = 5002

    mock_app = MagicMock()
    mock_app_creator = MagicMock(return_value=mock_app)
    mock_server = MagicMock()
    mock_server_init = MagicMock(return_value=mock_server)
    with patch('gevent.pywsgi.WSGIServer', mock_server_init), \
            patch('chainerrl_visualizer.web_server.create_app', mock_app_creator):
        web_server(
            agent, gymlike_env, profile, tmpdir, host, port, action_meanings, raw_image_input,
            job_queue, is_job_running, is_rollout_on_memory, False)
        mock_server.serve_forever.assert_called_once()


@pytest.fixture(scope='function')
def clicreator():
    agent, gymlike_env = MagicMock(), MagicMock()

    def _create_app(
            profile, log_dir, action_meanings, raw_image_input, job_queue, is_job_running,
            is_rollout_on_memory):
        app = create_app(
            agent, gymlike_env, profile, log_dir, action_meanings, raw_image_input, job_queue,
            is_job_running, is_rollout_on_memory)
        app.testing = True
        return app.test_client()
    return _create_app


def assert_resp_and_get_json_data(resp, status_code=200):
    assert resp.status_code == status_code
    data_body = resp.data.decode()
    try:
        data = json.loads(data_body)
    except json.decoder.JSONDecodeError:
        data = None
    return data


def test_api_get_server_state(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()
    is_job_running.value = True
    is_rollout_on_memory.value = False

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    resp = client.get('/api/server_state')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert data['is_job_running']
    assert not data['is_rollout_on_memory']


def test_api_get_agent_profile(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {'dummy': 'image'}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    resp = client.get('/api/agent_profile')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 3
    assert data['agent_type'] == 'MagicMock'
    assert len(data['action_meanings']) == 2  # skip value check
    assert len(data['raw_image_input']) == 1


def test_api_get_rollouts_all(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    # empty
    os.makedirs(os.path.join(tmpdir, 'rollouts'))
    resp = client.get('/api/rollouts')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 1
    assert not data['rollout_ids']

    # set 3 rollouts
    for _ in range(3):
        rollout_id = datetime.datetime.strftime(datetime.datetime.now(), timestamp_format)
        os.makedirs(os.path.join(tmpdir, 'rollouts', rollout_id))
    resp = client.get('/api/rollouts')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 1
    assert data['rollout_ids'][-1] == rollout_id


def test_api_get_rollouts_latest(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    # empty
    rollout_root = os.path.join(tmpdir, 'rollouts')
    os.makedirs(rollout_root)
    resp = client.get('/api/rollouts?q=latest')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert not data['rollout_id']
    assert not data['rollout_path']

    # set 3 rollouts
    for _ in range(3):
        rollout_id = datetime.datetime.strftime(datetime.datetime.now(), timestamp_format)
        rollout_path = os.path.join(rollout_root, rollout_id)
        os.makedirs(rollout_path)
    resp = client.get('/api/rollouts?q=latest')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert data['rollout_id'] == rollout_id
    assert data['rollout_path'] == rollout_path


def test_api_get_rollouts_id(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue, is_job_running, is_rollout_on_memory = MagicMock(), MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    # empty
    rollout_id = datetime.datetime.strftime(datetime.datetime.now(), timestamp_format)
    rollout_path = os.path.join(tmpdir, 'rollouts', rollout_id)
    os.makedirs(rollout_path)
    resp = client.get('/api/rollouts/' + rollout_id)
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert not data['rollout_log']
    assert not data['last_updated']

    # set dummy file
    lines = (os.linesep).join([json.dumps({'step': 1}), json.dumps({'step': 2})])
    with open(os.path.join(rollout_path, ROLLOUT_LOGFILE_NAME), 'w') as f:
        f.write(lines)
    resp = client.get('/api/rollouts/' + rollout_id)
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert len(data['rollout_log']) == 2
    assert data['last_updated']


class JobQueue(object):
    def __init__(self):
        self.value = None

    def put(self, values):
        self.value = values


def test_api_post_rollouts(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue = JobQueue()
    is_job_running, is_rollout_on_memory = MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    is_job_running.value = True
    resp = client.post('/api/rollouts', data=None, content_type='application/json')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert not data['rollout_path']
    assert not data['is_rollout_started']

    is_job_running.value = False
    req = {'step_count': 99}
    resp = client.post('/api/rollouts', data=json.dumps(req), content_type='application/json')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 2
    assert os.path.exists(data['rollout_path'])
    assert os.path.exists(os.path.join(data['rollout_path'], 'images'))
    assert data['is_rollout_started']
    # if dispatch_rollout_job process could be complicated, should be separated
    assert job_queue.value
    assert job_queue.value['type'] == 'ROLLOUT'
    assert job_queue.value['data']
    assert job_queue.value['data']['rollout_dir'] == data['rollout_path']
    assert job_queue.value['data']['rollout_id'] == os.path.basename(data['rollout_path'])
    assert job_queue.value['data']['step_count'] == 99


def test_api_get_rollouts_saliency(tmpdir, clicreator):
    profile = {}
    action_meanings = {0: 'RIGHT', 1: 'LEFT'}
    raw_image_input = {}
    job_queue = JobQueue()
    is_job_running, is_rollout_on_memory = MagicMock(), MagicMock()

    client = clicreator(
        profile, tmpdir, action_meanings, raw_image_input, job_queue, is_job_running,
        is_rollout_on_memory)

    rollout_id = datetime.datetime.strftime(datetime.datetime.now(), timestamp_format)
    saliency_url = '/api/rollouts/{}/saliency'.format(rollout_id)

    is_job_running.value = True
    is_rollout_on_memory.value = True
    resp = client.post(saliency_url, data=None, content_type='application/json')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 1
    assert not data['is_saliency_started']

    is_job_running.value = False
    is_rollout_on_memory.value = False
    resp = client.post(saliency_url, data=None, content_type='application/json')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 1
    assert not data['is_saliency_started']

    is_job_running.value = False
    is_rollout_on_memory.value = True
    req = {'from_step': 10, 'to_step': 99, 'actor_intensity': 1}
    resp = client.post(saliency_url, data=json.dumps(req), content_type='application/json')
    data = assert_resp_and_get_json_data(resp)
    assert data
    assert len(data) == 1
    assert data['is_saliency_started']
    # if dispatch_saliency_job process could be complicated, should be separated
    assert job_queue.value
    assert job_queue.value['type'] == 'SALIENCY'
    assert job_queue.value['data']
    assert job_queue.value['data']['rollout_id'] == rollout_id
    assert job_queue.value['data']['rollout_dir'] == os.path.join(tmpdir, 'rollouts', rollout_id)
    assert job_queue.value['data']['from_step'] == 10
    assert job_queue.value['data']['to_step'] == 99
    assert job_queue.value['data']['intensity']
    assert job_queue.value['data']['intensity']['actor_intensity'] == 1
