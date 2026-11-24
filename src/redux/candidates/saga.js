import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '@/services/apiClient';
import { CANDIDATES_ACTION_TYPES } from './actionType';
import {
  post_candidate_register_response,
  get_candidates_response,
  get_candidate_detail_response,
} from './action';

function* postCandidateRegisterSaga(action) {
  try {
    const response = yield call(apiClient.post, '/api/candidate/register', action.payload);
    yield put(post_candidate_register_response(response.data));
  } catch (error) {
    yield put({
      type: CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Registration failed',
      },
    });
  }
}

function* getCandidatesSaga() {
  try {
    const response = yield call(apiClient.get, '/api/candidates');
    yield put(get_candidates_response(response.data));
  } catch (error) {
    yield put({
      type: CANDIDATES_ACTION_TYPES.GET_CANDIDATES_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to fetch candidates',
      },
    });
  }
}

function* getCandidateDetailSaga(action) {
  try {
    const response = yield call(apiClient.get, `/api/candidates/${encodeURIComponent(action.payload)}`);
    yield put(get_candidate_detail_response(response.data));
  } catch (error) {
    yield put({
      type: CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Candidate not found',
      },
    });
  }
}

export default function* candidatesSaga() {
  yield takeLatest(CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_REQUEST, postCandidateRegisterSaga);
  yield takeLatest(CANDIDATES_ACTION_TYPES.GET_CANDIDATES_REQUEST, getCandidatesSaga);
  yield takeLatest(CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_REQUEST, getCandidateDetailSaga);
}
