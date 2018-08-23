import {
  fork, take, call, put,
} from 'redux-saga/effects';

import { START_FETCH_PROJECTS, successFetchProjects } from '../actions';
import { getProjectsList } from '../services';

function* fetchProjectsFlow() {
  yield take(START_FETCH_PROJECTS);
  const projects = yield call(getProjectsList);
  yield put(successFetchProjects(projects));
}

function* projectsSaga() {
  yield fork(fetchProjectsFlow);
}

export default projectsSaga;
