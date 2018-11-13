import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteActionValuePlotContainer from './charts/DiscreteActionValuePlotContainer';
import DistributionalActionValuePlotContainer from './charts/DistributionalActionValuePlotContainer';
import GaussianDistributionPlotContainer from './charts/GaussianDistributionPlotContainer';
import SoftmaxDistributionPlotContainer from './charts/SoftmaxDistributionPlotContainer';
import ChartSkelton from '../components/ChartSkelton';

import {
  DISCRETE_ACTION_VALUE_PLOT,
  DISTRIBUTIONAL_ACTION_VALUE_PLOT,
  QUADRATIC_ACTION_VALUE_PLOT,
  GAUSSIAN_DISTRIBUTION_PLOT,
  SOFTMAX_DISTRIBUTION_PLOT,
  MELLOWMAX_DISTRIBUTION_PLOT,
  CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT,
} from '../settings/agent';

const ChartContainer = ({ selectedChartName }) => {
  switch (selectedChartName) {
    case DISCRETE_ACTION_VALUE_PLOT:
      return <DiscreteActionValuePlotContainer />;
    case DISTRIBUTIONAL_ACTION_VALUE_PLOT:
      return <DistributionalActionValuePlotContainer />;
    case QUADRATIC_ACTION_VALUE_PLOT:
      return <ChartSkelton />; // TODO: implement QuadraticActionValuePlotContainer
    case GAUSSIAN_DISTRIBUTION_PLOT:
      return <GaussianDistributionPlotContainer />;
    case SOFTMAX_DISTRIBUTION_PLOT:
      return <SoftmaxDistributionPlotContainer />;
    case MELLOWMAX_DISTRIBUTION_PLOT:
      return <ChartSkelton />; // TODO: implement MellowmaxDistributionPlotContainer
    case CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT:
      return <ChartSkelton />;
    default:
      return <ChartSkelton />;
  }
};

ChartContainer.propTypes = {
  selectedChartName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  selectedChartName: state.chartControl.selectedChartName,
});

export default connect(mapStateToProps, null)(ChartContainer);
