import { combineReducers } from 'redux';

import log from './log';
import plotRange from './plotRange';
import saliencyRange from './saliencyRange';
import globalInfo from './globalInfo';

const rootReducer = combineReducers({
  log,
  plotRange,
  saliencyRange,
  globalInfo,
});

export default rootReducer;
