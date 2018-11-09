import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteQvaluesContainer from './DiscreteQvaluesContainer';
import ContinuousStochasticActionsContainer from './ContinuousStochasticActionsContainer';
import DiscreteStochasticActionsContainer from './DiscreteStochasticActionsContainer';

import {
  mapAgentProfileToValuesPaneList,
  DISCRETE_QVALUES_PANE,
  CONTINUOUS_STOCHASTIC_ACTIONS_PANE,
  DISCRETE_STOCHASTIC_ACTIONS_PANE,
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

const mapStateToProps = (state) => {
  const paneList = mapAgentProfileToValuesPaneList(state.agentProfile);
  return {
    valuesPaneName: paneList.length === 0 ? '' : paneList[0],
  };
};

export default connect(mapStateToProps, null)(ValuesPaneContainer);
