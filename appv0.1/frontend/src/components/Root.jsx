import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from '../reducers';
import rootSaga from '../sagas';
import MainPage from './MainPage';

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
    <div>
      <MainPage />
    </div>
  </Provider>
);

export default Root;
