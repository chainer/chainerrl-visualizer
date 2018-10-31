import { combineReducers } from 'redux';

import { SUCCESS_FETCH_AGENT_PROFILE } from '../actions';

const containsRecurrentModel = (state = false, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      return action.containsRecurrentModel;
    default:
      return state;
  }
};

const stateValueReturned = (state = false, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      return action.stateValueReturned;
    default:
      return state;
  }
};

const distributionType = (state = null, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      return action.distributionType;
    default:
      return state;
  }
};

const actionValueType = (state = null, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      return action.actionValueType;
    default:
      return state;
  }
};

const agentProfile = combineReducers({
  containsRecurrentModel,
  stateValueReturned,
  distributionType,
  actionValueType,
});

export default agentProfile;
