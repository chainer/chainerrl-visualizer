import { CHANGE_SALIENCY_RANGE_LEFT, CHANGE_SALIENCY_RANGE_RIGHT, SUCCESS_FETCH_LOG } from '../actions';

const initialSaliencyRange = {
  saliencyRangeLeft: 0,
  saliencyRangeRight: 0,
  logLength: 0,
};

const saliencyRange = (state = initialSaliencyRange, action) => {
  switch (action.type) {
    case CHANGE_SALIENCY_RANGE_LEFT:
      if (action.step < 0 || action.step > state.saliencyRangeRight) {
        return state;
      }

      return Object.assign({}, state, {
        saliencyRangeLeft: action.step,
      });
    case CHANGE_SALIENCY_RANGE_RIGHT:
      if (action.step > state.logLength - 1 || action.step < state.saliencyRangeLeft) {
        return state;
      }

      return Object.assign({}, state, {
        saliencyRangeRight: action.step,
      });
    case SUCCESS_FETCH_LOG:
      return Object.assign({}, state, {
        logLength: action.logDataRows.length,
      });
    default:
      return state;
  }
};

export default saliencyRange;
