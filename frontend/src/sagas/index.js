import {
  fork, take, call, put, select,
} from 'redux-saga/effects';

import {
  CLICK_ROLLOUT,
  CLICK_SALIENCY,
  START_FETCH_LOG,
  START_FETCH_SERVER_STATE,
  START_FETCH_LATEST_LOG_INFO,
  START_FETCH_AGENT_PROFILE,
  receiveRolloutResponse,
  successFetchLog,
  successFetchServerState,
  successFetchLatestLogInfo,
  successFetchAgentProfile,
} from '../actions';

import {
  postRollout, postSaliency, getRolloutLog, getServerState, getLatestLogInfo, getAgentProfile,
} from '../services';

function* requestRolloutFlow() {
  while (true) {
    yield take(CLICK_ROLLOUT);
    const { rolloutPath, isRolloutStarted } = yield call(postRollout);
    yield put(receiveRolloutResponse(rolloutPath, isRolloutStarted));
  }
}

function* requestSaliencyFlow() {
  while (true) {
    const { rolloutId, fromStep, toStep } = yield take(CLICK_SALIENCY);

    yield call(postSaliency, rolloutId, fromStep, toStep);
  }
}

function* fetchRolloutLogFlow() {
  while (true) {
    const { rolloutId } = yield take(START_FETCH_LOG);

    if (!rolloutId) {
      continue;
    }

    const { logDataRows, logLastUpdated } = yield call(getRolloutLog, rolloutId);

    const { log } = yield select();
    const prevLogLastUpdated = log.logLastUpdated;
    if (prevLogLastUpdated === null || new Date(prevLogLastUpdated) < new Date(logLastUpdated)) {
      yield put(successFetchLog(logDataRows, logLastUpdated));
    }
  }
}

function* fetchServerStateFlow() {
  while (true) {
    yield take(START_FETCH_SERVER_STATE);
    const {
      isJobRunning, isRolloutOnMemory,
    } = yield call(getServerState);
    yield put(successFetchServerState(isJobRunning, isRolloutOnMemory));
  }
}

function* fetchLatestLogInfoFlow() {
  while (true) {
    yield take(START_FETCH_LATEST_LOG_INFO);
    const { rolloutPath } = yield call(getLatestLogInfo);
    yield put(successFetchLatestLogInfo(rolloutPath));
  }
}

function* fetchAgentProfileFlow() {
  while (true) {
    yield take(START_FETCH_AGENT_PROFILE);
    const agentProfile = yield call(getAgentProfile);
    yield put(successFetchAgentProfile(agentProfile));
  }
}

function* rootSaga() {
  yield fork(requestRolloutFlow);
  yield fork(requestSaliencyFlow);
  yield fork(fetchRolloutLogFlow);
  yield fork(fetchServerStateFlow);
  yield fork(fetchLatestLogInfoFlow);
  yield fork(fetchAgentProfileFlow);
}

export default rootSaga;
