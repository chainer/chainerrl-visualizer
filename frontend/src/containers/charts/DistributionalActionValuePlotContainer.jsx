import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Label,
} from 'recharts';


/* eslint-disable prefer-destructuring */

const DistributionalActionValuePlotContainer = ({ actionMeanings, actionColors, qvalueDist }) => (
  <div>
    <BarChart
      width={830}
      height={450}
      data={qvalueDist}
    >
      {
          Object.values(actionMeanings).map((actionMeaning, idx) => (
            <Bar dataKey={actionMeaning} stackId="a" key={actionMeaning} fill={actionColors[idx]} />
          ))
        }
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="z_value">
        <Label value="Expected return" position="insideBottomLeft" offset={-10} />
      </XAxis>
      <YAxis
        label={{
          value: 'Probability', angle: -90, position: 'insideLeft', offset: 2,
        }}
      />
      <Legend align="right" width={700} />
    </BarChart>
  </div>
);

const mapStateToQvalueDist = (state) => {
  const logDataRow = state.log.logDataRows[state.plotRange.focusedStep];
  const actionMeanings = state.serverState.actionMeanings;

  if (!logDataRow || !Object.prototype.hasOwnProperty.call(logDataRow, 'qvalue_dist')) {
    return [];
  }

  const qvalueDist = [];
  for (let i = 0; i < logDataRow.qvalue_dist.length; i++) {
    const rowArr = logDataRow.qvalue_dist[i];
    const rowObj = {};
    for (let j = 0; j < rowArr.length; j++) {
      rowObj[actionMeanings[j]] = rowArr[j];
    }
    rowObj.z_value = logDataRow.z_values[i];
    qvalueDist.push(rowObj);
  }

  return qvalueDist;
};

DistributionalActionValuePlotContainer.propTypes = {
  actionMeanings: PropTypes.object.isRequired, /* eslint-disable-line react/forbid-prop-types */
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  qvalueDist: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

const mapStateToProps = (state) => ({
  actionColors: state.settings.actionColors,
  actionMeanings: state.settings.actionMeanings,
  qvalueDist: mapStateToQvalueDist(state),
});

export default connect(mapStateToProps, null)(DistributionalActionValuePlotContainer);
