import { fork, take, call } from 'redux-saga/effects';

import { postRollout } from '../services';
import { REQUEST_ROLLOUT } from '../actions';

function* requestRolloutFlow() {
  const action = yield take(REQUEST_ROLLOUT);
  const data = yield call(postRollout, action.resultPath, action.modelName, action.seed);
  console.log(data);
}

function* rootSaga() {
  yield fork(requestRolloutFlow);
}

export default rootSaga;
