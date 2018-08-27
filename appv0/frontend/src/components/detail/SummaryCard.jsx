import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';

const SummaryCard = ({ experiment }) => (
  <Card>
    <CardBody>
      <CardTitle>Summary</CardTitle>
      {
        (experiment.id) ? (
          <div>
            <p>
              <strong>
                (experiment id)
              </strong>
              {' '}
              {experiment.id}
            </p>
            <p>
              <strong>
                (experiment name)
              </strong>
              {' '}
              {experiment.name}
            </p>
            <p>
              <strong>
                (command)
              </strong>
              {' '}
              {experiment.command}
            </p>
            <p>
              <strong>
                (experiment path)
              </strong>
              {' '}
              {experiment.path}
            </p>
            <p>
              <strong>
                (steps)
              </strong>
              {' '}
              {experiment.log[experiment.log.length - 1].steps}
            </p>
            <p>
              <strong>
                (episodes)
              </strong>
              {' '}
              {experiment.log[experiment.log.length - 1].episodes}
            </p>
            <p>
              <strong>
                (elapsed time)
              </strong>
              {' '}
              {experiment.log[experiment.log.length - 1].elapsed}
            </p>
          </div>
        ) : (
          <p>Not loaded</p>
        )
      }
    </CardBody>
  </Card>
);

SummaryCard.propTypes = {
  experiment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    command: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    log: PropTypes.arrayOf(PropTypes.any), /* eslint-disable-line react/forbid-prop-types */
  }).isRequired,
};

export default SummaryCard;
