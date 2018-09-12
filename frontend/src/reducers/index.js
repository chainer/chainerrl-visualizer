import { combineReducers } from 'redux';

import log from './log';
import plotRange from './plotRange';
import saliencyRange from './saliencyRange';
import serverState from './serverState';

import { SUCCESS_FETCH_SERVER_STATE, CHANGE_DISPLAYED_CHART } from '../actions';
import { AGENT_TO_CHARTS } from '../settings/agent';

const selectedChartName = (state = '', action) => {
  switch (action.type) {
    case SUCCESS_FETCH_SERVER_STATE:
      if (state) {
        return state;
      }

      return AGENT_TO_CHARTS[action.agentType][0];
    case CHANGE_DISPLAYED_CHART:
      return action.chartName;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  log,
  plotRange,
  saliencyRange,
  serverState,
  selectedChartName,
});

export default rootReducer;
