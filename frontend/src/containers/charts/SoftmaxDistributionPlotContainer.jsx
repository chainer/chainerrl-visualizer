import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Legend, Label,
} from 'recharts';

import { hoverOnStep } from '../../actions';

const toPercent = (decimal, fixed = 0) => (
  `${(decimal * 100).toFixed(fixed)}%`
);

class SoftmaxDistributionPlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
  }

  render() {
    const {
      logDataRows, actionMeanings, actionColors, stateValueReturned, focusedStep,
    } = this.props;

    const legendPayload = Object.values(actionMeanings).map((actionMeaning, actionIdx) => ({
      id: actionMeaning,
      value: actionMeaning,
      type: 'diamond',
      color: actionColors[actionIdx],
    }));

    return (
      <ResponsiveContainer aspect={(16 / (9 * 0.85))} width="100%" height={null}>
        <AreaChart
          data={logDataRows}
          stackOffset="expand"
          onMouseMove={() => {
            this.props.hoverOnStep(this.chartRef.current.state.activeLabel);
          }}
          ref={this.chartRef}
        >
          <XAxis dataKey="step">
            <Label value="step" position="insideBottomLeft" offset={-10} />
          </XAxis>
          <YAxis
            tickFormatter={toPercent}
            yAxisId="left"
            label={{
              value: 'Percentage of action', angle: -90, position: 'insideLeft', offset: 3,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'State value', angle: 90, position: 'insideTopLeft', offset: 55,
            }}
            width={100}
          />
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
          {
            stateValueReturned && (
              <Area fill="#00000000" dataKey="state_value" stroke="red" yAxisId="right" type="monotone" />
            )
          }
          <Legend payload={legendPayload} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

SoftmaxDistributionPlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionMeanings: PropTypes.object.isRequired,
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateValueReturned: PropTypes.bool.isRequired,
  focusedStep: PropTypes.number.isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  actionMeanings: state.settings.actionMeanings,
  actionColors: state.settings.actionColors,
  stateValueReturned: state.agentProfile.stateValueReturned,
  focusedStep: state.plotRange.focusedStep,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(SoftmaxDistributionPlotContainer);
