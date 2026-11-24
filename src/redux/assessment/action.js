import { ASSESSMENT_ACTION_TYPES } from './actionType';

export const get_settings_request = () => ({
  type: ASSESSMENT_ACTION_TYPES.GET_SETTINGS_REQUEST,
});

export const get_settings_response = (payload) => ({
  type: ASSESSMENT_ACTION_TYPES.GET_SETTINGS_RESPONSE,
  payload,
});

export const get_settings_response_clear = () => ({
  type: ASSESSMENT_ACTION_TYPES.GET_SETTINGS_RESPONSE_CLEAR,
});

export const put_settings_request = (payload) => ({
  type: ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_REQUEST,
  payload,
});

export const put_settings_response = (payload) => ({
  type: ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_RESPONSE,
  payload,
});

export const put_settings_response_clear = () => ({
  type: ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_RESPONSE_CLEAR,
});

export const post_assessment_submit_request = (payload) => ({
  type: ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_REQUEST,
  payload,
});

export const post_assessment_submit_response = (payload) => ({
  type: ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_RESPONSE,
  payload,
});

export const post_assessment_submit_response_clear = () => ({
  type: ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_RESPONSE_CLEAR,
});
