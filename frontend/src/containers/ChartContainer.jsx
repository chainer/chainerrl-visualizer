import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DiscreteQvaluesPlotContainer from './DiscreteQvaluesContainer';
import QvalusDistributionPlotContainer from './QvaluesDistributionPlotContainer';
import ContinuousStochasticActionsAndValuePlotContainer from './ContinuousStochasticActionsAndValuePlotContainer';
import DiscreteStochasticActionsAndValuePlotContainer from './DiscreteStochasticActionsAndValuePlotContainer';
import ChartSkelton from '../components/ChartSkelton';

import {
  DISCRETE_QVALUES,
  VALUE_DISTRIBUTION,
  CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE,
  DISCRETE_STOCHASTIC_ACTIONS,
} from '../settings/agent';

const ChartContainer = ({ selectdChartName }) => {
  switch (selectdChartName) {
    case DISCRETE_QVALUES:
      return <DiscreteQvaluesPlotContainer />;
    case VALUE_DISTRIBUTION:
      return <QvalusDistributionPlotContainer />;
    case CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE:
      return <ContinuousStochasticActionsAndValuePlotContainer />;
    case DISCRETE_STOCHASTIC_ACTIONS:
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
