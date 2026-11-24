'use client';

import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'pass' | 'fail' | 'active' | 'inactive' | 'pending' | 'neutral'
  className = '',
}) {
  const variantClass = {
    pass: 'badge-pass',
    active: 'badge-active',
    fail: 'badge-fail',
    inactive: 'badge-inactive',
    pending: 'badge-pending',
    neutral: 'badge-neutral',
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
