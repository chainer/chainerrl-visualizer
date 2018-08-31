import {
  fork, take, call, put,
} from 'redux-saga/effects';
import {
  START_FETCH_EXPERIMENT, REQUEST_ROLLOUT, successFetchExperiment, successRollout,
} from '../actions';
import { getExperiment, postRollout } from '../services';

function* fetchExperimentFlow() {
  const { projectId, experimentId } = yield take(START_FETCH_EXPERIMENT);
  const experiment = yield call(getExperiment, projectId, experimentId);
  yield put(successFetchExperiment(experiment));
}

function* requestRolloutFlow() {
  const action = yield take(REQUEST_ROLLOUT);
  const {
    experimentId, envName, agentClass, seed,
  } = action;

  const rolloutDir = yield call(postRollout, experimentId, envName, agentClass, seed);
  yield put(successRollout(rolloutDir));
}

function* detailSaga() {
  yield fork(fetchExperimentFlow);
  yield fork(requestRolloutFlow);
}

export default detailSaga;
