import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container, Row, Col,
} from 'reactstrap';

import DiscreteQvaluesPlotContainer from '../containers/DiscreteQvaluesPlotContainer';
import QvaluesDistributionPlotContainer from '../containers/QvaluesDistributionPlotContainer';
import ContinuousStochasticActionsAndValuePlotContainer from '../containers/ContinuousStochasticActionsAndValuePlotContainer';
import DiscreteStochasticActionsAndValuePlotContainer from '../containers/DiscreteStochasticActionsAndValuePlotContainer';
import StepCountContainer from '../containers/StepCountContainer';
import EnvRenderContainer from '../containers/EnvRenderContainer';
import CommandsContainer from '../containers/CommandsContainer';
import ChartSwitchContainer from '../containers/ChartSwitchContainer';
import ChartControlContainer from '../containers/ChartControlContainer';
import DiscreteQvaluesContainer from '../containers/DiscreteQvaluesContainer';
import ContinuousStochasticActionsContainer from '../containers/ContinuousStochasticActionsContainer';
import DiscreteStochasticActionsContainer from '../containers/DiscreteStochasticActionsContainer';
import ChartSkelton from './ChartSkelton';
import {
  DISCRETE_QVALUES, VALUE_DISTRIBUTION, CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE, DISCRETE_STOCHASTIC_ACTIONS, AGENT_TO_VALUES_PANE, DISCRETE_QVALUES_PANE, CONTINUOUS_STOCHASTIC_ACTIONS_PANE, DISCRETE_STOCHASTIC_ACTIONS_PANE,
} from '../settings/agent';

const topStyle = {
  padding: '20px',
};

const MainPageBody = ({ selectedChartName, valuesPaneName }) => {
  let chart;
  switch (selectedChartName) {
    case DISCRETE_QVALUES:
      chart = <DiscreteQvaluesPlotContainer />;
      break;
    case VALUE_DISTRIBUTION:
      chart = <QvaluesDistributionPlotContainer />;
      break;
    case CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE:
      chart = <ContinuousStochasticActionsAndValuePlotContainer />;
      break;
    case DISCRETE_STOCHASTIC_ACTIONS:
      chart = <DiscreteStochasticActionsAndValuePlotContainer />;
      break;
    default:
      chart = <ChartSkelton />;
  }

  console.log(valuesPaneName);

  let valuesPane;
  switch (valuesPaneName) {
    case DISCRETE_QVALUES_PANE:
      valuesPane = <DiscreteQvaluesContainer />;
      break;
    case CONTINUOUS_STOCHASTIC_ACTIONS_PANE:
      valuesPane = <ContinuousStochasticActionsContainer />;
      break;
    case DISCRETE_STOCHASTIC_ACTIONS_PANE:
      valuesPane = <DiscreteStochasticActionsContainer />;
      break;
    default:
      valuesPane = <div />;
  }

  return (
    <div style={topStyle}>
      <Container fluid>
        <Row>
          <Col xs="8" style={{ padding: 0 }}>
            {chart}
          </Col>
          <Col xs="4">
            <StepCountContainer />
            <EnvRenderContainer />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col xs="4">
            <CommandsContainer />
          </Col>
          <Col xs="4">
            <ChartControlContainer />
            <ChartSwitchContainer />
          </Col>
          <Col xs="4">
            {valuesPane}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

MainPageBody.propTypes = {
  selectedChartName: PropTypes.string.isRequired,
  valuesPaneName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  selectedChartName: state.selectedChartName,
  valuesPaneName: AGENT_TO_VALUES_PANE[state.serverState.agentType] || '',
});

export default connect(mapStateToProps, null)(MainPageBody);
