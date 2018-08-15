import React from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, InputGroup, Input, InputGroupAddon, Button,
} from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */

export default class DetailContainer extends React.Component {
  render() {
    return (
      <div>
        <br />
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
          <br />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>Rollout 1 episode</CardTitle>
                  <Container>
                    <Row>
                      <Col>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">result path</InputGroupAddon>
                          <Input />
                        </InputGroup>
                        <br />
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">model name</InputGroupAddon>
                          <Input />
                        </InputGroup>
                        <br />
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">seed</InputGroupAddon>
                          <Input />
                        </InputGroup>
                        <br />
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
      </div>
    );
  }
}
