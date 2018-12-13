import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Badge,
  UncontrolledTooltip,
} from 'reactstrap';

import {
  clickRollout,
  clickSaliency,
  changeActorIntensity,
  changeCriticIntensity,
  changeQfuncIntensity,
  changeSaliencyRangeLeft,
  changeSaliencyRangeRight,
  changeRolloutStep,
} from '../actions';
import {
  SOFTMAX_DISTRIBUTION,
  DISCRETE_ACTION_VALUE,
  DISTRIBUTIONAL_DISCRETE_ACTION_VALUE,
} from '../settings';

const path = require('path');

const CommandsContainer = (props) => {
  const {
    actorIntensity,
    criticIntensity,
    qfuncIntensity,
    saliencyRangeLeft,
    saliencyRangeRight,
    isRolloutReady,
    isSaliencyReady,
    rolloutId,
    rawImageInput,
    rolloutStep,
    stateValueReturned,
    distributionType,
    actionValueType,
    containsRecurrentModel,
  } = props;

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Commands</CardTitle>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>max step</InputGroupText>
            </InputGroupAddon>
            <Input
              type="number"
              step="10"
              value={rolloutStep}
              onChange={(e) => {
                props.changeRolloutStep(parseInt(e.target.value, 10));
              }}
            />
          </InputGroup>
          <Button
            onClick={() => { props.clickRollout(rolloutStep); }}
            disabled={!isRolloutReady}
            style={{ marginTop: '8px' }}
          >
            Rollout 1 episode
          </Button>
          <Badge id="rollout-help" color="secondary" style={{ 'margin-left': 15 }}>
            ?
          </Badge>
          <UncontrolledTooltip placement="top" target="rollout-help">
            This command triggers new episode of agent on server.
          </UncontrolledTooltip>
          {
            rawImageInput && !containsRecurrentModel && ((stateValueReturned && distributionType === SOFTMAX_DISTRIBUTION)
              || [DISCRETE_ACTION_VALUE, DISTRIBUTIONAL_DISCRETE_ACTION_VALUE].includes(actionValueType)) && (
                <div>
                  {
                    stateValueReturned && distributionType === SOFTMAX_DISTRIBUTION && (
                      <InputGroup style={{ marginTop: '20px' }}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>actor intensity</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          step="1"
                          value={actorIntensity}
                          onChange={(e) => {
                            props.changeActorIntensity(parseInt(e.target.value, 10));
                          }}
                        />
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>critic intensity</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          step="1"
                          value={criticIntensity}
                          onChange={(e) => {
                            props.changeCriticIntensity(parseInt(e.target.value, 10));
                          }}
                        />
                      </InputGroup>
                    )
                  }
                  {
                    [DISCRETE_ACTION_VALUE, DISTRIBUTIONAL_DISCRETE_ACTION_VALUE].includes(actionValueType) && (
                      <InputGroup style={{ marginTop: '20px' }}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>qfunc intensity</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          step="1"
                          value={qfuncIntensity}
                          onChange={(e) => {
                            props.changeQfuncIntensity(parseInt(e.target.value, 10));
                          }}
                        />
                      </InputGroup>
                    )
                  }
                  <InputGroup style={{ marginTop: '8px' }}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>from</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      step="10"
                      value={saliencyRangeLeft}
                      onChange={(e) => {
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
                      onChange={(e) => {
                        props.changeSaliencyRangeRight(parseInt(e.target.value, 10));
                      }}
                    />
                  </InputGroup>
                  <Button
                    onClick={() => {
                      props.clickSaliency(
                        rolloutId, saliencyRangeLeft, saliencyRangeRight,
                        actorIntensity, criticIntensity, qfuncIntensity
                      );
                    }}
                    disabled={!isSaliencyReady}
                    style={{ marginTop: '8px' }}
                  >
                  Create saliency map
                  </Button>
                  <Badge id="saliency-help" color="secondary" style={{ 'margin-left': 15 }}>
                    ?
                  </Badge>
                  <UncontrolledTooltip placement="top" target="saliency-help">
                    This command is time consuming. At first, try small step range.
                    And this command is available after rollout command.
                  </UncontrolledTooltip>
                </div>
            )
          }
        </CardBody>
      </Card>
    </div>
  );
};


CommandsContainer.propTypes = {
  criticIntensity: PropTypes.number.isRequired,
  actorIntensity: PropTypes.number.isRequired,
  qfuncIntensity: PropTypes.number.isRequired,
  saliencyRangeLeft: PropTypes.number.isRequired,
  saliencyRangeRight: PropTypes.number.isRequired,
  isRolloutReady: PropTypes.bool.isRequired,
  isSaliencyReady: PropTypes.bool.isRequired,
  rolloutId: PropTypes.string.isRequired,
  rawImageInput: PropTypes.bool.isRequired,
  rolloutStep: PropTypes.number.isRequired,
  stateValueReturned: PropTypes.bool.isRequired,
  distributionType: PropTypes.string,
  actionValueType: PropTypes.string,
  containsRecurrentModel: PropTypes.bool.isRequired,
  clickRollout: PropTypes.func.isRequired,
  clickSaliency: PropTypes.func.isRequired,
  changeActorIntensity: PropTypes.func.isRequired,
  changeCriticIntensity: PropTypes.func.isRequired,
  changeQfuncIntensity: PropTypes.func.isRequired,
  changeSaliencyRangeLeft: PropTypes.func.isRequired,
  changeSaliencyRangeRight: PropTypes.func.isRequired,
  changeRolloutStep: PropTypes.func.isRequired,
};

CommandsContainer.defaultProps = {
  distributionType: null,
  actionValueType: null,
};

const mapStateToProps = (state) => ({
  criticIntensity: state.saliencyIntensity.criticIntensity,
  actorIntensity: state.saliencyIntensity.actorIntensity,
  qfuncIntensity: state.saliencyIntensity.qfuncIntensity,
  saliencyRangeLeft: state.saliencyRange.saliencyRangeLeft,
  saliencyRangeRight: state.saliencyRange.saliencyRangeRight,
  isRolloutReady: !state.serverState.isJobRunning,
  isSaliencyReady: !state.serverState.isJobRunning && state.serverState.isRolloutOnMemory,
  rolloutId: path.basename(state.log.rolloutPath),
  rawImageInput: state.agentProfile.rawImageInput,
  rolloutStep: state.rollout.stepCount,
  stateValueReturned: state.agentProfile.stateValueReturned,
  distributionType: state.agentProfile.distributionType,
  actionValueType: state.agentProfile.actionValueType,
  containsRecurrentModel: state.agentProfile.containsRecurrentModel,
});

export default connect(mapStateToProps, {
  clickRollout,
  clickSaliency,
  changeActorIntensity,
  changeCriticIntensity,
  changeQfuncIntensity,
  changeSaliencyRangeLeft,
  changeSaliencyRangeRight,
  changeRolloutStep,
})(CommandsContainer);
