import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { startFetchExperiments } from '../actions';

class ExperimentsContainer extends React.Component {
  componentDidMount() {
    const { projectId } = this.props.match.params; /* eslint-disable-line react/destructuring-assignment */
    this.props.startFetchExperiments(projectId); /* eslint-disable-line react/destructuring-assignment */
  }

  render() {
    const { experiments } = this.props;

    return (
      <div>
        {
          experiments.map((experiment) => (
            <p key={experiment.id}>
              {experiment.name}
            </p>
          ))
        }
      </div>
    );
  }
}

ExperimentsContainer.propTypes = {
  match: PropTypes.any.isRequired, /* eslint-disable-line react/forbid-prop-types */
  experiments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      command: PropTypes.string.isRequired,
      args: PropTypes.object.isRequired,
      environ: PropTypes.object.isRequired,
      log: PropTypes.arrayOf(PropTypes.any).isRequired,
    })
  ).isRequired,
  startFetchExperiments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  experiments: state.experiments,
});

export default connect(mapStateToProps, {
  startFetchExperiments,
})(ExperimentsContainer);
