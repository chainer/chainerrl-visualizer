import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input, FormGroup,
} from 'reactstrap';

import { AGENT_TO_VALUES_PANE, CONTINUOUS_STOCHASTIC_ACTIONS_PANE, mapAgentProfileToChartList } from '../settings/agent';
import { changeDisplayedChart, toggleActionDimensionSelect } from '../actions';

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
    const {
      selectedActionDimensionIndices, agentType, actionMeanings, agentProfile,
    } = this.props;

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
                  mapAgentProfileToChartList(agentProfile).map((chartName) => (
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
            {
               AGENT_TO_VALUES_PANE[agentType] === CONTINUOUS_STOCHASTIC_ACTIONS_PANE && (
                 <div style={{ marginTop: '10px' }}>
                   {
                     Object.keys(actionMeanings).map((key) => (
                       <FormGroup check key={key}>
                         <Label check>
                           <Input
                             type="checkbox"
                             value={key}
                             checked={selectedActionDimensionIndices.includes(parseInt(key, 10))}
                             onChange={(e) => { this.props.toggleActionDimensionSelect(parseInt(e.target.value, 10)); }}
                           />
                           {actionMeanings[key]}
                         </Label>
                       </FormGroup>
                     ))
                   }
                 </div>
               )
            }
          </CardBody>
        </Card>
      </div>
    );
  }
}

ChartSwitchContainer.propTypes = {
  selectedActionDimensionIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  agentType: PropTypes.string.isRequired,
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  agentProfile: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  changeDisplayedChart: PropTypes.func.isRequired,
  toggleActionDimensionSelect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  selectedActionDimensionIndices: state.selectedActionDimensionIndices,
  agentType: state.agentProfile.agentType,
  actionMeanings: state.serverState.actionMeanings,
  agentProfile: state.agentProfile,
});

export default connect(mapStateToProps, {
  changeDisplayedChart,
  toggleActionDimensionSelect,
})(ChartSwitchContainer);
