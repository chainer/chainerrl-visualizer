import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import {
  AreaChart, Area, XAxis,
} from 'recharts';

const gauseDistributionData = (mean, variance, bins) => {
  const stdDev = Math.sqrt(variance);
  const left = mean - stdDev * 2.5;
  const right = mean + stdDev * 2.5;

  const dist = [];
  const tick = (right - left) / bins;
  for (let x = left; x <= right; x += tick) {
    const prob = (1 / (Math.sqrt(2 * Math.PI) * variance)) * Math.exp(-1 * ((x - mean) ** 2) / (2 * variance));
    dist.push({ action: x, prob });
  }

  return dist;
};

const actionDistributionChart = (actionMean, actionVar) => (
  <AreaChart
    width={200}
    height={80}
    data={gauseDistributionData(actionMean, actionVar, 10)}
  >
    <Area type="monotone" dataKey="prob" />
    <XAxis dataKey="action" tickFormatter={(v) => Number.parseFloat(v).toFixed(1)} />
  </AreaChart>
);

const ContinuousStochasticActionsContainer = ({ logDataRow, actionMeanings }) => {
  if (Object.keys(logDataRow).length === 0) {
    return <div />;
  }

  const chartRows = [];
  for (let i = 0; i < Math.ceil(logDataRow.action.length / 2); i++) {
    const chartRow = (
      <Row>
        <Col xs="6">
          <p style={{ margin: '0 auto' }}>{actionMeanings[2 * i]}</p>
          {actionDistributionChart(logDataRow.action_means[2 * i], logDataRow.action_vars[2 * i])}
        </Col>
        {
          logDataRow.action.length >= 2 * i + 2 && (
            <Col xs="6">
              <p style={{ margin: '0 auto' }}>{actionMeanings[2 * i + 1]}</p>
              {actionDistributionChart(logDataRow.action_means[2 * i + 1], logDataRow.action_vars[2 * i + 1])}
            </Col>
          )
        }
      </Row>
    );

    chartRows.push(chartRow);
  }

  return (
    <div>
      <Container>
        {chartRows}
      </Container>
    </div>
  );
};

ContinuousStochasticActionsContainer.propTypes = {
  logDataRow: PropTypes.shape({
    action: PropTypes.arrayOf(PropTypes.number),
    action_means: PropTypes.arrayOf(PropTypes.number),
    action_vars: PropTypes.arrayOf(PropTypes.number),
  }),
  actionMeanings: PropTypes.object, /* eslint-disable-line react/forbid-prop-types */
};

ContinuousStochasticActionsContainer.defaultProps = {
  logDataRow: {},
  actionMeanings: {},
};

const mapStateToProps = (state) => ({
  logDataRow: state.log.logDataRows[state.plotRange.focusedStep],
  actionMeanings: state.serverState.actionMeanings,
});

export default connect(mapStateToProps, null)(ContinuousStochasticActionsContainer);
