import { CANDIDATES_ACTION_TYPES } from './actionType';
import { DEFAULT_CANDIDATES } from '@/services/storageService';

const initialValues = {
  post_candidate_register_loading: false,
  post_candidate_register_data: null,
  post_candidate_register_error: null,

  get_candidates_loading: false,
  get_candidates_data: DEFAULT_CANDIDATES,
  get_candidates_error: null,

  get_candidate_detail_loading: false,
  get_candidate_detail_data: null,
  get_candidate_detail_error: null,

  current_candidate: null,
  selected_candidate: null,
};

const candidatesReducer = (state = initialValues, action) => {
  switch (action.type) {
    case CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_REQUEST:
      return {
        ...state,
        post_candidate_register_loading: true,
        post_candidate_register_error: null,
      };

    case CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_RESPONSE:
      return {
        ...state,
        post_candidate_register_loading: false,
        post_candidate_register_data: action.payload?.error ? null : action.payload,
        post_candidate_register_error: action.payload?.error || null,
        current_candidate: action.payload?.error ? state.current_candidate : action.payload?.candidate,
      };

    case CANDIDATES_ACTION_TYPES.POST_CANDIDATE_REGISTER_RESPONSE_CLEAR:
      return {
        ...state,
        post_candidate_register_data: null,
        post_candidate_register_error: null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATES_REQUEST:
      return {
        ...state,
        get_candidates_loading: true,
        get_candidates_error: null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATES_RESPONSE:
      return {
        ...state,
        get_candidates_loading: false,
        get_candidates_data: action.payload?.error ? state.get_candidates_data : action.payload,
        get_candidates_error: action.payload?.error || null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATES_RESPONSE_CLEAR:
      return {
        ...state,
        get_candidates_error: null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_REQUEST:
      return {
        ...state,
        get_candidate_detail_loading: true,
        get_candidate_detail_error: null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_RESPONSE:
      return {
        ...state,
        get_candidate_detail_loading: false,
        get_candidate_detail_data: action.payload?.error ? null : action.payload,
        get_candidate_detail_error: action.payload?.error || null,
      };

    case CANDIDATES_ACTION_TYPES.GET_CANDIDATE_DETAIL_RESPONSE_CLEAR:
      return {
        ...state,
        get_candidate_detail_data: null,
        get_candidate_detail_error: null,
      };

    case CANDIDATES_ACTION_TYPES.SET_CURRENT_CANDIDATE:
      return {
        ...state,
        current_candidate: action.payload,
      };

    case CANDIDATES_ACTION_TYPES.SET_SELECTED_CANDIDATE:
      return {
        ...state,
        selected_candidate: action.payload,
      };

    default:
      return state;
  }
};

export default candidatesReducer;
