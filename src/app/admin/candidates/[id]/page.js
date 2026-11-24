'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import StatCard from '@/components/common/StatCard';
import { get_candidate_detail_request } from '@/redux/candidates/action';
import { get_questions_request } from '@/redux/questions/action';
import { exportSingleCandidateResult } from '@/utils/csvExport';
import { showToast } from '@/utils/toast';
import { ArrowLeft, Download } from 'lucide-react';

function CandidateDetailContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const rawId = params?.id ? decodeURIComponent(params.id) : '';

  const { get_candidate_detail_data, selected_candidate, get_candidates_data } = useSelector(
    (state) => state.candidates
  );
  const { get_questions_data: questions } = useSelector((state) => state.questions);

  useEffect(() => {
    if (rawId) {
      dispatch(get_candidate_detail_request(rawId));
    }
    dispatch(get_questions_request());
  }, [dispatch, rawId]);

  // Find candidate by loaded detail, or fallback to selected_candidate, or list matching
  const candidate =
    get_candidate_detail_data ||
    (get_candidates_data || []).find(
      (c) =>
        (c.email && c.email.toLowerCase() === rawId.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === rawId.toLowerCase())
    ) ||
    selected_candidate ||
    (get_candidates_data && get_candidates_data[0]) ||
    null;

  const handleExport = () => {
    if (candidate) {
      exportSingleCandidateResult(candidate);
      showToast('Candidate result downloaded');
    }
  };

  if (!candidate) {
    return (
      <AdminLayout>
        <div className="page-head">
          <div>
            <h1 className="page-title">Candidate Details</h1>
            <p className="page-subtitle">No candidate selected.</p>
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/admin/candidates')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Back to candidates</span>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const reviewQuestions = (questions || []).slice(0, 5);

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">Candidate Details</h1>
          <p className="page-subtitle">
            Review candidate profile and assessment performance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/admin/candidates')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            <span>Back to candidates</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export result</span>
          </Button>
        </div>
      </div>

      <section className="panel">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              className="avatar"
              style={{ width: '52px', height: '52px', fontSize: '20px' }}
            >
              {candidate.name ? candidate.name[0] : 'C'}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>
                {candidate.name}
              </h2>
              <span className="muted small">
                {candidate.email} · {candidate.phone || 'N/A'} ·{' '}
                {candidate.qualification || 'N/A'} · {candidate.city || 'N/A'}
              </span>
            </div>
          </div>
          <Badge variant={candidate.status === 'Pass' ? 'pass' : 'fail'}>
            {candidate.status}
          </Badge>
        </div>

        <div className="divider" />

        <div className="stat-grid">
          <StatCard label="Score" value={`${candidate.score}/20`} />
          <StatCard label="Percentage" value={`${candidate.percent}%`} />
          <StatCard label="Correct" value={candidate.correct ?? 0} />
          <StatCard label="Incorrect" value={candidate.incorrect ?? 0} />
        </div>

        <h3 className="panel-title" style={{ marginTop: '20px' }}>
          Question review
        </h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Candidate answer</th>
                <th>Correct answer</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {reviewQuestions.map((q, i) => {
                const isCorrect = i % 3 !== 0; // matching HTML demo behavior
                const candidateAns = q.options[i % 4];
                const correctAns = q.options[q.correct];

                return (
                  <tr key={q.id || i}>
                    <td>{i + 1}</td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'normal' }}>
                      {q.text}
                    </td>
                    <td>{candidateAns}</td>
                    <td>{correctAns}</td>
                    <td>
                      <Badge variant={isCorrect ? 'pass' : 'fail'}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export default function CandidateDetailPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="empty">Loading candidate details...</div>
        </AdminLayout>
      }
    >
      <CandidateDetailContent />
    </Suspense>
  );
}
