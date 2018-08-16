import { combineReducers } from 'redux';
import { SUCCESS_GET_LOG } from '../actions';

const log = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_GET_LOG:
      return action.log;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  log,
});

export default rootReducer;
