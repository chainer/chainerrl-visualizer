import { combineReducers } from 'redux';

import {
  SUCCESS_FETCH_SERVER_STATE,
  SUCCESS_FETCH_AGENT_PROFILE,
  CHANGE_DISPLAYED_CHART,
  TOGGLE_ACTION_DIMENSION_SELECT,
} from '../actions';
import { mapAgentProfileToChartList } from '../settings';

const selectedChartName = (state = '', action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      if (state) {
        return state;
      }

      return mapAgentProfileToChartList(action)[0];
    case CHANGE_DISPLAYED_CHART:
      return action.chartName;
    default:
      return state;
  }
};

// Used for policy network
const selectedActionDimensionIndices = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      if (state.length !== 0) {
        return state;
      }

      return [0];
    case TOGGLE_ACTION_DIMENSION_SELECT: {
      if (state.length === 1 && state[0] === action.actionIdx) {
        return state;
      }

      const nextState = state.slice();

      if (state.includes(action.actionIdx)) {
        nextState.splice(nextState.indexOf(action.actionIdx), 1);
      } else {
        nextState.push(action.actionIdx);
      }

      return nextState;
    }
    default:
      return state;
  }
};

const chartControl = combineReducers({
  selectedChartName,
  selectedActionDimensionIndices,
});

export default chartControl;
