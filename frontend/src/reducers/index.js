import { combineReducers } from 'redux';

import log from './log';
import plotRange from './plotRange';
import saliencyRange from './saliencyRange';
import serverState from './serverState';

const rootReducer = combineReducers({
  log,
  plotRange,
  saliencyRange,
  serverState,
});

export default rootReducer;
