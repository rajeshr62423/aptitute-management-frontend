'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from '@/components/common/Select';
import Skeleton from '@/components/common/loading/Skeleton';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  page = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems = 0,
  onPageChange = null,
  onPageSizeChange = null,
  keyExtractor = (item, idx) => item.id || item.email || idx,
}) {
  const effectiveTotal = totalItems > 0 ? totalItems : data.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startRecord = effectiveTotal === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, effectiveTotal);

  // Generate pagination buttons with smart ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx} style={col.headerStyle || {}}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize || 5, 8) }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} style={col.cellStyle || {}}>
                      <Skeleton
                        width={colIdx === 0 ? '75%' : colIdx === columns.length - 1 ? '40%' : '60%'}
                        height="16px"
                        borderRadius="4px"
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={keyExtractor(row, rowIdx)}>
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} style={col.cellStyle || {}}>
                      {col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '16px 4px 8px',
          borderTop: '1px solid #f0eeeb',
          marginTop: '12px',
        }}
      >
        {/* Left: Record Range & Total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="small muted">
            {effectiveTotal === 0
              ? 'Showing 0 records'
              : `Showing ${startRecord} to ${endRecord} of ${effectiveTotal} records`}
          </span>

          {/* Page size dropdown */}
          {onPageSizeChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tiny muted">Per page:</span>
              <div style={{ width: '82px' }}>
                <Select
                  size="sm"
                  dropUp
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  options={pageSizeOptions.map((opt) => ({ value: opt, label: String(opt) }))}
                  placeholder=""
                  aria-label="Records per page"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Page Navigation Buttons */}
        {onPageChange && (
          <div
            className="pagination"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: 0,
            }}
          >
            {/* Previous button */}
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                border: '1px solid #e7e5e4',
                backgroundColor: currentPage === 1 ? '#fafaf9' : '#ffffff',
                color: currentPage === 1 ? '#a8a29e' : '#292524',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Numeric page buttons */}
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{
                      padding: '0 6px',
                      color: '#a8a29e',
                      fontSize: '12px',
                    }}
                  >
                    ...
                  </span>
                );
              }

              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  style={{
                    minWidth: '32px',
                    height: '32px',
                    padding: '0 8px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid #f97316' : '1px solid #e7e5e4',
                    backgroundColor: isActive ? '#f97316' : '#ffffff',
                    color: isActive ? '#ffffff' : '#292524',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(249, 115, 22, 0.25)' : 'none',
                  }}
                  aria-label={`Page ${p}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            })}

            {/* Next button */}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || effectiveTotal === 0}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                border: '1px solid #e7e5e4',
                backgroundColor: currentPage === totalPages || effectiveTotal === 0 ? '#fafaf9' : '#ffffff',
                color: currentPage === totalPages || effectiveTotal === 0 ? '#a8a29e' : '#292524',
                cursor: currentPage === totalPages || effectiveTotal === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label="Next page"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
