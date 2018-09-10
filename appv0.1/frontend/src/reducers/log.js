import { RECEIVE_ROLLOUT_RESPONSE, SUCCESS_FETCH_LOG, SUCCESS_FETCH_LATEST_LOG_INFO } from '../actions';

const initialLog = {
  logDataRows: [],
  logLastUpdated: null,
  rolloutPath: '',
};

const log = (state = initialLog, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_LOG:
      return Object.assign({}, state, {
        logDataRows: action.logDataRows,
        logLastUpdated: action.logLastUpdated,
      });
    case RECEIVE_ROLLOUT_RESPONSE:
      if (action.isRolloutStarted) {
        return Object.assign({}, state, {
          rolloutPath: action.rolloutPath,
        });
      }

      return state;
    case SUCCESS_FETCH_LATEST_LOG_INFO:
      return Object.assign({}, state, {
        rolloutPath: action.rolloutPath,
      });
    default:
      return state;
  }
};


export default log;
