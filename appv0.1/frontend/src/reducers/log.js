import { RECEIVE_ROLLOUT_RESPONSE, SUCCESS_FETCH_LOG } from '../actions';

const initialLog = {
  logDataRows: [],
  logLastUpdated: null,
  rolloutPath: '',
};

const log = (state = initialLog, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_LOG: {
      if (state.logLastUpdated === null) {
        return Object.assign({}, state, {
          logDataRows: action.logDataRows,
          logLastUpdated: action.logLastUpdated,
        });
      }

      const nowLogUpdated = new Date();
      nowLogUpdated.setISO8601(state.logLastUpdated); // See utils/date_parser.js
      const nextLogUpdated = new Date();
      nextLogUpdated.setISO8601(action.logLastUpdated);

      console.log(nowLogUpdated);
      console.log(nextLogUpdated);

      if (nowLogUpdated.getTime() < nextLogUpdated.getTime()) {
        return Object.assign({}, state, {
          logDataRows: action.logDataRows,
          logLastUpdated: action.logLastUpdated,
        });
      }

      return state;
    }
    case RECEIVE_ROLLOUT_RESPONSE:
      if (action.isRolloutStarted) {
        return Object.assign({}, state, {
          rolloutPath: action.rolloutPath,
        });
      }

      return state;
    default:
      return state;
  }
};


export default log;
