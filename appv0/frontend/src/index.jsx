import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';

import Root from './components/Root';

document.addEventListener('DOMContentLoaded', () => {
  const rootNode = document.getElementById('chainerrlui-root');
  ReactDOM.render(<Root />, rootNode);
});
