'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import CandidateLayout from '@/components/layout/CandidateLayout';
import QuestionCard from '@/components/assessment/QuestionCard';
import QuestionPalette from '@/components/assessment/QuestionPalette';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { AlertCircle } from 'lucide-react';
import { useAssessmentTimer } from '@/hooks/useAssessmentTimer';
import {
  getTestRecovery,
  saveTestRecovery,
} from '@/services/assessmentService';
import {
  post_assessment_submit_request,
  post_assessment_submit_response_clear,
} from '@/redux/assessment/action';

export default function OnlineTestPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { current_candidate: currentCandidate } = useSelector((state) => state.candidates);
  const { get_settings_data: settings, post_assessment_submit_data, post_assessment_submit_loading } = useSelector(
    (state) => state.assessment
  );
  const { get_questions_data: questions } = useSelector((state) => state.questions);

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewSet, setReviewSet] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasLoadedRecovery = useRef(false);

  const activeQuestions = useMemo(() => {
    return (questions || [])
      .filter((q) => q.active)
      .slice(0, settings?.total || questions?.length || 10);
  }, [questions, settings?.total]);

  // Core submit logic dispatching Redux Saga action
  const handleFinalSubmit = useCallback(
    (isAuto = false) => {
      if (!currentCandidate) return;

      const totalSeconds = (settings?.duration || 15) * 60;
      const timeSpent = Math.max(0, totalSeconds - timer.timeLeft);

      dispatch(
        post_assessment_submit_request({
          candidate: currentCandidate,
          answers,
          timeSpent,
          autoSubmitted: isAuto,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCandidate, answers, settings, dispatch]
  );

  // Timer setup declared before effects
  const initialDurationSeconds = (settings?.duration || 15) * 60;
  const timer = useAssessmentTimer({
    initialSeconds: initialDurationSeconds,
    onTick: (timeLeft) => {
      if (currentCandidate) {
        saveTestRecovery({
          answers,
          review: Array.from(reviewSet),
          qIndex,
          timeLeft,
          email: currentCandidate.email,
        });
      }
    },
    onTimeout: () => {
      handleFinalSubmit(true);
    },
  });

  // Handle successful submission navigation from Redux
  useEffect(() => {
    if (post_assessment_submit_data) {
      dispatch(post_assessment_submit_response_clear());
      router.push('/assessment/result');
    }
  }, [post_assessment_submit_data, dispatch, router]);

  // Handle redirect if no candidate registered
  useEffect(() => {
    if (typeof window !== 'undefined' && !currentCandidate) {
      router.replace('/register');
    }
  }, [currentCandidate, router]);

  // Load recovery from localStorage on mount safely
  useEffect(() => {
    if (!currentCandidate || hasLoadedRecovery.current) return;

    const timeoutId = setTimeout(() => {
      const recovery = getTestRecovery();
      if (recovery && recovery.email === currentCandidate.email) {
        if (recovery.answers) setAnswers(recovery.answers);
        if (recovery.review && Array.isArray(recovery.review)) {
          setReviewSet(new Set(recovery.review));
        }
        if (typeof recovery.qIndex === 'number' && recovery.qIndex < activeQuestions.length) {
          setQIndex(recovery.qIndex);
        }
        if (typeof recovery.timeLeft === 'number' && recovery.timeLeft > 0) {
          timer.setTimeLeft(recovery.timeLeft);
        }
      }
      hasLoadedRecovery.current = true;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentCandidate, activeQuestions.length, timer]);

  const saveStateToStorage = (updatedAnswers, updatedReview, updatedIndex) => {
    if (!currentCandidate) return;
    saveTestRecovery({
      answers: updatedAnswers,
      review: Array.from(updatedReview),
      qIndex: updatedIndex,
      timeLeft: timer.timeLeft,
      email: currentCandidate.email,
    });
  };

  const handleSelectAnswer = (optionIndex) => {
    const currentQ = activeQuestions[qIndex];
    if (!currentQ) return;

    const updated = { ...answers, [currentQ.id]: optionIndex };
    setAnswers(updated);
    saveStateToStorage(updated, reviewSet, qIndex);
  };

  const handleClearAnswer = () => {
    const currentQ = activeQuestions[qIndex];
    if (!currentQ) return;

    const updated = { ...answers };
    delete updated[currentQ.id];
    setAnswers(updated);
    saveStateToStorage(updated, reviewSet, qIndex);
  };

  const handleToggleReview = () => {
    const currentQ = activeQuestions[qIndex];
    if (!currentQ) return;

    const updated = new Set(reviewSet);
    if (updated.has(currentQ.id)) {
      updated.delete(currentQ.id);
    } else {
      updated.add(currentQ.id);
    }
    setReviewSet(updated);
    saveStateToStorage(answers, updated, qIndex);
  };

  const handleNavigate = (delta) => {
    const nextIdx = Math.max(0, Math.min(activeQuestions.length - 1, qIndex + delta));
    setQIndex(nextIdx);
    saveStateToStorage(answers, reviewSet, nextIdx);
  };

  const handleNextOrFinish = () => {
    if (qIndex === activeQuestions.length - 1) {
      setShowConfirmModal(true);
    } else {
      handleNavigate(1);
    }
  };

  const currentQ = activeQuestions[qIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = activeQuestions.length - answeredCount;

  const rightContent = (
    <div className="profile-chip">
      <span>{currentCandidate?.name || 'Candidate'}</span>
      <AssessmentTimer formattedTime={timer.formattedTime} />
    </div>
  );

  return (
    <CandidateLayout rightContent={rightContent} maxWidth="1100px">
      <div className="test-layout">
        <QuestionCard
          question={currentQ}
          currentIndex={qIndex}
          totalQuestions={activeQuestions.length}
          selectedAnswer={currentQ ? answers[currentQ.id] : undefined}
          isReview={currentQ ? reviewSet.has(currentQ.id) : false}
          onSelectAnswer={handleSelectAnswer}
          onClearAnswer={handleClearAnswer}
          onToggleReview={handleToggleReview}
          onPrevious={() => handleNavigate(-1)}
          onNext={handleNextOrFinish}
          isLast={qIndex === activeQuestions.length - 1}
        />

        <QuestionPalette
          questions={activeQuestions}
          currentIndex={qIndex}
          answers={answers}
          reviewSet={reviewSet}
          onSelectQuestion={(idx) => {
            setQIndex(idx);
            saveStateToStorage(answers, reviewSet, idx);
          }}
          onSubmitClick={() => setShowConfirmModal(true)}
        />
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Assessment"
        width="460px"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              disabled={post_assessment_submit_loading}
              onClick={() => {
                setShowConfirmModal(false);
                handleFinalSubmit(false);
              }}
            >
              {post_assessment_submit_loading ? 'Submitting...' : 'Confirm Submission'}
            </Button>
          </>
        }
      >
        <div className="center" style={{ margin: '8px 0 16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fff7ed',
              color: '#f97316',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
            }}
          >
            <AlertCircle size={30} strokeWidth={2.2} />
          </div>
        </div>
        <p className="center muted" style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px' }}>
          You have answered <strong>{answeredCount}</strong> out of <strong>{activeQuestions.length}</strong> questions.
          Are you sure you want to finalize and submit?
        </p>

        <div
          className="metric-row"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', margin: '10px 0 0' }}
        >
          <div className="metric">
            <strong>{answeredCount}</strong>
            <span>Answered</span>
          </div>
          <div className="metric">
            <strong>{reviewSet.size}</strong>
            <span>Review</span>
          </div>
          <div className="metric">
            <strong>{unansweredCount}</strong>
            <span>Unanswered</span>
          </div>
        </div>
      </Modal>
    </CandidateLayout>
  );
}
