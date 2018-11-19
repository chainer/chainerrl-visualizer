import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteActionValuePaneContainer from './valuePanes/DiscreteActionValuePaneContainer';
import GaussianDistributionPaneContainer from './valuePanes/GaussianDistributionPaneContainer';
import SoftmaxDistributionPaneContainer from './valuePanes/SoftmaxDistributionPaneContainer';

import {
  mapAgentProfileToValuesPaneList,
  DISCRETE_ACTION_VALUE_PANE,
  QUADRATIC_ACTION_VALUE_PANE,
  GAUSSIAN_DISTRIBUTION_PANE,
  SOFTMAX_DISTRIBUTION_PANE,
  MELLOWMAX_DISTRIBUTION_PANE,
  CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE,
} from '../settings';

const ValuesPaneContainer = ({ valuesPaneName }) => {
  switch (valuesPaneName) {
    case DISCRETE_ACTION_VALUE_PANE:
      return <DiscreteActionValuePaneContainer />;
    case QUADRATIC_ACTION_VALUE_PANE:
      return <div />; // TODO: implement QuadraticActionValuePane
    case GAUSSIAN_DISTRIBUTION_PANE:
      return <GaussianDistributionPaneContainer />;
    case SOFTMAX_DISTRIBUTION_PANE:
      return <SoftmaxDistributionPaneContainer />;
    case MELLOWMAX_DISTRIBUTION_PANE:
      return <div />; // TODO: implement MellowmaxDistributionPane
    case CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE:
      return <div />; // TODO: implement ContinuousDeterministicDistributionPane
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
