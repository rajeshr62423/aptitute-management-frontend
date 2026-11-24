'use client';

import React from 'react';
import Button from '@/components/common/Button';

export default function ResultSummary({
  candidate,
  maxScore = 20,
  onDone,
}) {
  if (!candidate) return null;

  const isPass = candidate.status === 'Pass';
  const marksDeducted = Math.max(0, (candidate.incorrect || 0) * 1); // default deduction calculation

  const breakdown = [
    { label: 'Correct answers', value: candidate.correct ?? 0, color: 'var(--green)' },
    { label: 'Incorrect answers', value: candidate.incorrect ?? 0, color: 'var(--red)' },
    { label: 'Unattempted', value: candidate.unattempted ?? 0, color: 'var(--muted)' },
    { label: 'Marks deducted', value: candidate.marksDeducted ?? marksDeducted, color: 'var(--orange)' },
  ];

  return (
    <section className="panel">
      <div className="center">
        <div style={{ fontSize: '34px', color: 'var(--green)', lineHeight: 1.2 }}>
          ● ✓
        </div>
        <h1 className="page-title" style={{ marginTop: '10px' }}>
          Assessment Completed!
        </h1>
        <p className="page-subtitle">Here are your results.</p>
      </div>

      <div className="result-grid" style={{ margin: '30px 0' }}>
        <div className="center">
          <div className="result-circle">{candidate.percent}%</div>
          <p className="result-score">
            {candidate.score} / {maxScore}
          </p>
          <p className="muted">Total score · {candidate.percent}%</p>
        </div>

        <div>
          {breakdown.map((item) => (
            <p
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--line)',
                padding: '9px 0',
                margin: 0,
              }}
            >
              <span>{item.label}</span>
              <b style={{ color: item.color }}>{item.value}</b>
            </p>
          ))}
        </div>
      </div>

      <div
        className="center"
        style={{
          padding: '13px',
          background: isPass ? '#f0fdf4' : '#fef2f2',
          borderRadius: '8px',
        }}
      >
        <b style={{ color: isPass ? '#166534' : '#991b1b', fontSize: '15px' }}>
          Status: {candidate.status}
        </b>
      </div>

      <div className="center" style={{ marginTop: '22px' }}>
        {candidate.time && (
          <div className="small muted" style={{ marginBottom: '14px' }}>
            ◷ Time taken: {candidate.time}
          </div>
        )}
        <Button variant="primary" onClick={onDone} style={{ minWidth: '130px' }}>
          Done
        </Button>
      </div>
    </section>
  );
}
