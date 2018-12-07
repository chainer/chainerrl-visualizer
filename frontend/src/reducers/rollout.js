import { combineReducers } from 'redux';

import { CHANGE_ROLLOUT_STEP } from '../actions';

const MAX_ROLLOUT_STEP = 1800;
const MIN_ROLLOUT_STEP = 1;
const DEFAULT_ROLLOUT_STEP = 500;

const stepCount = (state = DEFAULT_ROLLOUT_STEP, action) => {
  switch (action.type) {
    case CHANGE_ROLLOUT_STEP:
      if (!action.rolloutStep) return 0;
      if (action.rolloutStep > MAX_ROLLOUT_STEP) return state;
      if (action.rolloutStep < MIN_ROLLOUT_STEP) return state;
      return action.rolloutStep;
    default:
      return state;
  }
};

export default combineReducers({
  stepCount,
});
