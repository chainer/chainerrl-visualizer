import { combineReducers } from 'redux';

import { SUCCESS_FETCH_AGENT_TYPE } from '../actions';

const containsRecurrentModel = (state, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_TYPE:
      return action.containsRecurrentModel;
    default:
      return state;
  }
};

const stateValueReturned = (state, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_TYPE:
      return action.stateValueReturned;
    default:
      return state;
  }
};

const distributionType = (state, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_TYPE:
      return action.distributionType;
    default:
      return state;
  }
};

const actionValueType = (state, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_TYPE:
      return action.actionValueType;
    default:
      return state;
  }
};

const agentType = combineReducers({
  containsRecurrentModel,
  stateValueReturned,
  distributionType,
  actionValueType,
});

export default agentType;
