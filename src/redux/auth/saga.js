import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '@/services/apiClient';
import { setStorage } from '@/services/storageService';
import { AUTH_ACTION_TYPES } from './actionType';
import {
  post_candidate_login_response,
  post_admin_login_response,
  post_admin_logout_response,
} from './action';

function* postCandidateLoginSaga(action) {
  try {
    const response = yield call(apiClient.post, '/api/candidate/login', action.payload);
    yield put(post_candidate_login_response(response.data));
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Login failed',
      },
    });
  }
}

function* postAdminLoginSaga(action) {
  try {
    const response = yield call(apiClient.post, '/api/admin/login', action.payload);
    const token = response.data?.token;
    const rememberMe = Boolean(action.payload?.rememberMe);

    if (typeof window !== 'undefined' && token) {
      if (rememberMe) {
        // Persistent session across browser restarts
        localStorage.setItem('ap_admin_token', token);
        localStorage.setItem('ap_admin_remember', 'true');
        setStorage('admin', true);
        // Clear any session-specific storage
        sessionStorage.removeItem('ap_admin_token');
        sessionStorage.removeItem('ap_admin');
      } else {
        // Session-only: token lives only in sessionStorage (cleared on browser/tab exit)
        sessionStorage.setItem('ap_admin_token', token);
        sessionStorage.setItem('ap_admin', JSON.stringify(true));
        // Ensure nothing persistent remains in localStorage
        localStorage.removeItem('ap_admin_token');
        localStorage.removeItem('ap_admin_remember');
        localStorage.removeItem('ap_admin');
      }
    }
    yield put(post_admin_login_response(response.data));
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Invalid credentials',
      },
    });
  }
}

function* postAdminLogoutSaga() {
  try {
    if (typeof window !== 'undefined') {
      // Clear persistent storage
      localStorage.removeItem('ap_admin_token');
      localStorage.removeItem('ap_admin_remember');
      localStorage.removeItem('ap_admin');
      setStorage('admin', false);
      // Clear session storage
      sessionStorage.removeItem('ap_admin_token');
      sessionStorage.removeItem('ap_admin');
    }
    yield put(post_admin_logout_response());
  } catch (error) {
    yield put(post_admin_logout_response());
  }
}

export default function* authSaga() {
  yield takeLatest(AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_REQUEST, postCandidateLoginSaga);
  yield takeLatest(AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_REQUEST, postAdminLoginSaga);
  yield takeLatest(AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_REQUEST, postAdminLogoutSaga);
}
