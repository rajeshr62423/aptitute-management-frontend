'use client';

import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  disabled = false,
  className = '',
  full = false,
  ...props
}) {
  return (
    <div className={`field ${full ? 'full' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <span className="tiny" style={{ color: 'var(--red)' }}>{error}</span>}
    </div>
  );
}
