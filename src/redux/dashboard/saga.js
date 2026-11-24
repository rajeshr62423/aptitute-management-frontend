import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '@/services/apiClient';
import { DASHBOARD_ACTION_TYPES } from './actionType';
import { get_dashboard_stats_response } from './action';

function* getDashboardStatsSaga() {
  try {
    const response = yield call(apiClient.get, '/api/dashboard/stats');
    yield put(get_dashboard_stats_response(response.data));
  } catch (error) {
    yield put({
      type: DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_RESPONSE,
      payload: {
        error: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats',
      },
    });
  }
}

export default function* dashboardSaga() {
  yield takeLatest(DASHBOARD_ACTION_TYPES.GET_DASHBOARD_STATS_REQUEST, getDashboardStatsSaga);
}
