import {
  fork, take, call, put,
} from 'redux-saga/effects';

import {
  START_FETCH_PROJECTS, START_SALIENCY, successFetchProjects, successSaliency,
} from '../actions';
import { getProjectsList, postSaliency } from '../services';

function* fetchProjectsFlow() {
  yield take(START_FETCH_PROJECTS);
  const projects = yield call(getProjectsList);
  yield put(successFetchProjects(projects));
}

function* requestSaliencyFlow() {
  while (true) {
    const {
      experimentId, fromStep, toStep, seed,
    } = yield take(START_SALIENCY);
    const imagePaths = yield call(postSaliency, experimentId, fromStep, toStep, seed);
    console.log(imagePaths);
    yield put(successSaliency(fromStep, toStep, imagePaths));
  }
}

function* projectsSaga() {
  yield fork(fetchProjectsFlow);
  yield fork(requestSaliencyFlow);
}

export default projectsSaga;
