'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import CandidateLayout from '@/components/layout/CandidateLayout';
import CandidateProfileDropdown from '@/components/candidate/CandidateProfileDropdown';
import { FullScreenLoader } from '@/components/common/loading/GlobalLoader';
import CardSkeleton from '@/components/common/loading/CardSkeleton';
import { clearTestRecovery, saveTestRecovery, getCurrentCandidate } from '@/services/assessmentService';
import { set_current_candidate } from '@/redux/candidates/action';
import { get_settings_request } from '@/redux/assessment/action';
import { get_questions_request } from '@/redux/questions/action';
import { toast, showToast } from '@/utils/toast';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Target,
  ArrowRight,
  Check,
  Sparkles,
  BookOpen,
  ShieldAlert,
  AlertTriangle,
  Bookmark,
  ListOrdered,
  EyeOff,
  Loader2,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function AssessmentInstructionsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { current_candidate } = useSelector((state) => state.candidates);
  const { get_settings_data: settings, get_settings_loading: settingsLoading } = useSelector((state) => state.assessment);
  const { get_questions_data: questions, get_questions_loading: questionsLoading } = useSelector((state) => state.questions);

  const [agreed, setAgreed] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [highlightShake, setHighlightShake] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    dispatch(get_settings_request());
    dispatch(get_questions_request());
  }, [dispatch]);

  useEffect(() => {
    if (isClient && !current_candidate) {
      const stored = getCurrentCandidate();
      if (stored) {
        dispatch(set_current_candidate(stored));
      } else {
        router.replace('/register');
      }
    }
  }, [isClient, current_candidate, dispatch, router]);

  const activeQuestions = (questions || [])
    .filter((q) => q.active)
    .slice(0, settings?.total || questions?.length || 10);

  const totalQuestions = activeQuestions.length || settings?.total || 10;
  const durationMinutes = settings?.duration || 15;
  const marksPerCorrect = settings?.correct ?? 2;
  const marksPerWrong = settings?.wrong ?? -1;
  const marksUnattempted = settings?.unattempted ?? 0;
  const passingPercent = settings?.pass || 60;

  const handleStartTest = () => {
    if (isStarting) return;

    if (!agreed) {
      toast.warning('Please acknowledge the assessment guidelines before starting.', {
        title: 'Agreement Required',
      });
      setHighlightShake(true);
      setTimeout(() => setHighlightShake(false), 900);
      return;
    }

    setIsStarting(true);

    // Reset/initialize test recovery
    clearTestRecovery();
    const candidateObj = current_candidate || getCurrentCandidate();
    const initialRecovery = {
      answers: {},
      review: [],
      qIndex: 0,
      timeLeft: durationMinutes * 60,
      email: candidateObj?.email || '',
      candidate: candidateObj,
      savedAt: Date.now(),
    };
    saveTestRecovery(initialRecovery);

    router.push('/assessment/test');
  };

  const rightContent = <CandidateProfileDropdown candidate={current_candidate} />;

  return (
    <CandidateLayout rightContent={rightContent} maxWidth="1040px">
      <div className="instructions-container">
        {/* Main Examination Card */}
        <div className="instructions-card">
          {/* Header & Hero */}
          <header className="instructions-header">
            <div className="badge-pill">
              <Sparkles size={13} className="text-orange-500" />
              <span>APTITUDEPRO ONLINE EXAMINATION</span>
            </div>

            <h1 className="instructions-title">Aptitude Assessment</h1>
            <p className="instructions-subtitle">
              Please review the examination format, scoring rules, and guidelines carefully before launching your test session.
            </p>
          </header>

          {/* Assessment Overview - 6 Modern Stat Cards */}
          <section className="stats-section" aria-label="Assessment Statistics">
            <div className="stats-grid">
              {settingsLoading && !settings ? (
                <CardSkeleton count={6} />
              ) : (
                <>
                  {/* Card 1: Total Questions */}
                  <div className="stat-card orange-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap orange">
                        <HelpCircle size={20} />
                      </div>
                      <span className="stat-chip">Format</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-orange">{totalQuestions}</span>
                      <span className="stat-unit">Questions</span>
                    </div>
                    <div className="stat-label">Total Questions</div>
                    <div className="stat-subtext">Single choice MCQs</div>
                  </div>

                  {/* Card 2: Duration */}
                  <div className="stat-card blue-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap blue">
                        <Clock size={20} />
                      </div>
                      <span className="stat-chip">Time</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-blue">{durationMinutes}</span>
                      <span className="stat-unit">Minutes</span>
                    </div>
                    <div className="stat-label">Total Duration</div>
                    <div className="stat-subtext">Timed countdown</div>
                  </div>

                  {/* Card 3: Correct Answer */}
                  <div className="stat-card green-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap green">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="stat-chip green">Positive</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-green">+{marksPerCorrect}</span>
                      <span className="stat-unit">Marks</span>
                    </div>
                    <div className="stat-label">Correct Answer</div>
                    <div className="stat-subtext">Per right response</div>
                  </div>

                  {/* Card 4: Wrong Answer */}
                  <div className="stat-card red-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap red">
                        <AlertCircle size={20} />
                      </div>
                      <span className="stat-chip red">Negative</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-red">{marksPerWrong}</span>
                      <span className="stat-unit">Mark</span>
                    </div>
                    <div className="stat-label">Wrong Answer</div>
                    <div className="stat-subtext">Penalty per error</div>
                  </div>

                  {/* Card 5: Unattempted */}
                  <div className="stat-card neutral-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap neutral">
                        <MinusCircle size={20} />
                      </div>
                      <span className="stat-chip neutral">Neutral</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-neutral">{marksUnattempted}</span>
                      <span className="stat-unit">Marks</span>
                    </div>
                    <div className="stat-label">Unattempted</div>
                    <div className="stat-subtext">No penalty applied</div>
                  </div>

                  {/* Card 6: Passing Criteria */}
                  <div className="stat-card purple-theme">
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap purple">
                        <Target size={20} />
                      </div>
                      <span className="stat-chip purple">Benchmark</span>
                    </div>
                    <div className="stat-value-group">
                      <span className="stat-value text-purple">{passingPercent}%</span>
                      <span className="stat-unit">Score</span>
                    </div>
                    <div className="stat-label">Passing Criteria</div>
                    <div className="stat-subtext">Minimum threshold</div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Assessment Guidelines & Important Instructions */}
          <section className="guidelines-section">
            <div className="guidelines-grid">
              {/* Left Column: Assessment Guidelines */}
              <div className="guideline-card blue-card">
                <div className="guideline-card-header">
                  <div className="header-icon blue">
                    <BookOpen size={19} />
                  </div>
                  <div>
                    <h2 className="guideline-heading">Assessment Guidelines</h2>
                    <p className="guideline-subheading">General format and navigation rules</p>
                  </div>
                </div>

                <div className="guideline-list">
                  <div className="guideline-item">
                    <div className="item-icon-wrap check">
                      <Check size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">Answer all questions to the best of your ability.</strong>
                      <p className="item-desc">
                        You can navigate freely between questions using the question palette on the right.
                      </p>
                    </div>
                  </div>

                  <div className="guideline-item">
                    <div className="item-icon-wrap bookmark">
                      <Bookmark size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">You can mark questions for review.</strong>
                      <p className="item-desc">
                        Flag any questions you want to reconsider and re-evaluate before final submission.
                      </p>
                    </div>
                  </div>

                  <div className="guideline-item">
                    <div className="item-icon-wrap list">
                      <ListOrdered size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">Each question has four options.</strong>
                      <p className="item-desc">
                        There is only one correct answer for each question. You can modify your choice at any point.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Important Instructions */}
              <div className="guideline-card warning-card">
                <div className="guideline-card-header">
                  <div className="header-icon amber">
                    <ShieldAlert size={19} />
                  </div>
                  <div>
                    <h2 className="guideline-heading">Important Instructions</h2>
                    <p className="guideline-subheading">Test security and submission policies</p>
                  </div>
                </div>

                <div className="guideline-list">
                  <div className="guideline-item">
                    <div className="item-icon-wrap danger">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">Do not refresh or close the page.</strong>
                      <p className="item-desc">
                        Reloading, closing, or navigating away from the test tab may invalidate your session.
                      </p>
                    </div>
                  </div>

                  <div className="guideline-item">
                    <div className="item-icon-wrap timer">
                      <Clock size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">The test submits automatically when time ends.</strong>
                      <p className="item-desc">
                        Keep track of the countdown timer. All answered questions are saved immediately.
                      </p>
                    </div>
                  </div>

                  <div className="guideline-item">
                    <div className="item-icon-wrap eye">
                      <EyeOff size={14} />
                    </div>
                    <div className="item-content">
                      <strong className="item-title">Correct answers are not shown during the test.</strong>
                      <p className="item-desc">
                        Your complete evaluation and score breakdown will be presented on the result screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="section-divider" />

          {/* Confirmation & Acknowledgment Section */}
          <section className="confirmation-section">
            <div
              className={`acknowledgment-card ${agreed ? 'is-agreed' : ''} ${
                highlightShake ? 'shake-pulse' : ''
              }`}
              onClick={() => setAgreed((prev) => !prev)}
              role="checkbox"
              aria-checked={agreed}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setAgreed((prev) => !prev);
                }
              }}
            >
              <div className={`custom-checkbox ${agreed ? 'checked' : ''}`}>
                {agreed && <Check size={14} strokeWidth={3} className="check-svg" />}
              </div>

              <div className="acknowledgment-text">
                <span className="acknowledgment-label">
                  I have read, understood, and agreed to follow all the assessment guidelines.
                </span>
                <span className="acknowledgment-subtext">
                  You must confirm the instructions above before you can start the test.
                </span>
              </div>
            </div>

            {/* Start Test Action Button */}
            <div className="action-row">
              <button
                type="button"
                className={`start-test-btn ${agreed ? 'enabled' : 'disabled'} ${
                  isStarting ? 'loading' : ''
                }`}
                disabled={isStarting || !agreed}
                onClick={handleStartTest}
              >
                {isStarting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Preparing Your Assessment...</span>
                  </>
                ) : (
                  <>
                    <span>Start Test</span>
                    <ArrowRight size={18} className="arrow-icon" />
                  </>
                )}
              </button>
            </div>

            <p className="action-hint">
              Once started, the countdown timer will run continuously until completed.
            </p>
          </section>
        </div>

        {/* Preparing Assessment Loading Overlay */}
        <FullScreenLoader
          isOpen={isStarting}
          title="Preparing Your Assessment..."
          message="Configuring your examination session and question palette."
        />
      </div>

      <style jsx>{`
        .instructions-container {
          padding: 8px 0 32px 0;
        }

        .instructions-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 16px 36px -12px rgba(15, 23, 42, 0.06),
                      0 1px 3px rgba(15, 23, 42, 0.02);
          padding: 44px 44px 48px 44px;
        }

        /* Header */
        .instructions-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #ea580c;
          margin-bottom: 14px;
        }

        .instructions-title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #0f172a;
          margin: 0 0 10px 0;
        }

        .instructions-subtitle {
          font-size: 14px;
          color: #64748b;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          margin-bottom: 32px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -6px rgba(15, 23, 42, 0.07),
                      0 2px 6px -1px rgba(15, 23, 42, 0.04);
          border-color: #cbd5e1;
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stat-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover .stat-icon-wrap {
          transform: scale(1.05);
        }

        .stat-icon-wrap.orange {
          background: #fff7ed;
          color: #ea580c;
        }
        .stat-icon-wrap.blue {
          background: #eff6ff;
          color: #2563eb;
        }
        .stat-icon-wrap.green {
          background: #ecfdf5;
          color: #059669;
        }
        .stat-icon-wrap.red {
          background: #fef2f2;
          color: #dc2626;
        }
        .stat-icon-wrap.neutral {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
        .stat-icon-wrap.purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-chip {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 3px 8px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #475569;
        }

        .stat-chip.green {
          background: #ecfdf5;
          color: #059669;
        }
        .stat-chip.red {
          background: #fef2f2;
          color: #dc2626;
        }
        .stat-chip.neutral {
          background: #f1f5f9;
          color: #64748b;
        }
        .stat-chip.purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.6px;
          line-height: 1.15;
        }

        .text-orange {
          color: #ff6b16;
        }
        .text-blue {
          color: #2563eb;
        }
        .text-green {
          color: #059669;
        }
        .text-red {
          color: #dc2626;
        }
        .text-neutral {
          color: #334155;
        }
        .text-purple {
          color: #7c3aed;
        }

        .stat-unit {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-subtext {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* Guidelines Section */
        .guidelines-section {
          margin-bottom: 28px;
        }

        .guidelines-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .guideline-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
          transition: border-color 0.2s ease;
        }

        .guideline-card:hover {
          border-color: #cbd5e1;
        }

        .guideline-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .header-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .header-icon.amber {
          background: #fff7ed;
          color: #ea580c;
        }

        .guideline-heading {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .guideline-subheading {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .guideline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .guideline-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .item-icon-wrap {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .item-icon-wrap.check {
          background: #ecfdf5;
          color: #059669;
        }

        .item-icon-wrap.bookmark {
          background: #fef3c7;
          color: #d97706;
        }

        .item-icon-wrap.list {
          background: #eff6ff;
          color: #2563eb;
        }

        .item-icon-wrap.danger {
          background: #fef2f2;
          color: #dc2626;
        }

        .item-icon-wrap.timer {
          background: #fff7ed;
          color: #ea580c;
        }

        .item-icon-wrap.eye {
          background: #f1f5f9;
          color: #475569;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.4;
        }

        .item-desc {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Divider */
        .section-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 30px 0;
        }

        /* Confirmation Section */
        .confirmation-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .acknowledgment-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }

        .acknowledgment-card:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .acknowledgment-card.is-agreed {
          background: #fff7ed;
          border-color: #ff6b16;
          box-shadow: 0 4px 12px rgba(255, 107, 22, 0.1);
        }

        .acknowledgment-card.shake-pulse {
          border-color: #ff6b16;
          box-shadow: 0 0 0 3px rgba(255, 107, 22, 0.3);
          animation: subtleShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes subtleShake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }

        .custom-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid #cbd5e1;
          background: #ffffff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .acknowledgment-card:hover .custom-checkbox {
          border-color: #ff6b16;
        }

        .custom-checkbox.checked {
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          border-color: #ea580c;
          box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);
        }

        :global(.check-svg) {
          color: #ffffff;
          animation: checkPop 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes checkPop {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .acknowledgment-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .acknowledgment-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
        }

        .acknowledgment-subtext {
          font-size: 12px;
          color: #64748b;
        }

        /* Action Row */
        .action-row {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .start-test-btn {
          min-width: 240px;
          height: 50px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.2px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .start-test-btn.enabled {
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(234, 88, 12, 0.32);
        }

        .start-test-btn.enabled:hover {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          box-shadow: 0 8px 24px rgba(234, 88, 12, 0.42);
          transform: translateY(-1.5px);
        }

        .start-test-btn.enabled:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.28);
        }

        .start-test-btn.disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .start-test-btn.loading {
          opacity: 0.85;
          cursor: wait;
        }

        :global(.arrow-icon) {
          transition: transform 0.2s ease;
        }

        .start-test-btn.enabled:hover :global(.arrow-icon) {
          transform: translateX(4px);
        }

        .action-hint {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 12px;
          text-align: center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .instructions-card {
            padding: 36px 30px;
          }

          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .instructions-card {
            padding: 26px 20px;
            border-radius: 16px;
          }

          .instructions-title {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .guidelines-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .start-test-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .instructions-card {
            padding: 22px 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-value {
            font-size: 22px;
          }

          .stat-chip {
            display: none;
          }

          .acknowledgment-card {
            padding: 14px;
          }

          .acknowledgment-label {
            font-size: 12.5px;
          }
        }
      `}</style>
    </CandidateLayout>
  );
}
