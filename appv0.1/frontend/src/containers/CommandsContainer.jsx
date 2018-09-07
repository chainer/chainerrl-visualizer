import React from 'react';
import {
  Card, CardBody, CardTitle, CardText,
} from 'reactstrap';

const CommandsContainer = () => (
  <div>
    <Card>
      <CardBody>
        <CardTitle>
          Commands
        </CardTitle>
        <CardText style={{ padding: '90px' }} />
      </CardBody>
    </Card>
  </div>
);

export default CommandsContainer;
