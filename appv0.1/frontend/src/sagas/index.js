import {
  fork, take, call, put, select,
} from 'redux-saga/effects';

import {
  CLICK_ROLLOUT, CLICK_SALIENCY, START_FETCH_LOG, START_FETCH_SERVER_STATE, receiveRolloutResponse, successFetchLog, successFetchServerState,
} from '../actions';
import {
  postRollout, postSaliency, getRolloutLog, getServerState,
} from '../services';

function* requestRolloutFlow() {
  while (true) {
    yield take(CLICK_ROLLOUT);

    const { serverState } = yield select();
    const { isJobRunning } = serverState;
    if (isJobRunning) continue;

    const { rolloutPath, isRolloutStarted } = yield call(postRollout);
    yield put(receiveRolloutResponse(rolloutPath, isRolloutStarted));
  }
}

function* requestSaliencyFlow() {
  while (true) {
    yield take(CLICK_SALIENCY);

    // Validate be capable of saliency process in job worker
    const { serverState } = yield select();
    const { isJobRunning, isRolloutOnMemory } = serverState;

    if (isJobRunning || !isRolloutOnMemory) continue;

    const { isSaliencyStarted } = yield call(postSaliency);

    // for debug
    if (isSaliencyStarted) {
      console.log('saliency started!');
    } else {
      console.log('saliency not started..');
    }
  }
}

function* fetchRolloutLogFlow() {
  while (true) {
    const { rolloutId } = yield take(START_FETCH_LOG);

    if (!rolloutId) {
      console.log('rolloutId has not been set...');
      continue;
    }

    const { logDataRows, logLastUpdated } = yield call(getRolloutLog, rolloutId);
    yield put(successFetchLog(logDataRows, logLastUpdated));
  }
}

function* fetchServerStateFlow() {
  while (true) {
    yield take(START_FETCH_SERVER_STATE);
    const { agentType, isJobRunning, isRolloutOnMemory } = yield call(getServerState);
    yield put(successFetchServerState(agentType, isJobRunning, isRolloutOnMemory));
  }
}

function* rootSaga() {
  yield fork(requestRolloutFlow);
  yield fork(requestSaliencyFlow);
  yield fork(fetchRolloutLogFlow);
  yield fork(fetchServerStateFlow);
}

export default rootSaga;
