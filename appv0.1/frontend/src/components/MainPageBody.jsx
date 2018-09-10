import React from 'react';
import {
  Container, Row, Col,
} from 'reactstrap';

import PlotContainer from '../containers/PlotContainer';
import StepCountContainer from '../containers/StepCountContainer';
import EnvRenderContainer from '../containers/EnvRenderContainer';
import CommandsContainer from '../containers/CommandsContainer';
import ChartSwitchContainer from '../containers/ChartSwitchContainer';
import ChartControlContainer from '../containers/ChartControlContainer';
import ChartValuesContainer from '../containers/ChartValuesContainer';

const topStyle = {
  padding: '20px',
};

const MainPageBody = () => (
  <div style={topStyle}>
    <Container fluid>
      <Row>
        <Col xs="8" style={{ padding: 0 }}>
          <PlotContainer />
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

export default MainPageBody;
