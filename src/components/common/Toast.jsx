'use client';

import React, { useState, useEffect } from 'react';

export default function Toast() {
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage(e.detail || '');
    };

    window.addEventListener('app_toast', handleToast);
    return () => window.removeEventListener('app_toast', handleToast);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage('');
    }, 2600);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (!toastMessage) return null;

  return (
    <div id="toast-root">
      <div className="toast" role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}
