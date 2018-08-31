import {
  fork, take, call, put,
} from 'redux-saga/effects';
import { successFetchExperiments, START_FETCH_EXPERIMENTS } from '../actions';
import { getExperimentsList } from '../services';


function* fetchExperimentsFlow() {
  const action = yield take(START_FETCH_EXPERIMENTS);
  const { projectId } = action;

  const experiments = yield call(getExperimentsList, projectId);

  yield put(successFetchExperiments(experiments));
}

function* experimentsSaga() {
  yield fork(fetchExperimentsFlow);
}

export default experimentsSaga;
