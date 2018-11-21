import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, Button, InputGroup, Input, InputGroupAddon,
} from 'reactstrap';

import {
  clickPrevStep, clickNextStep, changePlotRangeLeft, changePlotRangeRight,
} from '../actions';

const ARROW_LEFT_KEY = 37;
const ARROW_RIGHT_KEY = 39;

/* eslint-disable react/destructuring-assignment */

class ChartControlContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onArrowPress = this.onArrowPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onArrowPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onArrowPress, false);
  }

  onArrowPress(e) {
    if (e.keyCode === ARROW_LEFT_KEY) {
      this.props.clickPrevStep();
    } else if (e.keyCode === ARROW_RIGHT_KEY) {
      this.props.clickNextStep();
    }
  }

  render() {
    const { plotRangeRight, plotRangeLeft } = this.props;

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle>ChartControl</CardTitle>
            <Button
              onClick={this.props.clickPrevStep}
            >
              -1 (prev step)
            </Button>
            {' '}
            <Button
              onClick={this.props.clickNextStep}
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
                onChange={(e) => { this.props.changePlotRangeLeft(parseInt(e.target.value, 10)); }}
              />
              <InputGroupAddon addonType="prepend">
                Right
              </InputGroupAddon>
              <Input
                type="number"
                step="10"
                value={plotRangeRight}
                onChange={(e) => { this.props.changePlotRangeRight(parseInt(e.target.value, 10)); }}
              />
            </InputGroup>
          </CardBody>
        </Card>
      </div>
    );
  }
}

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
