import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import devTools from 'remote-redux-devtools';

const enhancer = compose(
  applyMiddleware(thunk),
  devTools({
    name: 'Electron',
    hostname: 'localhost',
    port: 5678
  })
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
