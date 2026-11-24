import { all, fork } from 'redux-saga/effects';

import authSaga from './auth/saga';
import candidatesSaga from './candidates/saga';
import questionsSaga from './questions/saga';
import assessmentSaga from './assessment/saga';
import dashboardSaga from './dashboard/saga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(candidatesSaga),
    fork(questionsSaga),
    fork(assessmentSaga),
    fork(dashboardSaga),
  ]);
}
