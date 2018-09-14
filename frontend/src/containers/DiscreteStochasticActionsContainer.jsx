import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import {
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* eslint-disable prefer-destructuring */

const DiscreteStochasticActionsContainer = ({ actionProbs, actionMeanings, actionColors }) => {
  const legendPayload = Object.values(actionMeanings).map((actionMeaning, actionIdx) => ({
    id: actionMeaning,
    value: actionMeaning,
    type: 'diamond',
    color: actionColors[actionIdx],
  }));

  return (
    <div>
      <Card>
        <CardBody>
          <PieChart
            width={400}
            height={250}
            style={{ margin: '0 auto' }}
          >
            <Pie
              data={actionProbs}
              dataKey="prob"
              isAnimationActive={false}
              outerRadius="90%"
            >
              {
                actionProbs.map((entry) => (
                  <Cell fill={entry.actionColor} key={entry.actionName} />
                ))
              }
            </Pie>
            <Legend payload={legendPayload} />
          </PieChart>
        </CardBody>
      </Card>
    </div>
  );
};

DiscreteStochasticActionsContainer.propTypes = {
  actionProbs: PropTypes.arrayOf(PropTypes.shape({
    actionName: PropTypes.string.isRequried,
    prob: PropTypes.number.isRequired,
  })).isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToActionProbs = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.serverState.actionMeanings;
  const actionColors = state.serverState.actionColors;

  if (!logDataRow) {
    return [];
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'action_probs')) {
    return [];
  }

  return logDataRow.action_probs.map((actionProb, actionIdx) => ({
    actionName: actionMeanings[actionIdx],
    actionColor: actionColors[actionIdx],
    prob: actionProb,
  }));
};

const mapStateToProps = (state) => ({
  actionProbs: mapStateToActionProbs(state),
  actionMeanings: state.serverState.actionMeanings,
  actionColors: state.serverState.actionColors,
});

export default connect(mapStateToProps, null)(DiscreteStochasticActionsContainer);
