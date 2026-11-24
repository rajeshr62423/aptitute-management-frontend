'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';

export default function ToastItem({ toast, onDismiss }) {
  const { id, type = 'info', title, message, duration = 4000 } = toast;
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef(null);

  // Auto-dismiss countdown timer with pause-on-hover support
  useEffect(() => {
    if (duration <= 0 || type === 'loading') return;

    const startCountdown = (ms) => {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, ms);
    };

    if (!isPaused) {
      startTimeRef.current = Date.now();
      startCountdown(remainingTimeRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, duration, type]);

  const handleMouseEnter = () => {
    if (duration <= 0 || type === 'loading') return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (duration <= 0 || type === 'loading') return;
    setIsPaused(false);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 200);
  };

  // Status-specific themes
  const config = {
    success: {
      icon: CheckCircle2,
      accentClass: 'toast-success',
      defaultTitle: 'Success',
      badgeColor: '#10b981',
    },
    error: {
      icon: AlertCircle,
      accentClass: 'toast-error',
      defaultTitle: 'Error',
      badgeColor: '#ef4444',
    },
    warning: {
      icon: AlertTriangle,
      accentClass: 'toast-warning',
      defaultTitle: 'Warning',
      badgeColor: '#f59e0b',
    },
    loading: {
      icon: Loader2,
      accentClass: 'toast-loading',
      defaultTitle: 'Processing...',
      badgeColor: '#ff6b16',
    },
    info: {
      icon: Info,
      accentClass: 'toast-info',
      defaultTitle: 'Notice',
      badgeColor: '#ff6b16',
    },
  }[type] || {
    icon: Info,
    accentClass: 'toast-info',
    defaultTitle: 'Notice',
    badgeColor: '#ff6b16',
  };

  const IconComponent = config.icon;
  const isError = type === 'error';

  return (
    <div
      className={`toast-card ${config.accentClass} ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <div className="toast-body">
        {/* Status Icon Bubble */}
        <div className="toast-icon-wrap">
          <IconComponent
            size={18}
            className={`status-svg ${type === 'loading' ? 'animate-spin' : ''}`}
          />
        </div>

        {/* Text Content */}
        <div className="toast-text-group">
          {title ? (
            <>
              <h5 className="toast-title">{title}</h5>
              <p className="toast-message">{message}</p>
            </>
          ) : (
            <p className="toast-message single-line">{message}</p>
          )}
        </div>

        {/* Close Button */}
        {type !== 'loading' && (
          <button
            type="button"
            className="toast-close-btn"
            onClick={handleClose}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Progress Bar for timed notifications */}
      {duration > 0 && type !== 'loading' && (
        <div className="toast-progress-track">
          <div
            className="toast-progress-bar"
            style={{
              animationDuration: `${duration}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}

      <style jsx>{`
        .toast-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.12),
                      0 4px 10px -2px rgba(15, 23, 42, 0.05);
          overflow: hidden;
          pointer-events: auto;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid #e2e8f0;
        }

        .toast-card.toast-enter {
          animation: toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .toast-card.toast-exit {
          animation: toastSlideOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(28px) scale(0.95);
          }
        }

        .toast-body {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
        }

        .toast-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Type Theme Accents */
        .toast-success {
          border-left: 3.5px solid #10b981;
        }
        .toast-success .toast-icon-wrap {
          background: #ecfdf5;
          color: #059669;
        }
        .toast-success .toast-progress-bar {
          background: #10b981;
        }

        .toast-error {
          border-left: 3.5px solid #ef4444;
        }
        .toast-error .toast-icon-wrap {
          background: #fef2f2;
          color: #dc2626;
        }
        .toast-error .toast-progress-bar {
          background: #ef4444;
        }

        .toast-warning {
          border-left: 3.5px solid #f59e0b;
        }
        .toast-warning .toast-icon-wrap {
          background: #fffbeb;
          color: #d97706;
        }
        .toast-warning .toast-progress-bar {
          background: #f59e0b;
        }

        .toast-info {
          border-left: 3.5px solid #ff6b16;
        }
        .toast-info .toast-icon-wrap {
          background: #fff7ed;
          color: #ea580c;
        }
        .toast-info .toast-progress-bar {
          background: #ff6b16;
        }

        .toast-loading {
          border-left: 3.5px solid #ff6b16;
        }
        .toast-loading .toast-icon-wrap {
          background: #fff7ed;
          color: #ea580c;
        }

        .toast-text-group {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toast-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.35;
        }

        .toast-message {
          font-size: 12.5px;
          font-weight: 500;
          color: #475569;
          margin: 0;
          line-height: 1.45;
          word-break: break-word;
        }

        .toast-message.single-line {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-top: 4px;
        }

        .toast-close-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #94a3b8;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
          padding: 0;
          margin-top: 1px;
        }

        .toast-close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        /* Progress Bar */
        .toast-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .toast-progress-bar {
          height: 100%;
          width: 100%;
          animation: progressDrain linear forwards;
          transform-origin: left;
        }

        @keyframes progressDrain {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        @media (max-width: 480px) {
          .toast-card {
            max-width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .toast-card.toast-enter,
          .toast-card.toast-exit,
          .toast-progress-bar {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
