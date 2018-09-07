import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import injectISO8601DateParser from './utils/date_parser';

injectISO8601DateParser();

document.addEventListener('DOMContentLoaded', () => {
  const rootNode = document.getElementById('chainerrlui-root');
  ReactDOM.render(<Root />, rootNode);
});
