import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';

const EnvironCard = ({ experiment }) => (
  <Card>
    <CardBody>
      <CardTitle>Environ</CardTitle>
      {
        experiment.environ && (
          Object.keys(experiment.environ).map((key) => (
            <p key={key}>
              <strong>
                (
                {key}
                )
              </strong>
              {' '}
              {experiment.environ[key]}
            </p>
          ))
        )
      }
    </CardBody>
  </Card>
);

EnvironCard.propTypes = {
  experiment: PropTypes.shape({
    environ: PropTypes.object,
  }).isRequired,
};

export default EnvironCard;
