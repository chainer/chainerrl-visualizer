import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import ProjectsContainer from '../containers/ProjectsContainer';

const middlewares = [thunk];
const store = createStore(
  rootReducer,
  {},
  applyMiddleware(...middlewares)
);

const Root = () => (
  <Provider store={store}>
    <ProjectsContainer />
  </Provider>
);

export default Root;
