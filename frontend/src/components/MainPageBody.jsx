import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container, Row, Col,
} from 'reactstrap';

import DiscreteQvaluesPlotContainer from '../containers/DiscreteQvaluesPlotContainer';
import QvaluesDistributionPlotContainer from '../containers/QvaluesDistributionPlotContainer';
import StepCountContainer from '../containers/StepCountContainer';
import EnvRenderContainer from '../containers/EnvRenderContainer';
import CommandsContainer from '../containers/CommandsContainer';
import ChartSwitchContainer from '../containers/ChartSwitchContainer';
import ChartControlContainer from '../containers/ChartControlContainer';
import ChartValuesContainer from '../containers/ChartValuesContainer';
import ChartSkelton from './ChartSkelton';
import { DISCRETE_QVALUES, VALUE_DISTRIBUTION } from '../settings/agent';

const topStyle = {
  padding: '20px',
};

const MainPageBody = ({ selectedChartName }) => {
  let chart;
  switch (selectedChartName) {
    case DISCRETE_QVALUES:
      chart = <DiscreteQvaluesPlotContainer />;
      break;
    case VALUE_DISTRIBUTION:
      chart = <QvaluesDistributionPlotContainer />;
      break;
    default:
      chart = <ChartSkelton />;
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
            <ChartValuesContainer />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

MainPageBody.propTypes = {
  selectedChartName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  selectedChartName: state.selectedChartName,
});

export default connect(mapStateToProps, null)(MainPageBody);
