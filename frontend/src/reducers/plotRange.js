import {
  CLICK_PREV_STEP, CLICK_NEXT_STEP, HOVER_ON_STEP, CHANGE_PLOT_RANGE_LEFT, CHANGE_PLOT_RANGE_RIGHT, SUCCESS_FETCH_LOG,
} from '../actions';

const initialPlotRange = {
  plotRangeLeft: 0,
  plotRangeRight: 0,
  focusedStep: 0,
  logLength: 0,
};

const plotRange = (state = initialPlotRange, action) => {
  switch (action.type) {
    case CLICK_PREV_STEP:
      if (state.focusedStep <= 0) {
        return state;
      }

      if (state.focusedStep <= state.plotRangeLeft) {
        const range = state.plotRangeRight - state.plotRangeLeft;
        const leftAfter = Math.max(0, state.plotRangeLeft - range);

        return Object.assign({}, state, {
          focusedStep: state.focusedStep - 1,
          plotRangeLeft: leftAfter,
          plotRangeRight: leftAfter + range,
        });
      }

      return Object.assign({}, state, {
        focusedStep: state.focusedStep - 1,
      });
    case CLICK_NEXT_STEP:
      if (state.focusedStep >= state.logLength - 1) {
        return state;
      }

      if (state.focusedStep >= state.plotRangeRight) {
        const range = state.plotRangeRight - state.plotRangeLeft;
        const rightAfter = Math.min(state.logLength - 1, state.plotRangeRight + range);

        return Object.assign({}, state, {
          focusedStep: state.focusedStep + 1,
          plotRangeLeft: rightAfter - range,
          plotRangeRight: rightAfter,
        });
      }

      return Object.assign({}, state, {
        focusedStep: state.focusedStep + 1,
      });
    case HOVER_ON_STEP:
      if (action.step === undefined) {
        return Object.assign({}, state, {
          focusedStep: 0,
        });
      }

      return Object.assign({}, state, {
        focusedStep: action.step,
      });
    case CHANGE_PLOT_RANGE_LEFT:
      if (action.step < 0) {
        return state;
      }

      if (action.step >= state.plotRangeRight) {
        return state;
      }

      return Object.assign({}, state, {
        plotRangeLeft: action.step,
      });
    case CHANGE_PLOT_RANGE_RIGHT:
      if (action.step > state.logLength - 1) {
        return state;
      }

      if (action.step <= state.plotRangeLeft) {
        return state;
      }

      return Object.assign({}, state, {
        plotRangeRight: action.step,
      });
    case SUCCESS_FETCH_LOG:
      if (action.logDataRows.length !== state.logLength) {
        const newFocusedStep = state.focusedStep > action.logDataRows.length - 1 ? 0 : state.focusedStep;

        return Object.assign({}, state, {
          plotRangeLeft: 0,
          plotRangeRight: action.logDataRows.length > 0 ? action.logDataRows.length - 1 : 0,
          focusedStep: newFocusedStep,
          logLength: action.logDataRows.length,
        });
      }

      return state;
    default:
      return state;
  }
};

export default plotRange;
