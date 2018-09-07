import {
  fork, take, call, put,
} from 'redux-saga/effects';

import { CLICK_ROLLOUT, receiveRolloutResponse } from '../actions';
import { postRollout } from '../services';

function* requestRolloutFlow() {
  while (true) {
    yield take(CLICK_ROLLOUT);
    const { rolloutPath, isRolloutStarted } = yield call(postRollout);
    yield put(receiveRolloutResponse(rolloutPath, isRolloutStarted));
  }
}

function* rootSaga() {
  yield fork(requestRolloutFlow);
}

export default rootSaga;
