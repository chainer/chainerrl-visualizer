import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody,
} from 'reactstrap';
import {
  BarChart, Bar, LabelList, XAxis, YAxis,
} from 'recharts';

const DiscreteQvaluesContainer = ({ sortedQvalues }) => (
  <div>
    <Card>
      <CardBody>
        <BarChart
          layout="vertical"
          width={390}
          height={330}
          data={sortedQvalues}
        >
          <Bar dataKey="qvalue" fill="#8884d8">
            <LabelList
              dataKey="name"
              position="insideRight"
              style={{ fontSize: '8px' }}
            />
          </Bar>
          <XAxis
            type="number"
            tickFormatter={(v) => Number.parseFloat(v).toFixed(3)}
            domain={['dataMin - 0.05', 'dataMax']}
          />
          <YAxis
            type="category"
            tick={false}
            width={2}
          />
        </BarChart>
      </CardBody>
    </Card>
  </div>
);

DiscreteQvaluesContainer.propTypes = {
  sortedQvalues: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToSortedQvalues = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.serverState.actionMeanings; /* eslint-disable-line prefer-destructuring */

  if (!logDataRow) {
    return [];
  }

  if (!Object.prototype.hasOwnProperty.call(logDataRow, 'qvalues')) {
    return [];
  }

  return logDataRow.qvalues.map((qvalue, idx) => (
    { name: actionMeanings[idx], qvalue }
  )).sort((a, b) => (
    b.qvalue - a.qvalue
  ));
};

const mapStateToProps = (state) => ({
  sortedQvalues: mapStateToSortedQvalues(state),
});

export default connect(mapStateToProps, null)(DiscreteQvaluesContainer);
