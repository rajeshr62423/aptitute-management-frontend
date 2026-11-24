import { DASHBOARD_ACTION_TYPES } from './actionType';

export const get_dashboard_stats_request = () => ({
  type: DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_REQUEST,
});

export const get_dashboard_stats_response = (payload) => ({
  type: DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_RESPONSE,
  payload,
});

export const get_dashboard_stats_response_clear = () => ({
  type: DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_RESPONSE_CLEAR,
});
