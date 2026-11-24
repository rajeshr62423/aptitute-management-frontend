'use client';

import React, { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, AlertTriangle, Loader2, X } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isAssessmentActive = false,
  role = 'admin',
}) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const cancelButtonRef = useRef(null);
  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsLoading(false);
    setErrorMessage(null);
    onClose();
  }, [isLoading, onClose]);

  // Focus management and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus cancel button for safe keyboard accessibility
    const timer = setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen || !isClient) return null;

  const handleConfirmClick = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await onConfirm();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err?.message || 'Failed to complete logout. Please try again.'
      );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const modalRoot =
    (typeof document !== 'undefined' &&
      (document.getElementById('modal-root') || document.body)) ||
    null;

  if (!modalRoot) return null;

  const modalContent = (
    <div
      className="logout-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-desc"
    >
      <div className="logout-modal-card" ref={modalRef}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-icon"
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className={`logout-icon-bubble ${isAssessmentActive ? 'warning' : 'default'}`}>
          {isAssessmentActive ? (
            <AlertTriangle size={24} className="icon-svg" />
          ) : (
            <LogOut size={24} className="icon-svg" />
          )}
        </div>

        {/* Title */}
        <h3 id="logout-dialog-title" className="logout-title">
          Are you sure you want to log out?
        </h3>

        {/* Description */}
        <p id="logout-dialog-desc" className="logout-description">
          {isAssessmentActive
            ? 'You are about to log out of your AptitudePro account while an examination is currently active.'
            : 'You are about to log out of your AptitudePro account. Any unsaved progress may be lost. Do you want to continue?'}
        </p>

        {/* Assessment In Progress Warning Banner */}
        {isAssessmentActive && (
          <div className="assessment-warning-box">
            <div className="warning-head">
              <AlertTriangle size={15} className="warning-icon" />
              <span>Assessment In Progress</span>
            </div>
            <p className="warning-text">
              Exiting or logging out now will terminate your live test session. Any unsubmitted answers will be lost or finalized as-is.
            </p>
          </div>
        )}

        {/* Error Alert if logout fails */}
        {errorMessage && (
          <div className="logout-error-banner" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="logout-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
            ref={cancelButtonRef}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`btn-logout ${isAssessmentActive ? 'danger' : 'primary'}`}
            onClick={handleConfirmClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .logout-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          z-index: 99999;
          overflow-y: auto;
          box-sizing: border-box;
          animation: backdropFade 0.2s ease forwards;
        }

        @keyframes backdropFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .logout-modal-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.28),
                      0 8px 18px -4px rgba(15, 23, 42, 0.12);
          padding: 32px 28px 28px 28px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-height: calc(100dvh - 40px);
          overflow-y: auto;
          box-sizing: border-box;
          animation: cardScale 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardScale {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-close-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #94a3b8;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-close-icon:hover:not(:disabled) {
          background: #f1f5f9;
          color: #475569;
        }

        .modal-close-icon:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Icon Bubble */
        .logout-icon-bubble {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin-bottom: 18px;
          transition: transform 0.2s ease;
        }

        .logout-icon-bubble.default {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #ea580c;
        }

        .logout-icon-bubble.warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .logout-title {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.4px;
          color: #0f172a;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .logout-description {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.55;
          margin: 0 0 16px 0;
          max-width: 380px;
        }

        /* Assessment Warning Box */
        .assessment-warning-box {
          width: 100%;
          background: #fff1f2;
          border: 1.5px solid #fecdd3;
          border-radius: 12px;
          padding: 12px 14px;
          text-align: left;
          margin-bottom: 20px;
        }

        .warning-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #be123c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        :global(.warning-icon) {
          color: #e11d48;
          flex-shrink: 0;
        }

        .warning-text {
          font-size: 12px;
          color: #9f1239;
          line-height: 1.45;
          margin: 0;
        }

        /* Error Banner */
        .logout-error-banner {
          width: 100%;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 8px 12px;
          color: #b91c1c;
          font-size: 12px;
          margin-bottom: 16px;
          text-align: left;
        }

        /* Action Buttons */
        .logout-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          margin-top: 6px;
        }

        .btn-cancel {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-logout {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          border: none;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-logout.primary {
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.28);
        }

        .btn-logout.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.38);
          transform: translateY(-1px);
        }

        .btn-logout.danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.28);
        }

        .btn-logout.danger:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.38);
          transform: translateY(-1px);
        }

        .btn-logout:disabled {
          opacity: 0.65;
          cursor: wait;
          transform: none !important;
        }

        @media (max-width: 480px) {
          .logout-modal-card {
            padding: 24px 20px;
          }

          .logout-actions {
            flex-direction: column-reverse;
            gap: 10px;
          }

          .btn-cancel,
          .btn-logout {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}
