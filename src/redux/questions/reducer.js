import { QUESTIONS_ACTION_TYPES } from './actionType';
import { DEFAULT_QUESTIONS } from '@/services/storageService';

const initialValues = {
  get_questions_loading: false,
  get_questions_data: DEFAULT_QUESTIONS,
  get_questions_error: null,

  post_question_loading: false,
  post_question_data: null,
  post_question_error: null,

  put_question_loading: false,
  put_question_data: null,
  put_question_error: null,

  delete_question_loading: false,
  delete_question_data: null,
  delete_question_error: null,
};

const questionsReducer = (state = initialValues, action) => {
  switch (action.type) {
    case QUESTIONS_ACTION_TYPES.GET_QUESTIONS_REQUEST:
      return {
        ...state,
        get_questions_loading: true,
        get_questions_error: null,
      };

    case QUESTIONS_ACTION_TYPES.GET_QUESTIONS_RESPONSE:
      return {
        ...state,
        get_questions_loading: false,
        get_questions_data: action.payload?.error ? state.get_questions_data : action.payload,
        get_questions_error: action.payload?.error || null,
      };

    case QUESTIONS_ACTION_TYPES.GET_QUESTIONS_RESPONSE_CLEAR:
      return {
        ...state,
        get_questions_error: null,
      };

    case QUESTIONS_ACTION_TYPES.POST_QUESTION_REQUEST:
      return {
        ...state,
        post_question_loading: true,
        post_question_error: null,
      };

    case QUESTIONS_ACTION_TYPES.POST_QUESTION_RESPONSE: {
      const isSuccess = !action.payload?.error;
      const updatedList = isSuccess
        ? [...state.get_questions_data, action.payload]
        : state.get_questions_data;
      return {
        ...state,
        post_question_loading: false,
        post_question_data: isSuccess ? action.payload : null,
        post_question_error: action.payload?.error || null,
        get_questions_data: updatedList,
      };
    }

    case QUESTIONS_ACTION_TYPES.POST_QUESTION_RESPONSE_CLEAR:
      return {
        ...state,
        post_question_data: null,
        post_question_error: null,
      };

    case QUESTIONS_ACTION_TYPES.PUT_QUESTION_REQUEST:
      return {
        ...state,
        put_question_loading: true,
        put_question_error: null,
      };

    case QUESTIONS_ACTION_TYPES.PUT_QUESTION_RESPONSE: {
      const isSuccess = !action.payload?.error;
      const updatedList = isSuccess
        ? state.get_questions_data.map((q) =>
            Number(q.id) === Number(action.payload.id) ? { ...q, ...action.payload } : q
          )
        : state.get_questions_data;
      return {
        ...state,
        put_question_loading: false,
        put_question_data: isSuccess ? action.payload : null,
        put_question_error: action.payload?.error || null,
        get_questions_data: updatedList,
      };
    }

    case QUESTIONS_ACTION_TYPES.PUT_QUESTION_RESPONSE_CLEAR:
      return {
        ...state,
        put_question_data: null,
        put_question_error: null,
      };

    case QUESTIONS_ACTION_TYPES.DELETE_QUESTION_REQUEST:
      return {
        ...state,
        delete_question_loading: true,
        delete_question_error: null,
      };

    case QUESTIONS_ACTION_TYPES.DELETE_QUESTION_RESPONSE: {
      const isSuccess = !action.payload?.error;
      const updatedList = isSuccess
        ? state.get_questions_data.filter((q) => Number(q.id) !== Number(action.payload.id))
        : state.get_questions_data;
      return {
        ...state,
        delete_question_loading: false,
        delete_question_data: isSuccess ? action.payload : null,
        delete_question_error: action.payload?.error || null,
        get_questions_data: updatedList,
      };
    }

    case QUESTIONS_ACTION_TYPES.DELETE_QUESTION_RESPONSE_CLEAR:
      return {
        ...state,
        delete_question_data: null,
        delete_question_error: null,
      };

    default:
      return state;
  }
};

export default questionsReducer;
