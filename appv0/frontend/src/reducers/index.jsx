import { combineReducers } from 'redux';
import { SUCCESS_GET_LOG, CHAGNE_SLICE_RIGHT, CHANGE_SLICE_LEFT } from '../actions';

const log = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_GET_LOG:
      return action.log;
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

const rootReducer = combineReducers({
  log,
  sliceLeft,
  sliceRight,
});

export default rootReducer;
