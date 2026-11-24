import { ASSESSMENT_ACTION_TYPES } from './actionType';
import { DEFAULT_SETTINGS } from '@/services/storageService';

const initialValues = {
  get_settings_loading: false,
  get_settings_data: DEFAULT_SETTINGS,
  get_settings_error: null,

  put_settings_loading: false,
  put_settings_data: null,
  put_settings_error: null,

  post_assessment_submit_loading: false,
  post_assessment_submit_data: null,
  post_assessment_submit_error: null,
};

const assessmentReducer = (state = initialValues, action) => {
  switch (action.type) {
    case ASSESSMENT_ACTION_TYPES.GET_SETTINGS_REQUEST:
      return {
        ...state,
        get_settings_loading: true,
        get_settings_error: null,
      };

    case ASSESSMENT_ACTION_TYPES.GET_SETTINGS_RESPONSE:
      return {
        ...state,
        get_settings_loading: false,
        get_settings_data: action.payload?.error ? state.get_settings_data : action.payload,
        get_settings_error: action.payload?.error || null,
      };

    case ASSESSMENT_ACTION_TYPES.GET_SETTINGS_RESPONSE_CLEAR:
      return {
        ...state,
        get_settings_error: null,
      };

    case ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_REQUEST:
      return {
        ...state,
        put_settings_loading: true,
        put_settings_error: null,
      };

    case ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_RESPONSE: {
      const isSuccess = !action.payload?.error;
      return {
        ...state,
        put_settings_loading: false,
        put_settings_data: isSuccess ? action.payload : null,
        put_settings_error: action.payload?.error || null,
        get_settings_data: isSuccess ? action.payload : state.get_settings_data,
      };
    }

    case ASSESSMENT_ACTION_TYPES.PUT_SETTINGS_RESPONSE_CLEAR:
      return {
        ...state,
        put_settings_data: null,
        put_settings_error: null,
      };

    case ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_REQUEST:
      return {
        ...state,
        post_assessment_submit_loading: true,
        post_assessment_submit_error: null,
      };

    case ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_RESPONSE:
      return {
        ...state,
        post_assessment_submit_loading: false,
        post_assessment_submit_data: action.payload?.error ? null : action.payload,
        post_assessment_submit_error: action.payload?.error || null,
      };

    case ASSESSMENT_ACTION_TYPES.POST_ASSESSMENT_SUBMIT_RESPONSE_CLEAR:
      return {
        ...state,
        post_assessment_submit_data: null,
        post_assessment_submit_error: null,
      };

    default:
      return state;
  }
};

export default assessmentReducer;
