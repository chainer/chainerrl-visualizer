import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteQvaluesContainer from './DiscreteQvaluesContainer';
import ContinuousStochasticActionsContainer from './ContinuousStochasticActionsContainer';
import DiscreteStochasticActionsContainer from './DiscreteStochasticActionsContainer';

import {
  AGENT_TO_VALUES_PANE, DISCRETE_QVALUES_PANE, CONTINUOUS_STOCHASTIC_ACTIONS_PANE, DISCRETE_STOCHASTIC_ACTIONS_PANE,
} from '../settings/agent';

const ValuesPaneContainer = ({ valuesPaneName }) => {
  switch (valuesPaneName) {
    case DISCRETE_QVALUES_PANE:
      return <DiscreteQvaluesContainer />;
    case CONTINUOUS_STOCHASTIC_ACTIONS_PANE:
      return <ContinuousStochasticActionsContainer />;
    case DISCRETE_STOCHASTIC_ACTIONS_PANE:
      return <DiscreteStochasticActionsContainer />;
    default:
      return <div />;
  }
};

ValuesPaneContainer.propTypes = {
  valuesPaneName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  valuesPaneName: AGENT_TO_VALUES_PANE[state.agentProfile.agentType] || '',
});

export default connect(mapStateToProps, null)(ValuesPaneContainer);
