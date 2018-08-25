import { combineReducers } from 'redux';
import {
  SUCCESS_FETCH_PROJECTS, SUCCESS_FETCH_EXPERIMENTS, SUCCESS_GET_LOG, CHAGNE_SLICE_RIGHT, CHANGE_SLICE_LEFT, CHANGE_X_FOCUS, CHANGE_LEFT_Y_AXIS,
} from '../actions';

const projects = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_PROJECTS:
      return action.projects;
    default:
      return state;
  }
};

const experiments = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_EXPERIMENTS:
      return action.experiments;
    default:
      return state;
  }
};

const log = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_GET_LOG:
      return action.log;
    default:
      return state;
  }
};

const leftYAxis = (state = '', action) => {
  switch (action.type) {
    case CHANGE_LEFT_Y_AXIS:
      return action.key;
    case SUCCESS_FETCH_EXPERIMENTS:
      if (action.experiments.length > 0 && action.experiments[0].log.length > 0) {
        return Object.keys(action.experiments[0].log[0])[0];
      }

      return state;
    default:
      return state;
  }
};

const sliceLeft = (state = 0, action) => {
  switch (action.type) {
    case CHANGE_SLICE_LEFT:
      return action.idx;
    case SUCCESS_GET_LOG:
      return 0;
    default:
      return state;
  }
};

const sliceRight = (state = 0, action) => {
  switch (action.type) {
    case CHAGNE_SLICE_RIGHT:
      return action.idx;
    case SUCCESS_GET_LOG:
      return action.log.length - 1;
    default:
      return state;
  }
};

const xFocus = (state = 0, action) => {
  switch (action.type) {
    case CHANGE_X_FOCUS:
      if (action.x === undefined) {
        return 0;
      }

      return action.x;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  projects,
  experiments,
  log,
  leftYAxis,
  sliceLeft,
  sliceRight,
  xFocus,
});

export default rootReducer;
