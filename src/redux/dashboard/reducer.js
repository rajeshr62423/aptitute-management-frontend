import { DASHBOARD_ACTION_TYPES } from './actionType';

const initialValues = {
  get_dashboard_stats_loading: false,
  get_dashboard_stats_data: null,
  get_dashboard_stats_error: null,
};

const dashboardReducer = (state = initialValues, action) => {
  switch (action.type) {
    case DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_REQUEST:
      return {
        ...state,
        get_dashboard_stats_loading: true,
        get_dashboard_stats_error: null,
      };

    case DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_RESPONSE:
      return {
        ...state,
        get_dashboard_stats_loading: false,
        get_dashboard_stats_data: action.payload?.error ? state.get_dashboard_stats_data : action.payload,
        get_dashboard_stats_error: action.payload?.error || null,
      };

    case DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_RESPONSE_CLEAR:
      return {
        ...state,
        get_dashboard_stats_data: null,
        get_dashboard_stats_error: null,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
