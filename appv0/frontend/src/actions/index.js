export const START_FETCH_PROJECTS = 'START_FETCH_PROJECTS';
export const SUCCESS_FETCH_PROJECTS = 'SUCCESS_FETCH_PROJECTS';

export const startFetchProjects = () => ({
  type: START_FETCH_PROJECTS,
});

export const successFetchProjects = (projects) => ({
  type: SUCCESS_FETCH_PROJECTS,
  projects,
});

export const START_FETCH_EXPERIMENTS = 'START_FETCH_EXPERIMENTS';
export const SUCCESS_FETCH_EXPERIMENTS = 'SUCCESS_FETCH_EXPERIMENTS';
export const CHANGE_LEFT_Y_AXIS = 'CHANGE_LEFT_Y_AXIS';

export const startFetchExperiments = (projectId) => ({
  type: START_FETCH_EXPERIMENTS,
  projectId,
});

export const successFetchExperiments = (experiments) => ({
  type: SUCCESS_FETCH_EXPERIMENTS,
  experiments,
});

export const changeLeftYAxis = (key) => ({
  type: CHANGE_LEFT_Y_AXIS,
  key,
});

export const START_FETCH_EXPERIMENT = 'START_FETCH_EXPERIMENT';
export const SUCCESS_FETCH_EXPERIMENT = 'SUCCESS_FETCH_EXPERIMENT';
export const REQUEST_ROLLOUT = 'REQUEST_ROLLOUT';
export const SUCCESS_ROLLOUT = 'SUCCESS_ROLLOUT';
export const START_GET_LOG = 'START_GET_LOG';
export const SUCCESS_GET_LOG = 'SUCCESS_GET_LOG';
export const FOCUS_PREV_STEP = 'FOCUS_PREV_STEP';
export const FOCUS_NEXT_STEP = 'FOCUS_NEXT_STEP';

export const startFetchExperiment = (projectId, experimentId) => ({
  type: START_FETCH_EXPERIMENT,
  projectId,
  experimentId,
});

export const successFetchExperiment = (experiment) => ({
  type: SUCCESS_FETCH_EXPERIMENT,
  experiment,
});

export const requestRollout = (experiment) => ({
  type: REQUEST_ROLLOUT,
  experimentId: experiment.id,
  envName: experiment.env_name,
  agentClass: experiment.agent_class,
  seed: experiment.args.seed,
});

export const successRollout = (rolloutDir) => ({
  type: SUCCESS_ROLLOUT,
  rolloutDir,
});

export const startGetLog = (rolloutLogPath) => ({
  type: START_GET_LOG,
  rolloutLogPath,
});

export const successGetLog = (log) => ({
  type: SUCCESS_GET_LOG,
  log,
});

export const CHANGE_SLICE_LEFT = 'CHANGE_SLICE_LEFT';
export const CHAGNE_SLICE_RIGHT = 'CHANGE_SLICE_RIGHT';
export const CHANGE_X_FOCUS = 'CHANGE_X_FOCUS';

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

export const focusPrevStep = () => ({
  type: FOCUS_PREV_STEP,
});

export const focusNextStep = () => ({
  type: FOCUS_NEXT_STEP,
});
