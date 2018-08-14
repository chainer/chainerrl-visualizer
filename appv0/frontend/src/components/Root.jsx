import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import rootReducer from '../reducers';
import ProjectsContainer from '../containers/ProjectsContainer';
import ExperimentsContainer from '../containers/ExperimentsContainer';
import DetailContainer from '../containers/DetailContainer';

const middlewares = [thunk];
const store = createStore(
  rootReducer,
  {},
  applyMiddleware(...middlewares)
);

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/projects/:projectId" component={ExperimentsContainer} />
          <Route path="/experiments/:experimentId" component={DetailContainer} />
          <Route path="/" component={ProjectsContainer} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

export default Root;
