import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input, FormGroup,
} from 'reactstrap';

import {
  GAUSSIAN_DISTRIBUTION_PLOT,
  mapAgentProfileToChartList,
} from '../settings';
import { changeDisplayedChart, toggleActionDimensionSelect } from '../actions';

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
      selectedActionDimensionIndices, actionMeanings, agentProfile,
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
              // TODO: deal with multiple pane switching
               mapAgentProfileToChartList(agentProfile).includes(GAUSSIAN_DISTRIBUTION_PLOT) && (
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
  actionMeanings: PropTypes.object.isRequired,
  agentProfile: PropTypes.object.isRequired,
  changeDisplayedChart: PropTypes.func.isRequired,
  toggleActionDimensionSelect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  selectedActionDimensionIndices: state.chartControl.selectedActionDimensionIndices,
  actionMeanings: state.settings.actionMeanings,
  agentProfile: state.agentProfile,
});

export default connect(mapStateToProps, {
  changeDisplayedChart,
  toggleActionDimensionSelect,
})(ChartSwitchContainer);
