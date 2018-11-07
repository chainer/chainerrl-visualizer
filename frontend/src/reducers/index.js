import { combineReducers } from 'redux';

import log from './log';
import plotRange from './plotRange';
import saliencyRange from './saliencyRange';
import serverState from './serverState';
import agentProfile from './agentProfile';
import settings from './settings';
import chartControl from './chartControl';

const rootReducer = combineReducers({
  agentProfile,
  chartControl,
  log,
  plotRange,
  saliencyRange,
  serverState,
  settings,
});

export default rootReducer;
