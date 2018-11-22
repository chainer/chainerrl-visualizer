import React from 'react';
import {
  Container, Row, Col,
} from 'reactstrap';

import ChartContainer from '../containers/ChartContainer';
import StepCountContainer from '../containers/StepCountContainer';
import EnvRenderContainer from '../containers/EnvRenderContainer';
import CommandsContainer from '../containers/CommandsContainer';
import ChartSwitchContainer from '../containers/ChartSwitchContainer';
import ChartControlContainer from '../containers/ChartControlContainer';
import ValuesPaneContainer from '../containers/ValuesPaneContainer';

const MainPageBody = () => (
  <div style={{
    padding: '20px',
    width: '100%',
  }}
  >
    <Container fluid>
      <Row>
        <Col xs="8">
          <ChartContainer />
          <Row style={{ marginTop: '10px' }}>
            <Col xs="6">
              <CommandsContainer />
            </Col>
            <Col xs="6">
              <ChartControlContainer />
              <ChartSwitchContainer />
            </Col>
          </Row>
        </Col>
        <Col xs="4">
          <StepCountContainer />
          <EnvRenderContainer />
          <ValuesPaneContainer />
        </Col>
      </Row>
    </Container>
  </div>
);

export default MainPageBody;
