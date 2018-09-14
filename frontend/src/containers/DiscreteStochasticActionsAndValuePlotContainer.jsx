import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ComposedChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Legend, Line,
} from 'recharts';

import { hoverOnStep } from '../actions';

const toPercent = (decimal, fixed = 0) => (
  `${(decimal * 100).toFixed(fixed)}%`
);

class DiscreteStochasticActionsAndValuePlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
  }

  render() {
    const {
      logDataRows, actionMeanings, actionColors, focusedStep,
    } = this.props;

    const legendPayload = Object.values(actionMeanings).map((actionMeaning, actionIdx) => ({
      id: actionMeaning,
      value: actionMeaning,
      type: 'diamond',
      color: actionColors[actionIdx],
    }));

    return (
      <div>
        <ComposedChart
          width={900}
          height={460}
          data={logDataRows}
          stackOffset="expand"
          onMouseMove={() => {
            /* eslint-disable-next-line react/destructuring-assignment */
            this.props.hoverOnStep(this.chartRef.current.state.activeLabel);
          }}
          ref={this.chartRef}
        >
          <XAxis dataKey="steps" />
          <YAxis tickFormatter={toPercent} yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <ReferenceLine x={focusedStep} stroke="green" yAxisId="left" />
          {
            Object.values(actionMeanings).map((actionMeaning, actionIdx) => (
              <Area
                type="monotone"
                fill={actionColors[actionIdx]}
                stroke={actionColors[actionIdx]}
                stackId="1"
                dataKey={(v) => v.action_probs[actionIdx]}
                key={actionMeaning}
                yAxisId="left"
              />
            ))
          }
          <Line dataKey="state_value" stroke="red" yAxisId="right" type="monotone" dot={false} />
          <Legend payload={legendPayload} />
        </ComposedChart>
      </div>
    );
  }
}

DiscreteStochasticActionsAndValuePlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedStep: PropTypes.number.isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  actionMeanings: state.serverState.actionMeanings,
  actionColors: state.serverState.actionColors,
  focusedStep: state.plotRange.focusedStep,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(DiscreteStochasticActionsAndValuePlotContainer);
