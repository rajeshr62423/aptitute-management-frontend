'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md'
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  loadingText = '',
  className = '',
  style = {},
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-primary';

  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`btn ${variantClass} ${sizeClass} ${loading ? 'is-loading' : ''} ${className}`.trim()}
      style={{
        ...style,
        ...(loading ? { cursor: 'wait', opacity: 0.85 } : {}),
      }}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
          <span>{loadingText || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
