import { combineReducers } from 'redux';

import { SUCCESS_FETCH_GLOBAL_INFO, CLICK_ROLLOUT, CLICK_SALIENCY } from '../actions';

const agentType = (state = '', action) => {
  switch (action.type) {
    case SUCCESS_FETCH_GLOBAL_INFO:
      return action.agentType;
    default:
      return state;
  }
};

const isJobRunning = (state = false, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_GLOBAL_INFO:
      return action.isJobRunning;
    case CLICK_ROLLOUT:
      return true;
    case CLICK_SALIENCY:
      return true;
    default:
      return state;
  }
};

const isRolloutOnMemory = (state = false, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_GLOBAL_INFO:
      return action.isRolloutOnMemory;
    default:
      return state;
  }
};

const globalInfo = combineReducers({
  agentType,
  isJobRunning,
  isRolloutOnMemory,
});

export default globalInfo;
