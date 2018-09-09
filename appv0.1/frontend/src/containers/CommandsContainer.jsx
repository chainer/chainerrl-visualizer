import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import {
  clickRollout, clickSaliency, changeSaliencyRangeLeft, changeSaliencyRangeRight, startFetchLog, startFetchServerState,
} from '../actions';
import { startPolling, stopPolling } from '../utils/polling';

const POLLING_INTERVAL_MS = 3000;

const path = require('path');

/* eslint-disable react/destructuring-assignment */

class CommandsContainer extends React.Component {
  componentDidMount() {
    this.logPollingTimer = startPolling(POLLING_INTERVAL_MS, this.props.startFetchLog, this.props.rolloutId);
    this.serverStatePollingTimer = startPolling(POLLING_INTERVAL_MS, this.props.startFetchServerState);
  }

  componentDidUpdate(prevProps) {
    if (this.props.rolloutId !== prevProps.rolloutId) {
      stopPolling(this.logPollingTimer);
      this.logPollingTimer = startPolling(POLLING_INTERVAL_MS, this.props.startFetchLog, this.props.rolloutId);
    }
  }

  componentWillUnmount() {
    stopPolling(this.logPollingTimer);
    stopPolling(this.serverStatePollingTimer);
  }

  render() {
    const {
      saliencyRangeLeft,
      saliencyRangeRight,
      isRolloutReady,
      isSaliencyReady,
    } = this.props;

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle>Commands</CardTitle>
            <Button
              onClick={this.props.clickRollout}
              disabled={!isRolloutReady}
            >
              Rollout 1 episode
            </Button>
            <InputGroup style={{ marginTop: '20px' }}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>from</InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                step="10"
                value={saliencyRangeLeft}
                onInput={(e) => { this.props.changeSaliencyRangeLeft(parseInt(e.target.value, 10)); }}
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText placeholder="step">to</InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                step="10"
                value={saliencyRangeRight}
                onInput={(e) => { this.props.changeSaliencyRangeRight(parseInt(e.target.value, 10)); }}
              />
            </InputGroup>
            <Button
              onClick={this.props.clickSaliency}
              disabled={!isSaliencyReady}
              style={{ marginTop: '8px' }}
            >
              Create saliency map
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
}


CommandsContainer.propTypes = {
  saliencyRangeLeft: PropTypes.number.isRequired,
  saliencyRangeRight: PropTypes.number.isRequired,
  isRolloutReady: PropTypes.bool.isRequired,
  isSaliencyReady: PropTypes.bool.isRequired,
  rolloutId: PropTypes.string.isRequired,
  clickRollout: PropTypes.func.isRequired,
  clickSaliency: PropTypes.func.isRequired,
  changeSaliencyRangeLeft: PropTypes.func.isRequired,
  changeSaliencyRangeRight: PropTypes.func.isRequired,
  startFetchLog: PropTypes.func.isRequired,
  startFetchServerState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  saliencyRangeLeft: state.saliencyRange.saliencyRangeLeft,
  saliencyRangeRight: state.saliencyRange.saliencyRangeRight,
  isRolloutReady: !state.serverState.isJobRunning,
  isSaliencyReady: !state.serverState.isJobRunning && state.serverState.isRolloutOnMemory,
  rolloutId: path.basename(state.log.rolloutPath),
});

export default connect(mapStateToProps, {
  clickRollout,
  clickSaliency,
  changeSaliencyRangeLeft,
  changeSaliencyRangeRight,
  startFetchLog,
  startFetchServerState,
})(CommandsContainer);
