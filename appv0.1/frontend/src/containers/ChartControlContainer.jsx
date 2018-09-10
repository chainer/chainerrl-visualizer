import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, Button, InputGroup, Input, InputGroupAddon,
} from 'reactstrap';

import {
  clickPrevStep, clickNextStep, changePlotRangeLeft, changePlotRangeRight,
} from '../actions';

/* eslint-disable no-shadow */

const ChartControlContainer = ({
  plotRangeLeft, plotRangeRight, clickPrevStep, clickNextStep, changePlotRangeLeft, changePlotRangeRight,
}) => (
  <div>
    <Card>
      <CardBody>
        <CardTitle>ChartControl</CardTitle>
        <Button
          onClick={clickPrevStep}
        >
          -1 (prev step)
        </Button>
        {' '}
        <Button
          onClick={clickNextStep}
        >
          +1 (next step)
        </Button>
        <InputGroup style={{ marginTop: '15px' }}>
          <InputGroupAddon addonType="prepend">
            Left
          </InputGroupAddon>
          <Input
            type="number"
            step="10"
            value={plotRangeLeft}
            onInput={(e) => { changePlotRangeLeft(parseInt(e.target.value, 10)); }}
          />
          <InputGroupAddon addonType="prepend">
            Right
          </InputGroupAddon>
          <Input
            type="number"
            step="10"
            value={plotRangeRight}
            onInput={(e) => { changePlotRangeRight(parseInt(e.target.value, 10)); }}
          />
        </InputGroup>
      </CardBody>
    </Card>
  </div>
);

ChartControlContainer.propTypes = {
  plotRangeLeft: PropTypes.number.isRequired,
  plotRangeRight: PropTypes.number.isRequired,
  clickPrevStep: PropTypes.func.isRequired,
  clickNextStep: PropTypes.func.isRequired,
  changePlotRangeLeft: PropTypes.func.isRequired,
  changePlotRangeRight: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  plotRangeLeft: state.plotRange.plotRangeLeft,
  plotRangeRight: state.plotRange.plotRangeRight,
});

export default connect(mapStateToProps, {
  clickPrevStep,
  clickNextStep,
  changePlotRangeLeft,
  changePlotRangeRight,
})(ChartControlContainer);
