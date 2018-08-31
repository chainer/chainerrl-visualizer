import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

import ProjectsContainer from '../containers/ProjectsContainer';
import ExperimentsContainer from '../containers/ExperimentsContainer';
import DetailContainer from '../containers/DetailContainer';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(rootSaga);

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/projects/:projectId/experiments/:experimentId" component={DetailContainer} />
          <Route path="/projects/:projectId" component={ExperimentsContainer} />
          <Route path="/" component={ProjectsContainer} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

export default Root;
