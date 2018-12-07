import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';

document.addEventListener('DOMContentLoaded', () => {
  const rootNode = document.getElementById('chainerrl_visualizer-root');
  ReactDOM.render(<Root />, rootNode);
});
