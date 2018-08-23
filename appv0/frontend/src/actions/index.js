export const START_FETCH_PROJECTS = 'START_FETCH_PROJECTS';
export const SUCCESS_FETCH_PROJECTS = 'SUCCESS_FETCH_PROJECTS';

export const startFetchProjects = () => ({
  type: START_FETCH_PROJECTS,
});

export const successFetchProjects = (projects) => ({
  type: SUCCESS_FETCH_PROJECTS,
  projects,
});

export const REQUEST_ROLLOUT = 'REQUEST_ROLLOUT';
export const START_GET_LOG = 'START_GET_LOG';
export const SUCCESS_GET_LOG = 'SUCCESS_GET_LOG';
export const CHANGE_SLICE_LEFT = 'CHANGE_SLICE_LEFT';
export const CHAGNE_SLICE_RIGHT = 'CHANGE_SLICE_RIGHT';
export const CHANGE_X_FOCUS = 'CHANGE_X_FOCUS';

export const requestRollout = (resultPath, modelName, seed) => ({
  type: REQUEST_ROLLOUT,
  resultPath,
  modelName,
  seed,
});

export const successGetLog = (log) => ({
  type: SUCCESS_GET_LOG,
  log,
});

export const startGetLog = (resultPath) => ({
  type: START_GET_LOG,
  resultPath,
});

export const changeSliceLeft = (idx) => ({
  type: CHANGE_SLICE_LEFT,
  idx,
});

export const changeSliceRight = (idx) => ({
  type: CHAGNE_SLICE_RIGHT,
  idx,
});

export const changeXFocus = (x) => ({
  type: CHANGE_X_FOCUS,
  x,
});
