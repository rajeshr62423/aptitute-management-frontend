'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions = null,
  width = '520px',
  showClose = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
    >
      <div
        ref={modalRef}
        className="modal"
        style={{ width: `min(100%, ${width})` }}
      >
        {/* Header / Title (Static / Fixed) */}
        {(title || showClose) && (
          <div className="modal-header">
            {title ? (
              <h3 id="modal-dialog-title" className="modal-title">
                {title}
              </h3>
            ) : (
              <span />
            )}
            {showClose && (
              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content / Body (Scrollable) */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer (Static / Fixed) */}
        {actions && (
          <div className="modal-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
