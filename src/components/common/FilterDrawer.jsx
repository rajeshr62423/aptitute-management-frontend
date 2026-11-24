'use client';

import React, { useEffect, useId } from 'react';
import { Filter, X } from 'lucide-react';
import Button from '@/components/common/Button';

/**
 * Reusable Right-side Filter Drawer for Listing Pages
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {() => void} onApply
 * @param {() => void} onReset
 * @param {number} activeCount
 */
export default function FilterDrawer({
  isOpen = false,
  onClose,
  title = 'Filters',
  children,
  onApply,
  onReset,
  activeCount = 0,
}) {
  const headingId = useId();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(41, 37, 36, 0.45)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Slide-over Right Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e7e5e4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Filter icon */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter size={18} />
            </div>
            <div>
              <h2
                id={headingId}
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#292524',
                }}
              >
                {title}
              </h2>
              {activeCount > 0 && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#ea580c',
                    fontWeight: 600,
                  }}
                >
                  {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
                </span>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e7e5e4',
              backgroundColor: '#fafaf9',
              color: '#78716c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-stone-200 hover:text-stone-900"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Controls */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {children}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e7e5e4',
            backgroundColor: '#fafaf9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            style={{ flex: 1 }}
          >
            Reset Filters
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onApply}
            style={{ flex: 1 }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
