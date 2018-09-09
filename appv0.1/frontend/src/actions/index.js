export const CLICK_ROLLOUT = 'CLICK_ROLLOUT';
export const RECEIVE_ROLLOUT_RESPONSE = 'RECEIVE_ROLLOUT_RESPONSE';
export const CLICK_SALIENCY = 'CLICK_SALIENCY';
export const CLICK_PREV_STEP = 'CLICK_PREV_STEP';
export const CLICK_NEXT_STEP = 'CLICK_NEXT_STEP';
export const HOVER_ON_STEP = 'HOVER_ON_STEP';

export const clickRollout = () => ({
  type: CLICK_ROLLOUT,
});

export const receiveRolloutResponse = (rolloutPath, isRolloutStarted) => ({
  type: RECEIVE_ROLLOUT_RESPONSE,
  rolloutPath,
  isRolloutStarted,
});

export const clickSaliency = (rolloutId, fromStep, toStep) => ({
  type: CLICK_SALIENCY,
  rolloutId,
  fromStep,
  toStep,
});

export const clickPrevStep = () => ({
  type: CLICK_PREV_STEP,
});

export const clickNextStep = () => ({
  type: CLICK_NEXT_STEP,
});

export const hoverOnStep = (step) => ({
  type: HOVER_ON_STEP,
  step,
});

export const CHANGE_PLOT_RANGE_LEFT = 'CHANGE_PLOT_RANGE_LEFT';
export const CHANGE_PLOT_RANGE_RIGHT = 'CHANGE_PLOT_RANGE_RIGHT';
export const CHANGE_SALIENCY_RANGE_LEFT = 'CHANGE_SALIENCY_RANGE_LEFT';
export const CHANGE_SALIENCY_RANGE_RIGHT = 'CHANGE_SALIENCY_RANGE_RIGHT';

export const changePlotRangeLeft = (step) => ({
  type: CHANGE_PLOT_RANGE_LEFT,
  step,
});

export const changePlotRangeRight = (step) => ({
  type: CHANGE_PLOT_RANGE_RIGHT,
  step,
});

export const changeSaliencyRangeLeft = (step) => ({
  type: CHANGE_SALIENCY_RANGE_LEFT,
  step,
});

export const changeSaliencyRangeRight = (step) => ({
  type: CHANGE_SALIENCY_RANGE_RIGHT,
  step,
});

export const START_FETCH_LOG = 'START_FETCH_LOG';
export const SUCCESS_FETCH_LOG = 'SUCCESS_FETCH_LOG';
export const START_FETCH_SERVER_STATE = 'START_FETCH_SERVER_STATE';
export const SUCCESS_FETCH_SERVER_STATE = 'SUCCESS_FETCH_SERVER_STATE'; // agentの種類, jobが現在走っているか, rolloutがメモリ上にあるか

export const startFetchLog = (rolloutId) => ({
  type: START_FETCH_LOG,
  rolloutId,
});

export const successFetchLog = (logDataRows, logLastUpdated) => ({
  type: SUCCESS_FETCH_LOG,
  logDataRows,
  logLastUpdated,
});

export const startFetchServerState = () => ({
  type: START_FETCH_SERVER_STATE,
});

export const successFetchServerState = (agentType, isJobRunning, isRolloutOnMemory) => ({
  type: SUCCESS_FETCH_SERVER_STATE,
  agentType,
  isJobRunning,
  isRolloutOnMemory,
});
