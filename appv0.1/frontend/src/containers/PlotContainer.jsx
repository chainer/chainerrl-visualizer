import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, CardText,
} from 'reactstrap';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

import { hoverOnStep } from '../actions';

class PlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
  }

  render() {
    const { agentType, logDataRows, focusedStep } = this.props;

    if (agentType !== 'CategoricalDQN') {
      return (
        <div>
          <Card>
            <CardBody>
              <CardTitle>
                Plot
              </CardTitle>
              <CardText style={{ padding: '180px' }} />
            </CardBody>
          </Card>
        </div>
      );
    }

    /* CategoricalDQN */
    return (
      <div>
        <LineChart
          width={900}
          height={460}
          data={logDataRows}
          ref={this.chartRef}
          onMouseMove={() => {
            /* eslint-disable-next-line react/destructuring-assignment */
            this.props.hoverOnStep(this.chartRef.current.state.activeLabel);
          }}
        >
          {
            logDataRows.length > 0 && logDataRows[0].qvalues.map((qvalue, idx) => (
              <Line
                type="monotone"
                dot={false}
                dataKey={(v) => v.qvalues[idx]}
                key={idx} /* eslint-disable-line react/no-array-index-key */ // TODO: semantics of qvalues
              />
            ))
          }
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="steps" />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickFormatter={(v) => Number.parseFloat(v).toFixed(3)}
          />
          <Tooltip />
          <ReferenceLine x={focusedStep} stroke="green" />
        </LineChart>
      </div>
    );
  }
}

PlotContainer.propTypes = {
  agentType: PropTypes.string.isRequired,
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedStep: PropTypes.number.isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  agentType: state.serverState.agentType,
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  focusedStep: state.plotRange.focusedStep,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(PlotContainer);
