'use client';

import React from 'react';
import Skeleton from './Skeleton';

export default function QuestionSkeleton() {
  return (
    <div className="question-skeleton-card" aria-label="Loading question" role="status">
      {/* Top Header */}
      <div className="question-skeleton-header">
        <Skeleton width="110px" height="26px" borderRadius="6px" />
        <Skeleton width="130px" height="32px" borderRadius="8px" />
      </div>

      {/* Question Text */}
      <div className="question-skeleton-text">
        <Skeleton width="90%" height="20px" borderRadius="4px" />
        <Skeleton width="65%" height="20px" borderRadius="4px" style={{ marginTop: '8px' }} />
      </div>

      {/* 4 Option Items */}
      <div className="question-skeleton-options">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="option-skeleton-item">
            <Skeleton width="20px" height="20px" borderRadius="50%" />
            <Skeleton width={`${55 + (idx % 3) * 15}%`} height="16px" borderRadius="4px" />
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="question-skeleton-footer">
        <Skeleton width="100px" height="38px" borderRadius="8px" />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Skeleton width="90px" height="38px" borderRadius="8px" />
          <Skeleton width="90px" height="38px" borderRadius="8px" />
        </div>
      </div>

      <style jsx>{`
        .question-skeleton-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
        }

        .question-skeleton-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .question-skeleton-text {
          margin: 20px 0 24px 0;
        }

        .question-skeleton-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .option-skeleton-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
        }

        .question-skeleton-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
