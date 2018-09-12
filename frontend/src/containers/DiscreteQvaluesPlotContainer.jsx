import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

import { hoverOnStep } from '../actions';

class DiscreteQvaluesPlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
  }

  render() {
    const { logDataRows, focusedStep } = this.props;

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

DiscreteQvaluesPlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedStep: PropTypes.number.isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  focusedStep: state.plotRange.focusedStep,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(DiscreteQvaluesPlotContainer);
