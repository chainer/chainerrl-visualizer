import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import {
  clickRollout, clickSaliency, changeSaliencyRangeLeft, changeSaliencyRangeRight,
} from '../actions';

const path = require('path');

const CommandsContainer = (props) => {
  const {
    saliencyRangeLeft,
    saliencyRangeRight,
    isRolloutReady,
    isSaliencyReady,
    rolloutId,
    rawImageInput,
  } = props;

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Commands</CardTitle>
          <Button
            onClick={props.clickRollout}
            disabled={!isRolloutReady}
          >
            Rollout 1 episode
          </Button>
          {
            rawImageInput && (
              <div>
                <InputGroup style={{ marginTop: '20px' }}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>from</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    step="10"
                    value={saliencyRangeLeft}
                    onInput={(e) => {
                      props.changeSaliencyRangeLeft(parseInt(e.target.value, 10));
                    }}
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText placeholder="step">to</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    step="10"
                    value={saliencyRangeRight}
                    onInput={(e) => {
                      props.changeSaliencyRangeRight(parseInt(e.target.value, 10));
                    }}
                  />
                </InputGroup>
                <Button
                  onClick={() => { props.clickSaliency(rolloutId, saliencyRangeLeft, saliencyRangeRight); }}
                  disabled={!isSaliencyReady}
                  style={{ marginTop: '8px' }}
                >
                  Create saliency map
                </Button>
              </div>
            )
          }
        </CardBody>
      </Card>
    </div>
  );
};


CommandsContainer.propTypes = {
  saliencyRangeLeft: PropTypes.number.isRequired,
  saliencyRangeRight: PropTypes.number.isRequired,
  isRolloutReady: PropTypes.bool.isRequired,
  isSaliencyReady: PropTypes.bool.isRequired,
  rolloutId: PropTypes.string.isRequired,
  rawImageInput: PropTypes.bool.isRequired,
  clickRollout: PropTypes.func.isRequired,
  clickSaliency: PropTypes.func.isRequired,
  changeSaliencyRangeLeft: PropTypes.func.isRequired,
  changeSaliencyRangeRight: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  saliencyRangeLeft: state.saliencyRange.saliencyRangeLeft,
  saliencyRangeRight: state.saliencyRange.saliencyRangeRight,
  isRolloutReady: !state.serverState.isJobRunning,
  isSaliencyReady: !state.serverState.isJobRunning && state.serverState.isRolloutOnMemory,
  rolloutId: path.basename(state.log.rolloutPath),
  rawImageInput: state.agentProfile.rawImageInput,
});

export default connect(mapStateToProps, {
  clickRollout,
  clickSaliency,
  changeSaliencyRangeLeft,
  changeSaliencyRangeRight,
})(CommandsContainer);
