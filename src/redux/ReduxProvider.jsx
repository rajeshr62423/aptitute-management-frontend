'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { init_auth_state } from './auth/action';
import { get_questions_request } from './questions/action';
import { get_settings_request } from './assessment/action';
import { get_candidates_request } from './candidates/action';
import { get_dashboard_stats_request } from './dashboard/action';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(init_auth_state());
    store.dispatch(get_questions_request());
    store.dispatch(get_settings_request());
    store.dispatch(get_candidates_request());
    store.dispatch(get_dashboard_stats_request());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
