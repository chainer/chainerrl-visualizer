import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, InputGroup, Input, InputGroupAddon, Button,
} from 'reactstrap';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import { connect } from 'react-redux';

import {
  startFetchExperiment,
  requestRollout,
  startGetLog,
  changeSliceLeft,
  changeSliceRight,
  changeXFocus,
} from '../actions';

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/forbid-prop-types */

class DetailContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleSeedChange = this.handleSeedChange.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    this.handleFromStepChange = this.handleFromStepChange.bind(this);
    this.handleToStepChange = this.handleToStepChange.bind(this);

    this.lineChart = React.createRef();

    this.state = {
      resultPath: '/Users/sykwer/work/i18-sykwer/experiments/visualize_atari/results/211288/20180804T155228.325999',
      modelName: '10000000_finish',
      seed: 1,
      fromStep: 0,
      toStep: 0,
    };
  }

  componentDidMount() {
    const { projectId, experimentId } = this.props.match.params; /* eslint-disable-line react/destructuring-assignment */
    this.props.startFetchExperiment(projectId, experimentId); /* eslint-disable-line react/destructuring-assignment */
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

  handleFromStepChange(e) {
    const { value } = e.target;
    this.setState({
      fromStep: value,
    });
  }

  handleToStepChange(e) {
    const { value } = e.target;
    this.setState({
      toStep: value,
    });
  }

  render() {
    const {
      resultPath,
      modelName,
      seed,
      toStep,
      fromStep,
    } = this.state;

    const {
      experiment,
      log,
      stat,
      sliceLeft,
      sliceRight,
      xFocus,
    } = this.props;

    const environ = (experiment.environ) ? experiment.environ : {};
    const environList = Object.keys(environ).map((key) => (
      <p key={key}>
        <strong>
          (
          {key}
          )
        </strong>
        {' '}
        {environ[key]}
      </p>
    ));

    const args = (experiment.args) ? experiment.args : {};
    const argsList = Object.keys(args).map((key) => (
      <p key={key}>
        <strong>
          (
          {key}
          )
        </strong>
        {' '}
        {args[key]}
      </p>
    ));

    return (
      <div>
        <br />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>Summary</CardTitle>
                  {
                    (experiment.id) ? (
                      <div>
                        <p>
                          <strong>
                            (experiment id)
                          </strong>
                          {' '}
                          {experiment.id}
                        </p>
                        <p>
                          <strong>
                            (experiment name)
                          </strong>
                          {' '}
                          {experiment.name}
                        </p>
                        <p>
                          <strong>
                            (command)
                          </strong>
                          {' '}
                          {experiment.command}
                        </p>
                      </div>
                    ) : (
                      <p>Not loaded</p>
                    )
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>Args</CardTitle>
                  {argsList}
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>Environ</CardTitle>
                  {environList}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Container>
                    <Row>
                      <Col>
                        <Card>
                          <CardBody>
                            <CardTitle>Create saliency map</CardTitle>
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
                            &nbsp;
                            <Button onClick={() => { this.props.startGetLog(resultPath); }}>Get Log</Button>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <CardBody>
                            <CardTitle>Create saliency map</CardTitle>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">from step</InputGroupAddon>
                              <Input type="number" step="10" value={fromStep} onChange={this.handleFromStepChange} />
                            </InputGroup>
                            <br />
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">to step</InputGroupAddon>
                              <Input type="number" step="10" value={toStep} onChange={this.handleToStepChange} />
                            </InputGroup>
                            <br />
                            <Button onClick={() => { console.log(fromStep, toStep); }}>Create</Button>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col>
              <LineChart
                width={1000}
                height={800}
                data={log}
                margin={{
                  top: 5, right: 30, left: 0, bottom: 5,
                }}
                ref={this.lineChart}
                onMouseMove={() => { this.props.changeXFocus(this.lineChart.current.state.activeLabel); }}
              >
                <Line type="monotone" dataKey="qvalue1" stroke="red" />
                <Line type="monotone" dataKey="qvalue2" stroke="blue" />
                <Line type="monotone" dataKey="qvalue3" stroke="pink" />
                <Line type="monotone" dataKey="qvalue4" stroke="green" />
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </Col>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>env render</CardTitle>
                  <CardText>{`step: ${xFocus}`}</CardText>
                  <img src={`http://localhost:5001/images?step=${xFocus}`} alt="env render" height={400} />
                </CardBody>
              </Card>
              <br />
              <Card>
                <CardBody>
                  <CardTitle>statistic description</CardTitle>
                  {
                    Object.keys(stat).map((key) => (
                      <CardText key={key}>
                        {key}
:
                        {' '}
                        {stat[key]}
                      </CardText>
                    ))
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">left</InputGroupAddon>
                    <Input type="number" step="10" value={sliceLeft} onInput={(e) => { this.props.changeSliceLeft(parseInt(e.target.value, 10)); }} />
                  </InputGroup>
                  <br />
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">right</InputGroupAddon>
                    <Input type="number" step="10" value={sliceRight} onInput={(e) => { this.props.changeSliceRight(parseInt(e.target.value, 10)); }} />
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>prev step / next step</CardTitle>
                  <CardText>{xFocus}</CardText>
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
  match: PropTypes.any.isRequired, /* eslint-disable-line react/forbid-prop-types */
  experiment: PropTypes.object.isRequired,
  log: PropTypes.arrayOf(
    PropTypes.any
  ).isRequired,
  stat: PropTypes.any.isRequired,
  sliceLeft: PropTypes.number.isRequired,
  sliceRight: PropTypes.number.isRequired,
  xFocus: PropTypes.number.isRequired,
  startFetchExperiment: PropTypes.func.isRequired,
  requestRollout: PropTypes.func.isRequired,
  startGetLog: PropTypes.func.isRequired,
  changeSliceRight: PropTypes.func.isRequired,
  changeSliceLeft: PropTypes.func.isRequired,
  changeXFocus: PropTypes.func.isRequired,
};


const exstractStat = (log, xFocus) => {
  const isFocused = (elem) => (
    parseInt(elem.step, 10) === xFocus
  );

  const data = log.filter(isFocused)[0];
  if (data === undefined) {
    return {};
  }

  return data;
};


const mapStateToProps = (state) => ({
  experiment: state.experiment,
  log: state.log.slice(state.sliceLeft, state.sliceRight + 1),
  stat: exstractStat(state.log, state.xFocus),
  sliceLeft: state.sliceLeft,
  sliceRight: state.sliceRight,
  xFocus: state.xFocus,
});

export default connect(mapStateToProps, {
  startFetchExperiment,
  requestRollout,
  startGetLog,
  changeSliceRight,
  changeSliceLeft,
  changeXFocus,
})(DetailContainer);
