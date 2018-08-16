export const REQUEST_ROLLOUT = 'REQUEST_ROLLOUT';
export const START_GET_LOG = 'START_GET_LOG';
export const SUCCESS_GET_LOG = 'SUCCESS_GET_LOG';

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
