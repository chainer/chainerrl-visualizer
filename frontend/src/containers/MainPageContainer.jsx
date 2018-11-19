import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  startFetchAgentProfile,
  startFetchLatestLogInfo,
  startFetchServerState,
  startFetchLog,
} from '../actions';
import Header from '../components/Header';
import MainPageBody from '../components/MainPageBody';
import { startPolling, stopPolling } from '../utils/polling';

const path = require('path');

const POLLING_INTERVAL_MS = 3000;

/* eslint-disable react/destructuring-assignment */

class MainPageContainer extends React.Component {
  componentDidMount() {
    this.props.startFetchAgentProfile();
    this.props.startFetchLatestLogInfo();

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
    return (
      <div>
        <Header />
        <MainPageBody />
      </div>
    );
  }
}

MainPageContainer.propTypes = {
  rolloutId: PropTypes.string.isRequired,
  startFetchAgentProfile: PropTypes.func.isRequired,
  startFetchLatestLogInfo: PropTypes.func.isRequired,
  startFetchServerState: PropTypes.func.isRequired,
  startFetchLog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  rolloutId: path.basename(state.log.rolloutPath),
});

export default connect(mapStateToProps, {
  startFetchAgentProfile,
  startFetchLatestLogInfo,
  startFetchServerState,
  startFetchLog,
})(MainPageContainer);
