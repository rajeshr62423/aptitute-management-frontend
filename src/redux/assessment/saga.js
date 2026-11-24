import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '@/services/apiClient';
import { clearTestRecovery } from '@/services/assessmentService';
import { ASSESSMENT_ACTION_TYPES } from './actionType';
import {
  get_settings_response,
  put_settings_response,
  post_assessment_submit_response,
} from './action';
import { CANDIDATES_ACTION_TYPES } from '../candidates/actionType';

function* getSettingsSaga() {
  try {
    const response = yield call(apiClient.get, '/api/assessment/settings');
    yield put(get_settings_response(response.data));
  } catch (error) {
    yield put({
      type: ASSESSMENT_ACTION_TYPES.GET_SETTINGS_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to fetch settings',
      },
    });
  }
}

function* putSettingsSaga(action) {
  try {
    const response = yield call(apiClient.put, '/api/assessment/settings', action.payload);
    yield put(put_settings_response(response.data));
  } catch (error) {
    yield put({
      type: ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to save settings',
      },
    });
  }
}

function* postAssessmentSubmitSaga(action) {
  try {
    const response = yield call(apiClient.post, '/api/assessment/submit', action.payload);
    clearTestRecovery();
    yield put(post_assessment_submit_response(response.data));
    yield put({
      type: CANDIDATES_ACTION_TYPES.SET_SELECTED_CANDIDATE,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to submit assessment',
      },
    });
  }
}

export default function* assessmentSaga() {
  yield takeLatest(ASSESSMENT_ACTION_TYPES.GET_SETTINGS_REQUEST, getSettingsSaga);
  yield takeLatest(ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_REQUEST, putSettingsSaga);
  yield takeLatest(ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_REQUEST, postAssessmentSubmitSaga);
}
