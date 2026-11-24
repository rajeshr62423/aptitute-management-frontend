import { QUESTIONS_ACTION_TYPES } from './actionType';

export const get_questions_request = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.GET_QUESTIONS_REQUEST,
  payload,
});

export const get_questions_response = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.GET_QUESTIONS_RESPONSE,
  payload,
});

export const get_questions_response_clear = () => ({
  type: QUESTIONS_ACTION_TYPES.GET_QUESTIONS_RESPONSE_CLEAR,
});

export const post_question_request = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.POST_QUESTION_REQUEST,
  payload,
});

export const post_question_response = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.POST_QUESTION_RESPONSE,
  payload,
});

export const post_question_response_clear = () => ({
  type: QUESTIONS_ACTION_TYPES.POST_QUESTION_RESPONSE_CLEAR,
});

export const put_question_request = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.PUT_QUESTION_REQUEST,
  payload,
});

export const put_question_response = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.PUT_QUESTION_RESPONSE,
  payload,
});

export const put_question_response_clear = () => ({
  type: QUESTIONS_ACTION_TYPES.PUT_QUESTION_RESPONSE_CLEAR,
});

export const delete_question_request = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.DELETE_QUESTION_REQUEST,
  payload,
});

export const delete_question_response = (payload) => ({
  type: QUESTIONS_ACTION_TYPES.DELETE_QUESTION_RESPONSE,
  payload,
});

export const delete_question_response_clear = () => ({
  type: QUESTIONS_ACTION_TYPES.DELETE_QUESTION_RESPONSE_CLEAR,
});
