'use client';

import React from 'react';
import Button from '@/components/common/Button';

export default function QuestionPalette({
  questions = [],
  currentIndex = 0,
  answers = {},
  reviewSet = new Set(),
  onSelectQuestion,
  onSubmitClick,
}) {
  const answeredCount = Object.keys(answers).length;
  const reviewCount = reviewSet.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <aside className="panel">
      <h3 className="panel-title">Question palette</h3>
      
      <div className="palette">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
          const isReview = reviewSet.has(q.id);

          let className = '';
          if (isCurrent) className += ' current';
          if (isAnswered) className += ' answered';
          if (isReview) className += ' review';

          return (
            <button
              key={q.id}
              type="button"
              className={className.trim()}
              onClick={() => onSelectQuestion(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <p className="tiny muted">
        🟢 Answered &nbsp; 🟠 Review &nbsp; ⚪ Unanswered
      </p>

      <div className="divider" />

      <p className="small" style={{ margin: '6px 0' }}>
        Answered: <b>{answeredCount}</b>
      </p>
      <p className="small" style={{ margin: '6px 0' }}>
        For review: <b>{reviewCount}</b>
      </p>
      <p className="small" style={{ margin: '6px 0' }}>
        Unanswered: <b>{unansweredCount}</b>
      </p>

      <Button
        variant="primary"
        style={{ width: '100%', marginTop: '15px' }}
        onClick={onSubmitClick}
      >
        Submit Test
      </Button>
    </aside>
  );
}
