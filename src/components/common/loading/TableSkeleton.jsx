'use client';

import React from 'react';
import Skeleton from './Skeleton';

export default function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-skeleton-container" aria-label="Loading table data" role="status">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="table-skeleton-row">
          {Array.from({ length: cols }).map((_, cIdx) => {
            // Give varied natural widths to columns
            const widthPct = cIdx === 0 ? '30%' : cIdx === cols - 1 ? '15%' : '18%';
            return (
              <div key={cIdx} className="table-skeleton-cell" style={{ width: widthPct }}>
                <Skeleton
                  width={cIdx === 0 ? '75%' : '60%'}
                  height="16px"
                  borderRadius="4px"
                />
              </div>
            );
          })}
        </div>
      ))}

      <style jsx>{`
        .table-skeleton-container {
          width: 100%;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-skeleton-row {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-skeleton-row:last-child {
          border-bottom: none;
        }

        .table-skeleton-cell {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
