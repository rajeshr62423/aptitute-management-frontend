import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '@/services/apiClient';
import { QUESTIONS_ACTION_TYPES } from './actionType';
import {
  get_questions_response,
  post_question_response,
  put_question_response,
  delete_question_response,
} from './action';

function* getQuestionsSaga() {
  try {
    const response = yield call(apiClient.get, '/api/questions');
    yield put(get_questions_response(response.data));
  } catch (error) {
    yield put({
      type: QUESTIONS_ACTION_TYPES.GET_QUESTIONS_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to fetch questions',
      },
    });
  }
}

function* postQuestionSaga(action) {
  try {
    const response = yield call(apiClient.post, '/api/questions', action.payload);
    yield put(post_question_response(response.data));
  } catch (error) {
    yield put({
      type: QUESTIONS_ACTION_TYPES.POST_QUESTION_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to create question',
      },
    });
  }
}

function* putQuestionSaga(action) {
  try {
    const response = yield call(apiClient.put, '/api/questions', action.payload);
    yield put(put_question_response(response.data));
  } catch (error) {
    yield put({
      type: QUESTIONS_ACTION_TYPES.PUT_QUESTION_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to update question',
      },
    });
  }
}

function* deleteQuestionSaga(action) {
  try {
    yield call(apiClient.delete, `/api/questions/${action.payload}`);
    yield put(delete_question_response({ id: action.payload }));
  } catch (error) {
    yield put({
      type: QUESTIONS_ACTION_TYPES.DELETE_QUESTION_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to delete question',
      },
    });
  }
}

export default function* questionsSaga() {
  yield takeLatest(QUESTIONS_ACTION_TYPES.GET_QUESTIONS_REQUEST, getQuestionsSaga);
  yield takeLatest(QUESTIONS_ACTION_TYPES.POST_QUESTION_REQUEST, postQuestionSaga);
  yield takeLatest(QUESTIONS_ACTION_TYPES.PUT_QUESTION_REQUEST, putQuestionSaga);
  yield takeLatest(QUESTIONS_ACTION_TYPES.DELETE_QUESTION_REQUEST, deleteQuestionSaga);
}
