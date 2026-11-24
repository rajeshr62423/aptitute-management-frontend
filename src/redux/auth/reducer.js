import { AUTH_ACTION_TYPES } from './actionType';
import { getStorage } from '@/services/storageService';

const initialValues = {
  post_candidate_loading: false,
  post_candidate_data: null,
  post_candidate_error: null,

  post_admin_loading: false,
  post_admin_data: null,
  post_admin_error: null,

  isAuthenticated: false,
  adminUser: null,
};

const authReducer = (state = initialValues, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.INIT_AUTH_STATE: {
      let isAuth = false;
      if (typeof window !== 'undefined') {
        const token =
          sessionStorage.getItem('ap_admin_token') ||
          localStorage.getItem('ap_admin_token');
        const sessionAuth = sessionStorage.getItem('ap_admin');
        const localAuth = getStorage('admin', false);
        isAuth = Boolean(token && (sessionAuth || localAuth));
      }
      return {
        ...state,
        isAuthenticated: isAuth,
        adminUser: isAuth
          ? {
              name: 'Administrator',
              email: 'admin@aptitudepro.com',
              role: 'Super Administrator',
            }
          : null,
      };
    }

    case AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_REQUEST:
      return {
        ...state,
        post_candidate_loading: true,
        post_candidate_error: null,
      };

    case AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_RESPONSE:
      return {
        ...state,
        post_candidate_loading: false,
        post_candidate_data: action.payload?.error ? null : action.payload,
        post_candidate_error: action.payload?.error || null,
      };

    case AUTH_ACTION_TYPES.POST_CANDIDATE_LOGIN_RESPONSE_CLEAR:
      return {
        ...state,
        post_candidate_data: null,
        post_candidate_error: null,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_REQUEST:
      return {
        ...state,
        post_admin_loading: true,
        post_admin_error: null,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_RESPONSE:
      return {
        ...state,
        post_admin_loading: false,
        post_admin_data: action.payload?.error ? null : action.payload,
        post_admin_error: action.payload?.error || null,
        isAuthenticated: !action.payload?.error,
        adminUser: action.payload?.error ? null : action.payload?.user,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGIN_RESPONSE_CLEAR:
      return {
        ...state,
        post_admin_data: null,
        post_admin_error: null,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_REQUEST:
      return {
        ...state,
        post_admin_loading: true,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_RESPONSE:
      return {
        ...state,
        post_admin_loading: false,
        isAuthenticated: false,
        adminUser: null,
        post_admin_data: null,
        post_admin_error: null,
      };

    case AUTH_ACTION_TYPES.POST_ADMIN_LOGOUT_RESPONSE_CLEAR:
      return {
        ...state,
        post_admin_error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
