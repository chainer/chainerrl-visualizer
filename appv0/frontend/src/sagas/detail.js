import {
  fork, take, call, put,
} from 'redux-saga/effects';
import { START_FETCH_EXPERIMENT, successFetchExperiment } from '../actions';
import { getExperiment } from '../services';

function* fetchExperimentFlow() {
  const { projectId, experimentId } = yield take(START_FETCH_EXPERIMENT);
  const experiment = yield call(getExperiment, projectId, experimentId);
  yield put(successFetchExperiment(experiment));
}

function* detailSaga() {
  yield fork(fetchExperimentFlow);
}

export default detailSaga;
