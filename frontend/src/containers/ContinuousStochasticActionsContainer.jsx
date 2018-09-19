import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
} from 'reactstrap';
import {
  AreaChart, Area, XAxis, ReferenceLine,
} from 'recharts';

import { AGENT_TO_VALUES_PANE, VALUES_PANE_TO_TITLE } from '../settings/agent';

const gauseDistributionData = (mean, variance, bins) => {
  const stdDev = Math.sqrt(variance);
  const left = mean - stdDev * 5;
  const right = mean + stdDev * 5;

  const dist = [];
  const tick = (right - left) / bins;
  for (let x = left; x <= right; x += tick) {
    const prob = (1 / (Math.sqrt(2 * Math.PI) * variance)) * Math.exp(-1 * ((x - mean) ** 2) / (2 * variance));
    dist.push({ action: x, prob });
  }

  return dist;
};

const actionDistributionChart = (actionMean, actionVar, actionTaken, actionColor) => (
  <AreaChart
    width={180}
    height={90}
    data={gauseDistributionData(actionMean, actionVar, 10)}
  >
    <Area xAxisId="1" type="monotone" dataKey="prob" isAnimationActive={false} fill={actionColor} stroke={actionColor} />
    <XAxis
      xAxisId="1"
      type="number"
      dataKey="action"
      tickFormatter={(v) => Number.parseFloat(v).toFixed(1)}
      domain={['dataMin', 'dataMax']}
    />
    <ReferenceLine
      xAxisId="1"
      x={actionTaken}
      stroke={actionColor}
      label={Number.parseFloat(actionTaken).toFixed(2)}
    />
  </AreaChart>
);

const ContinuousStochasticActionsContainer = ({
  logDataRow, actionMeanings, paneTitle, actionColors,
}) => {
  if (Object.keys(logDataRow).length === 0) {
    return <div />;
  }

  const chartRows = [];
  for (let i = 0; i < Math.ceil(logDataRow.action.length / 2); i++) {
    const chartRow = (
      <Row key={actionMeanings[2 * i]}>
        <Col xs="6">
          <p style={{ margin: '0 auto' }}>{actionMeanings[2 * i]}</p>
          {actionDistributionChart(logDataRow.action_means[2 * i], logDataRow.action_vars[2 * i], logDataRow.action[2 * i], actionColors[2 * i])}
        </Col>
        {
          logDataRow.action.length >= 2 * i + 2 && (
            <Col xs="6">
              <p style={{ margin: '0 auto' }}>{actionMeanings[2 * i + 1]}</p>
              {actionDistributionChart(logDataRow.action_means[2 * i + 1], logDataRow.action_vars[2 * i + 1], logDataRow.action[2 * i + 1], actionColors[2 * i + 1])}
            </Col>
          )
        }
      </Row>
    );

    chartRows.push(chartRow);
  }

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>{paneTitle}</CardTitle>
          <Container>
            {chartRows}
          </Container>
        </CardBody>
      </Card>
    </div>
  );
};

ContinuousStochasticActionsContainer.propTypes = {
  logDataRow: PropTypes.shape({
    action: PropTypes.arrayOf(PropTypes.number),
    action_means: PropTypes.arrayOf(PropTypes.number),
    action_vars: PropTypes.arrayOf(PropTypes.number),
  }),
  paneTitle: PropTypes.string.isRequired,
  actionMeanings: PropTypes.object, /* eslint-disable-line react/forbid-prop-types */
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ContinuousStochasticActionsContainer.defaultProps = {
  logDataRow: {},
  actionMeanings: {},
};

const mapStateToProps = (state) => ({
  logDataRow: state.log.logDataRows[state.plotRange.focusedStep],
  paneTitle: VALUES_PANE_TO_TITLE[AGENT_TO_VALUES_PANE[state.serverState.agentType]],
  actionMeanings: state.serverState.actionMeanings,
  actionColors: state.serverState.actionColors,
});

export default connect(mapStateToProps, null)(ContinuousStochasticActionsContainer);
