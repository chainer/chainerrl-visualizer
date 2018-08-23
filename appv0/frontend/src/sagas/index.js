import {
  fork, take, call, put,
} from 'redux-saga/effects';

import { postRollout, getRolloutLog } from '../services';
import {
  successGetLog, startGetLog, REQUEST_ROLLOUT, START_GET_LOG,
} from '../actions';
import projectsSaga from './projects';


function* requestRolloutFlow() {
  const action = yield take(REQUEST_ROLLOUT);
  const resultPath = yield call(postRollout, action.resultPath, action.modelName, action.seed);

  yield put(startGetLog, resultPath);
}

function* getLogFlow() {
  const action = yield take(START_GET_LOG);
  const { resultPath } = action;

  const log = yield call(getRolloutLog, resultPath);

  yield put(successGetLog(log));
}

function* rootSaga() {
  yield fork(projectsSaga);

  yield fork(requestRolloutFlow);
  yield fork(getLogFlow);
}

export default rootSaga;
