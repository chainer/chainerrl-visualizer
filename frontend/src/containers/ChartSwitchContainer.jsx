import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import { AGENT_TO_CHARTS } from '../settings/agent';
import { changeDisplayedChart } from '../actions';

/* eslint-disable react/destructuring-assignment */

class ChartSwitchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      dropDownOpen: false,
    };
  }

  toggleDropDown() {
    this.setState((prevState) => ({ dropDownOpen: !prevState.dropDownOpen }));
  }

  render() {
    const { agentType } = this.props;

    return (
      <div>
        <Card style={{ marginTop: '14px' }}>
          <CardBody>
            <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggleDropDown}>
              <DropdownToggle caret>
                Switch Displayed Gragh
              </DropdownToggle>
              <DropdownMenu>
                {
                  agentType && AGENT_TO_CHARTS[agentType].map((chartName) => (
                    <DropdownItem
                      key={chartName}
                      onClick={(e) => {
                        this.props.changeDisplayedChart(e.target.innerHTML); // FIXME: do not want to use innerHTML
                      }}
                    >
                      {chartName}
                    </DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          </CardBody>
        </Card>
      </div>
    );
  }
}

ChartSwitchContainer.propTypes = {
  agentType: PropTypes.string.isRequired,
  changeDisplayedChart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  agentType: state.serverState.agentType,
});

export default connect(mapStateToProps, {
  changeDisplayedChart,
})(ChartSwitchContainer);
