import React from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, InputGroup, Input, Button,
} from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */

export default class DetailContainer extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle>Summary</CardTitle>
                <CardText>Summary content</CardText>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBody>
                <CardTitle>Args</CardTitle>
                <CardText>Args content</CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle>Rollout 1 episode</CardTitle>
                <Container>
                  <Row>
                    <Col>
                      <InputGroup>
                        <Input placeholder="seed" />
                      </InputGroup>
                      <Button>Rollout</Button>
                    </Col>
                    <Col>
                      create saliency map
                    </Col>
                  </Row>
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
