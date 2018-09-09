import React from 'react';
import {
  Card, CardBody, CardTitle, CardText,
} from 'reactstrap';

const StepCountContainer = () => (
  <div>
    <Card>
      <CardBody style={{ padding: '0.25rem', paddingLeft: '20px' }}>
        <CardTitle>
          Step / Reward
        </CardTitle>
        <CardText style={{ padding: '0px' }} />
      </CardBody>
    </Card>
  </div>
);

export default StepCountContainer;
