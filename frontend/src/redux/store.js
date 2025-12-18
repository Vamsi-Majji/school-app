import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from './reducers/authReducer';
import { watchAuth } from './sagas/authSaga';

const rootReducer = combineReducers({
  auth: authReducer,
});

function* rootSaga() {
  yield all([
    watchAuth(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
