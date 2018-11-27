import { combineReducers } from 'redux';

import {
  CHANGE_ACTOR_INTENSITY,
  CHANGE_CRITIC_INTENSITY,
  CHANGE_QFUNC_INTENSITY,
} from '../actions';

const MAX_INTENSITY = 100;
const MIN_INTENSITY = 0;

const actorIntensity = (state = 15, action) => {
  switch (action.type) {
    case CHANGE_ACTOR_INTENSITY:
      if (action.intensity < MIN_INTENSITY || action.intensity > MAX_INTENSITY) {
        return state;
      }

      return action.intensity;
    default:
      return state;
  }
};

const criticIntensity = (state = 5, action) => {
  switch (action.type) {
    case CHANGE_CRITIC_INTENSITY:
      if (action.intensity < MIN_INTENSITY || action.intensity > MAX_INTENSITY) {
        return state;
      }

      return action.intensity;
    default:
      return state;
  }
};

const qfuncIntensity = (state = 50, action) => {
  switch (action.type) {
    case CHANGE_QFUNC_INTENSITY:
      if (action.intensity < MIN_INTENSITY || action.intensity > MAX_INTENSITY) {
        return state;
      }

      return action.intensity;
    default:
      return state;
  }
};

const saliencyIntensity = combineReducers({
  actorIntensity,
  criticIntensity,
  qfuncIntensity,
});

export default saliencyIntensity;
