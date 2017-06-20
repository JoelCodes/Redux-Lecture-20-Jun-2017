import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import { usersReducer, usersMiddleware, fetchUser } from './reducers/users';

const root = document.getElementById('react-root');
const store = createStore(usersReducer, 
  applyMiddleware(usersMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop);

store.dispatch(fetchUser());

render(
  <Provider store={store}>
    <App/>
  </Provider>, root);
