import {
  fork, take, call, put,
} from 'redux-saga/effects';

import { getRolloutLog } from '../services';
import {
  successGetLog, START_GET_LOG,
} from '../actions';
import projectsSaga from './projects';
import experimentsSaga from './experiments';
import detailSaga from './detail';

function* getLogFlow() {
  const action = yield take(START_GET_LOG);
  const { rolloutLogPath } = action;

  const log = yield call(getRolloutLog, rolloutLogPath);

  yield put(successGetLog(log));
}

function* rootSaga() {
  yield fork(projectsSaga);
  yield fork(experimentsSaga);
  yield fork(detailSaga);

  yield fork(getLogFlow);
}

export default rootSaga;
