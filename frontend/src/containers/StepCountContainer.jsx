import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody,
} from 'reactstrap';

const StepCountContainer = ({ step, reward }) => (
  <div>
    <Card>
      <CardBody style={{ padding: '0.25rem', paddingLeft: '20px' }}>
        {
          reward > 0 ? (
            <p style={{ margin: 0, textAlign: 'center' }}>
              step
              {' '}
              <span style={{ fontSize: '30px', marginRight: '20px' }}>
                {step}
              </span>
              reward for next action
              {' '}
              <strong style={{ fontSize: '30px' }}>
                {Number.parseFloat(reward).toFixed(2)}
              </strong>
            </p>
          ) : (
            <p style={{ margin: 0, textAlign: 'center' }}>
              step
              {' '}
              <span style={{ fontSize: '30px', marginRight: '20px' }}>
                {step}
              </span>
              reward for next action
              {' '}
              <span style={{ fontSize: '30px' }}>
                {Number.parseFloat(reward).toFixed(2)}
                {' '}
              </span>
            </p>
          )
        }
      </CardBody>
    </Card>
  </div>
);

StepCountContainer.propTypes = {
  step: PropTypes.number.isRequired,
  reward: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  step: state.plotRange.focusedStep,
  reward: state.log.logDataRows.length > 0 && state.log.logDataRows[state.plotRange.focusedStep] ? state.log.logDataRows[state.plotRange.focusedStep].reward : 0,
});

export default connect(mapStateToProps, null)(StepCountContainer);
