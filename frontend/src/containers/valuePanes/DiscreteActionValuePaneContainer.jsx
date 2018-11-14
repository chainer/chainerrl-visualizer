import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';
import {
  BarChart, Bar, LabelList, XAxis, YAxis,
} from 'recharts';

import { mapAgentProfileToValuesPaneTitle } from '../../settings';

const DiscreteActionValuePaneContainer = ({
  sortedActionValues, actionTaken, paneTitle, actionMeanings,
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
          data={sortedActionValues}
        >
          <Bar dataKey="actionValue" fill="#8884d8" isAnimationActive={false}>
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

DiscreteActionValuePaneContainer.propTypes = {
  sortedActionValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionTaken: PropTypes.number.isRequired,
  paneTitle: PropTypes.string.isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
};

const mapStateToSortedActionvalues = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.settings.actionMeanings; /* eslint-disable-line prefer-destructuring */

  if (!logDataRow) {
    return [];
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'action_values')) {
    return [];
  }

  console.log(logDataRow.action_values);

  return logDataRow.action_values.map((actionValue, idx) => (
    { name: actionMeanings[idx], actionValue }
  )).sort((a, b) => (
    b.actionValue - a.actionValue
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

  return logDataRow.action;
};

const mapStateToProps = (state) => ({
  sortedActionValues: mapStateToSortedActionvalues(state),
  actionTaken: mapStateToActionTaken(state),
  paneTitle: mapAgentProfileToValuesPaneTitle(state.agentProfile),
  actionMeanings: state.settings.actionMeanings,
});

export default connect(mapStateToProps, null)(DiscreteActionValuePaneContainer);
