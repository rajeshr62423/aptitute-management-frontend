'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isReview,
  onSelectAnswer,
  onClearAnswer,
  onToggleReview,
  onPrevious,
  onNext,
  isLast,
}) {
  if (!question) return null;

  const optionLetters = ['A', 'B', 'C', 'D'];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <section className="panel">
      <div className="question-top">
        <b>
          Question {currentIndex + 1} / {totalQuestions}
        </b>
        <Badge variant="pending">{question.category}</Badge>
      </div>

      <div className="progress">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <h3 style={{ fontSize: '17px', lineHeight: 1.6, margin: '20px 0', fontWeight: 700 }}>
        {question.text}
      </h3>

      <div style={{ marginTop: '14px' }}>
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          return (
            <label
              key={i}
              className={`option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectAnswer(i)}
            >
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={isSelected}
                onChange={() => onSelectAnswer(i)}
              />
              <b>{optionLetters[i]}.</b> {opt}
            </label>
          );
        })}
      </div>

      <div className="test-actions">
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Button>
        <Button
          variant="secondary"
          onClick={onToggleReview}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Flag size={15} />
          <span>{isReview ? 'Remove Review' : 'Mark for Review'}</span>
        </Button>
        <Button
          variant="secondary"
          onClick={onClearAnswer}
        >
          Clear Response
        </Button>
        <span style={{ flex: 1 }} />
        <Button
          variant="primary"
          onClick={onNext}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{isLast ? 'Finish' : 'Next'}</span>
          {!isLast && <ChevronRight size={16} />}
        </Button>
      </div>
    </section>
  );
}
