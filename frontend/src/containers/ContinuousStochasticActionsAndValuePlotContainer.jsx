import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ComposedChart, Line, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

import { hoverOnStep } from '../actions';

/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */

class ContinuousStochasticActionsAndValuePlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chart = React.createRef();
  }

  render() {
    const { logDataRows, focusedStep, selectedActionDimensionIndices } = this.props;

    /*
    logDataRows.forEach((logDataRow) => {
      logDataRow.trustRange = [
        parseFloat(logDataRow.action_means[0] - logDataRow.action_vars[0]),
        parseFloat(logDataRow.action_means[0] + logDataRow.action_vars[0]),
      ];
    });
    */

    logDataRows.forEach((logDataRow) => {
      /* eslint-disable-next-line no-param-reassign */
      logDataRow.trustRange = {};

      selectedActionDimensionIndices.forEach((actionIdx) => {
        /* eslint-disable-next-line no-param-reassign */
        logDataRow.trustRange[actionIdx] = [
          parseFloat(logDataRow.action_means[actionIdx] - logDataRow.action_vars[actionIdx]),
          parseFloat(logDataRow.action_means[actionIdx] + logDataRow.action_vars[actionIdx]),
        ];
      });
    });

    return (
      <ComposedChart
        width={900}
        height={460}
        data={logDataRows}
        ref={this.chart}
        onMouseMove={() => { this.props.hoverOnStep(this.chart.current.state.activeLabel); }}
        stackOffset="silhouette"
      >
        {
          selectedActionDimensionIndices.map((actionIdx) => (
            <Line
              yAxisId="left"
              type="monotone"
              dot={false}
              dataKey={(v) => v.action[actionIdx]}
              key={actionIdx}
            />
          ))
        }
        {
          selectedActionDimensionIndices.map((actionIdx) => (
            <Line
              yAxisId="left"
              type="monotone"
              dot={false}
              stroke="gray"
              strokeDasharray="3 4 5 2"
              dataKey={(v) => v.action_means[actionIdx]}
              key={actionIdx}
            />
          ))
        }
        {
          // TODO: If `key` attribute to Area added, chart broken. Why?
          selectedActionDimensionIndices.map((actionIdx) => (
            <Area
              yAxisId="left"
              dataKey={(row) => row.trustRange[actionIdx]}
              stroke="yellow"
              fill="yellow"
            />
          ))
        }
        <Line
          yAxisId="right"
          type="monotone"
          dot={false}
          stroke="red"
          dataKey="state_value"
        />
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="steps" />
        <YAxis yAxisId="left" domain={['dataMin', 'dataMax']} tickFormatter={(v) => Number.parseFloat(v).toFixed(3)} />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <ReferenceLine yAxisId="left" x={focusedStep} stroke="green" />
      </ComposedChart>
    );
  }
}


ContinuousStochasticActionsAndValuePlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedStep: PropTypes.number.isRequired,
  selectedActionDimensionIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  focusedStep: state.plotRange.focusedStep,
  selectedActionDimensionIndices: state.selectedActionDimensionIndices,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(ContinuousStochasticActionsAndValuePlotContainer);
