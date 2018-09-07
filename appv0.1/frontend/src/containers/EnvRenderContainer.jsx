import React from 'react';
import {
  Card, CardBody, CardTitle, CardText,
} from 'reactstrap';

const EnvRenderContainer = () => (
  <div>
    <Card style={{ 'margin-top': '5px' }}>
      <CardBody>
        <CardTitle>
          Render
        </CardTitle>
        <CardText style={{ padding: '154px' }} />
      </CardBody>
    </Card>
  </div>
);

export default EnvRenderContainer;
