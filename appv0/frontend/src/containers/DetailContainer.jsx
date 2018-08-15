import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, InputGroup, Input, InputGroupAddon, Button,
} from 'reactstrap';
import { connect } from 'react-redux';

import { requestRollout } from '../actions';

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */

class DetailContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleSeedChange = this.handleSeedChange.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);

    this.state = {
      resultPath: '/Users/sykwer/work/i18-sykwer/experiments/visualize_atari/results/211288/20180804T155228.325999',
      modelName: '10000000_finish',
      seed: 1,
    };
  }

  handlePathChange(e) {
    const { value } = e.target;
    this.setState({
      resultPath: value,
    });
  }

  handleModelChange(e) {
    const { value } = e.target;
    this.setState({
      modelName: value,
    });
  }

  handleSeedChange(e) {
    const { value } = e.target;
    this.setState({
      seed: value,
    });
  }

  render() {
    const {
      resultPath,
      modelName,
      seed,
    } = this.state;

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
                          <Input value={resultPath} onChange={this.handlePathChange} />
                        </InputGroup>
                        <br />
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">model name</InputGroupAddon>
                          <Input value={modelName} onChange={this.handleModelChange} />
                        </InputGroup>
                        <br />
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">seed</InputGroupAddon>
                          <Input value={seed} onChange={this.handleSeedChange} />
                        </InputGroup>
                        <br />
                        <Button onClick={() => { this.props.requestRollout(resultPath, modelName, seed); }}>Rollout</Button>
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

DetailContainer.propTypes = {
  requestRollout: PropTypes.func.isRequired,
};

export default connect(null, {
  requestRollout,
})(DetailContainer);
