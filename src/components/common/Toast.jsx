'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToastItem from './ToastItem';

const MAX_VISIBLE_TOASTS = 4;

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((newToast) => {
    setToasts((prev) => {
      // If a toast with identical message and type already exists within the last 1s, prevent duplicate spam
      const isDuplicate = prev.some(
        (t) => t.message === newToast.message && t.type === newToast.type
      );
      if (isDuplicate) return prev;

      // Keep max 4 visible, add new to the end
      const updated = [...prev, newToast];
      if (updated.length > MAX_VISIBLE_TOASTS) {
        return updated.slice(updated.length - MAX_VISIBLE_TOASTS);
      }
      return updated;
    });
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    // Modern action listener
    const handleToastAction = (e) => {
      const { action, payload } = e.detail || {};
      if (action === 'ADD' && payload) {
        addToast(payload);
      } else if (action === 'UPDATE' && payload?.id) {
        updateToast(payload.id, payload);
      } else if (action === 'DISMISS' && payload?.id) {
        dismissToast(payload.id);
      } else if (action === 'CLEAR') {
        clearAllToasts();
      }
    };

    // Legacy fallback listener
    const handleLegacyToast = (e) => {
      const detail = e.detail;
      if (!detail) return;
      const message = typeof detail === 'string' ? detail : detail?.message || '';
      const type = detail?.type || 'info';

      addToast({
        id: `legacy-${Date.now()}-${Math.random()}`,
        message,
        type,
        duration: 4000,
      });
    };

    window.addEventListener('app_toast_action', handleToastAction);
    window.addEventListener('app_toast', handleLegacyToast);

    return () => {
      window.removeEventListener('app_toast_action', handleToastAction);
      window.removeEventListener('app_toast', handleLegacyToast);
    };
  }, [addToast, updateToast, dismissToast, clearAllToasts]);

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-root"
      className="toast-container"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
        />
      ))}

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          pointer-events: none;
          max-width: 400px;
          width: calc(100vw - 32px);
        }

        @media (max-width: 640px) {
          .toast-container {
            top: 16px;
            left: 16px;
            right: 16px;
            width: auto;
            align-items: stretch;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
