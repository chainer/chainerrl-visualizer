export const REQUEST_ROLLOUT = 'REQUEST_ROLLOUT';

export const requestRollout = (resultPath, modelName, seed) => ({
  type: REQUEST_ROLLOUT,
  resultPath,
  modelName,
  seed,
});
