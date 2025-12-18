import { takeEvery, put } from 'redux-saga/effects';
import { loginSuccess, loginFailure } from '../actions/authActions';
import apiService from '../../services/api';

function* loginSaga(action) {
  try {
    const response = yield apiService.post('/auth/login', action.payload);
    const data = yield response.json();
    if (response.ok) {
      yield put(loginSuccess(data));
    } else {
      yield put(loginFailure(data.message || 'Login failed'));
    }
  } catch (error) {
    yield put(loginFailure('Login failed'));
  }
}

export function* watchAuth() {
  yield takeEvery('LOGIN_REQUEST', loginSaga);
}
