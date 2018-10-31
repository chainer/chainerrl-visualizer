import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { startFetchAgentProfile } from '../actions';
import Header from '../components/Header';
import MainPageBody from '../components/MainPageBody';

class MainPageContainer extends React.Component {
  componentDidMount() {
    this.props.startFetchAgentProfile(); // eslint-disable-line react/destructuring-assignment
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
  startFetchAgentProfile: PropTypes.func.isRequired,
};

export default connect(null, {
  startFetchAgentProfile,
})(MainPageContainer);
