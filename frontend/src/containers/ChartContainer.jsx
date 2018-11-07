import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteQvaluesPlotContainer from './DiscreteQvaluesContainer';
import QvalusDistributionPlotContainer from './QvaluesDistributionPlotContainer';
import ContinuousStochasticActionsAndValuePlotContainer from './ContinuousStochasticActionsAndValuePlotContainer';
import DiscreteStochasticActionsAndValuePlotContainer from './DiscreteStochasticActionsAndValuePlotContainer';
import ChartSkelton from '../components/ChartSkelton';

import {
  DISCRETE_ACTION_VALUE_PLOT,
  DISTRIBUTIONAL_ACTION_VALUE_PLOT,
  GAUSSIAN_DISTRIBUTION_PLOT,
  SOFTMAX_DISTRIBUTION_PLOT,
} from '../settings/agent';

const ChartContainer = ({ selectedChartName }) => {
  switch (selectedChartName) {
    case DISCRETE_ACTION_VALUE_PLOT:
      return <DiscreteQvaluesPlotContainer />;
    case DISTRIBUTIONAL_ACTION_VALUE_PLOT:
      return <QvalusDistributionPlotContainer />;
    case GAUSSIAN_DISTRIBUTION_PLOT:
      return <ContinuousStochasticActionsAndValuePlotContainer />;
    case SOFTMAX_DISTRIBUTION_PLOT:
      return <DiscreteStochasticActionsAndValuePlotContainer />;
    default:
      return <ChartSkelton />;
  }
};

ChartContainer.propTypes = {
  selectedChartName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  selectedChartName: state.selectedChartName,
});

export default connect(mapStateToProps, null)(ChartContainer);
