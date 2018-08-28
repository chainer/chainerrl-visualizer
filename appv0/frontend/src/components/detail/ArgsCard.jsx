import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';

const ArgsCard = ({ experiment }) => (
  <Card>
    <CardBody>
      <CardTitle>Args</CardTitle>
      {
        experiment.args && (
          Object.keys(experiment.args).map((key) => (
            <p key={key}>
              <strong>
                (
                {key}
                )
              </strong>
              {' '}
              {experiment.args[key]}
            </p>
          ))
        )
      }
    </CardBody>
  </Card>
);

ArgsCard.propTypes = {
  experiment: PropTypes.shape({
    args: PropTypes.object,
  }).isRequired,
};

export default ArgsCard;
