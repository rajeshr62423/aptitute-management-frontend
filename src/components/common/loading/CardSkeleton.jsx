'use client';

import React from 'react';
import Skeleton from './Skeleton';

export default function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-skeleton-item">
          <div className="card-skeleton-top">
            <Skeleton width="38px" height="38px" borderRadius="10px" />
            <Skeleton width="48px" height="18px" borderRadius="6px" />
          </div>
          <div style={{ marginTop: '14px' }}>
            <Skeleton width="70px" height="26px" borderRadius="6px" />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="110px" height="14px" borderRadius="4px" />
          </div>
        </div>
      ))}

      <style jsx>{`
        .card-skeleton-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
        }

        .card-skeleton-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
}
