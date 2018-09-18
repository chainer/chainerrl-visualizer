import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';
import {
  BarChart, Bar, LabelList, XAxis, YAxis,
} from 'recharts';

import { AGENT_TO_VALUES_PANE, VALUES_PANE_TO_TITLE } from '../settings/agent';

const DiscreteQvaluesContainer = ({
  sortedQvalues, actionTaken, paneTitle, actionMeanings,
}) => (
  <div>
    <Card>
      <CardBody>
        <CardTitle style={{ marginBottom: '0.25rem' }}>{paneTitle}</CardTitle>
        <p style={{ margin: 0 }}>
          {'( '}
          Next action is
          {' '}
          <strong>
            {actionMeanings[actionTaken]}
          </strong>
          {' )'}
        </p>
        <BarChart
          layout="vertical"
          width={390}
          height={330}
          data={sortedQvalues}
        >
          <Bar dataKey="qvalue" fill="#8884d8" isAnimationActive={false}>
            <LabelList
              dataKey="name"
              position="insideRight"
              style={{ fontSize: '8px' }}
            />
          </Bar>
          <XAxis
            type="number"
            tickFormatter={(v) => Number.parseFloat(v).toFixed(2)}
            domain={['dataMin - 0.05', 'dataMax']}
            padding={{ right: 10 }}
          />
          <YAxis
            type="category"
            tick={false}
            width={2}
          />
        </BarChart>
      </CardBody>
    </Card>
  </div>
);

DiscreteQvaluesContainer.propTypes = {
  sortedQvalues: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionTaken: PropTypes.number.isRequired,
  paneTitle: PropTypes.string.isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
};

const mapStateToSortedQvalues = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.serverState.actionMeanings; /* eslint-disable-line prefer-destructuring */

  if (!logDataRow) {
    return [];
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'qvalues')) {
    return [];
  }

  return logDataRow.qvalues.map((qvalue, idx) => (
    { name: actionMeanings[idx], qvalue }
  )).sort((a, b) => (
    b.qvalue - a.qvalue
  ));
};

const mapStateToActionTaken = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];

  if (!logDataRow) {
    return -1;
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'action')) {
    return -1;
  }

  console.log(logDataRow.action);

  return logDataRow.action;
};

const mapStateToProps = (state) => ({
  sortedQvalues: mapStateToSortedQvalues(state),
  actionTaken: mapStateToActionTaken(state),
  paneTitle: VALUES_PANE_TO_TITLE[AGENT_TO_VALUES_PANE[state.serverState.agentType]],
  actionMeanings: state.serverState.actionMeanings,
});

export default connect(mapStateToProps, null)(DiscreteQvaluesContainer);
