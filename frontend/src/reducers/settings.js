import { combineReducers } from 'redux';

import {
  SUCCESS_FETCH_AGENT_PROFILE,
} from '../actions';

const distinctColors = require('distinct-colors');

const actionMeanings = (state = {}, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE:
      if (Object.keys(action.actionMeanings).length === Object.keys(state).length) {
        return state;
      }

      return action.actionMeanings;
    default:
      return state;
  }
};

const actionColors = (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_AGENT_PROFILE: {
      if (Object.keys(action.actionMeanings).length === state.length) {
        return state;
      }

      return distinctColors({ count: Object.values(action.actionMeanings).length, lightMin: 30 }).map((color) => (color.css()));
    }
    default:
      return state;
  }
};

const settings = combineReducers({
  actionMeanings,
  actionColors,
});

export default settings;
