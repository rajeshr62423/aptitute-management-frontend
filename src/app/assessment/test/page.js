'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import CandidateLayout from '@/components/layout/CandidateLayout';
import CandidateProfileDropdown from '@/components/candidate/CandidateProfileDropdown';
import QuestionCard from '@/components/assessment/QuestionCard';
import QuestionPalette from '@/components/assessment/QuestionPalette';
import QuestionSkeleton from '@/components/common/loading/QuestionSkeleton';
import { FullScreenLoader } from '@/components/common/loading/GlobalLoader';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { toast } from '@/utils/toast';
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
  const {
    get_settings_data: settings,
    post_assessment_submit_data,
    post_assessment_submit_loading,
    post_assessment_submit_error,
  } = useSelector((state) => state.assessment);
  const { get_questions_data: questions } = useSelector((state) => state.questions);

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewSet, setReviewSet] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasLoadedRecovery = useRef(false);
  const hasWarnedTimeRef = useRef(false);

  // Monitor network connection status during active assessment
  useEffect(() => {
    const handleOffline = () => {
      toast.error('Network connection interrupted. Answers are preserved locally.', {
        title: 'Connection Lost',
        duration: 8000,
      });
    };
    const handleOnline = () => {
      toast.success('Internet connection restored.', {
        title: 'Online',
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

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
      // Gentle warning when 60 seconds remain
      if (timeLeft === 60 && !hasWarnedTimeRef.current) {
        hasWarnedTimeRef.current = true;
        toast.warning('1 minute remaining! Please finalize your answers.', {
          title: 'Time Running Out',
        });
      }

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
      toast.warning('Time is up! Submitting your assessment automatically...', {
        title: 'Time Expired',
      });
      handleFinalSubmit(true);
    },
  });

  // Handle successful submission navigation from Redux
  useEffect(() => {
    if (post_assessment_submit_data) {
      toast.success('Assessment submitted successfully! Generating evaluation...', {
        title: 'Exam Completed',
      });
      dispatch(post_assessment_submit_response_clear());
      router.push('/assessment/result');
    }
  }, [post_assessment_submit_data, dispatch, router]);

  // Handle assessment submission error
  useEffect(() => {
    if (post_assessment_submit_error) {
      toast.error(post_assessment_submit_error, {
        title: 'Submission Failed',
      });
      dispatch(post_assessment_submit_response_clear());
    }
  }, [post_assessment_submit_error, dispatch]);

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
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <AssessmentTimer formattedTime={timer.formattedTime} />
      <CandidateProfileDropdown
        candidate={currentCandidate}
        isAssessmentActive={true}
      />
    </div>
  );

  return (
    <CandidateLayout rightContent={rightContent} maxWidth="1100px">
      <div className="test-layout">
        {!currentQ ? (
          <QuestionSkeleton />
        ) : (
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
        )}

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

      {/* Submitting Assessment Overlay */}
      <FullScreenLoader
        isOpen={post_assessment_submit_loading}
        title="Submitting Your Assessment..."
        message="Please wait while your answers are being finalized and scored."
      />
    </CandidateLayout>
  );
}
