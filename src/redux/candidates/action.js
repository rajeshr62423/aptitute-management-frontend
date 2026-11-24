import { CANDIDATES_ACTION_TYPES } from './actionType';

export const post_candidate_register_request = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_REQUEST,
  payload,
});

export const post_candidate_register_response = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_RESPONSE,
  payload,
});

export const post_candidate_register_response_clear = () => ({
  type: CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_RESPONSE_CLEAR,
});

export const get_candidates_request = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATES_REQUEST,
  payload,
});

export const get_candidates_response = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATES_RESPONSE,
  payload,
});

export const get_candidates_response_clear = () => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATES_RESPONSE_CLEAR,
});

export const get_candidate_detail_request = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_REQUEST,
  payload,
});

export const get_candidate_detail_response = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_RESPONSE,
  payload,
});

export const get_candidate_detail_response_clear = () => ({
  type: CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_RESPONSE_CLEAR,
});

export const set_current_candidate = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.SET_CURRENT_CANDIDATE,
  payload,
});

export const set_selected_candidate = (payload) => ({
  type: CANDIDATES_ACTION_TYPES.SET_SELECTED_CANDIDATE,
  payload,
});
