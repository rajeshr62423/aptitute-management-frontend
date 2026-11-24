'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import CandidateLayout from '@/components/layout/CandidateLayout';
import ResultSummary from '@/components/assessment/ResultSummary';
import { set_current_candidate } from '@/redux/candidates/action';

export default function CandidateResultPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { selected_candidate, get_candidates_data } = useSelector((state) => state.candidates);
  const { get_settings_data: settings } = useSelector((state) => state.assessment);
  const { get_questions_data: questions } = useSelector((state) => state.questions);

  const candidate = selected_candidate || (get_candidates_data && get_candidates_data[0]) || null;
  const activeQuestions = (questions || [])
    .filter((q) => q.active)
    .slice(0, settings?.total || questions?.length || 10);
  const maxScore = activeQuestions.length * (settings?.correct || 2);

  const handleDone = () => {
    dispatch(set_current_candidate(null));
    router.push('/register');
  };

  const rightContent = (
    <span className="small">{candidate?.name || 'Candidate'}</span>
  );

  return (
    <CandidateLayout rightContent={rightContent}>
      <ResultSummary
        candidate={candidate}
        maxScore={candidate?.maxScore || maxScore}
        onDone={handleDone}
      />
    </CandidateLayout>
  );
}
