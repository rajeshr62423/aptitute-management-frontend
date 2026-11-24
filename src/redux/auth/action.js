import { AUTH_ACTION_TYPES } from './actionType';

export const post_candidate_login_request = (payload) => ({
  type: AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_REQUEST,
  payload,
});

export const post_candidate_login_response = (payload) => ({
  type: AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_RESPONSE,
  payload,
});

export const post_candidate_login_response_clear = () => ({
  type: AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_RESPONSE_CLEAR,
});

export const post_admin_login_request = (payload) => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_REQUEST,
  payload,
});

export const post_admin_login_response = (payload) => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_RESPONSE,
  payload,
});

export const post_admin_login_response_clear = () => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_RESPONSE_CLEAR,
});

export const post_admin_logout_request = () => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_REQUEST,
});

export const post_admin_logout_response = () => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_RESPONSE,
});

export const post_admin_logout_response_clear = () => ({
  type: AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_RESPONSE_CLEAR,
});

export const init_auth_state = () => ({
  type: AUTH_ACTION_TYPES.INIT_AUTH_STATE,
});
