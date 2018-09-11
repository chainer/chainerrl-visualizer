import { combineReducers } from 'redux';

import {
  SUCCESS_FETCH_SERVER_STATE, CLICK_ROLLOUT, CLICK_SALIENCY,
} from '../actions';

const agentType = (state = '', action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      return action.agentType;
    default:
      return state;
  }
};

const actionMeanings = (state = {}, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      return action.actionMeanings;
    default:
      return state;
  }
};

const isJobRunning = (state = true, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
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
    case SUCCESS_FETCH_SERVER_STATE:
      return action.isRolloutOnMemory;
    default:
      return state;
  }
};

const serverState = combineReducers({
  agentType,
  actionMeanings,
  isJobRunning,
  isRolloutOnMemory,
});

export default serverState;
