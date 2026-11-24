import { combineReducers } from 'redux';

import authReducer from './auth/reducer';
import candidatesReducer from './candidates/reducer';
import questionsReducer from './questions/reducer';
import assessmentReducer from './assessment/reducer';
import dashboardReducer from './dashboard/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  candidates: candidatesReducer,
  questions: questionsReducer,
  assessment: assessmentReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
