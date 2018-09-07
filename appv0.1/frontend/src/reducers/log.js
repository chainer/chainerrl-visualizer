import { SUCCESS_FETCH_LOG } from '../actions';

const initialLog = {
  logDataRows: [],
  logLastUpdated: null,
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

      if (nowLogUpdated.getTime() < nextLogUpdated.getTime()) {
        return Object.assign({}, state, {
          logDataRows: action.logDataRows,
          logLastUpdated: action.logLastUpdated,
        });
      }

      return state;
    }
    default:
      return state;
  }
};


export default log;
