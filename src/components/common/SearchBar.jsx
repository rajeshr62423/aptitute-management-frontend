'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Modern AptitudePro SearchBar Component
 * @param {string} value
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange
 * @param {() => void} onClear
 * @param {string} placeholder
 * @param {string} id
 * @param {string} name
 * @param {string} className
 * @param {React.CSSProperties} style
 * @param {boolean} disabled
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  id = 'search-input',
  name = 'search',
  className = '',
  style = {},
  disabled = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (disabled) return;
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Simulate synthetic change event with empty value
      onChange({ target: { name, value: '' } });
    }
  };

  return (
    <div
      className={`search-bar-container ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Left Search Icon */}
      <span
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isFocused ? '#ea580c' : value ? '#f97316' : '#a8a29e',
          transition: 'color 0.15s ease',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <Search size={16} strokeWidth={isFocused ? 2.2 : 2} />
      </span>

      {/* Input Field */}
      <input
        {...props}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          height: '42px',
          paddingLeft: '38px',
          paddingRight: value ? '34px' : '14px',
          paddingTop: 0,
          paddingBottom: 0,
          backgroundColor: '#ffffff',
          color: '#292524',
          fontSize: '13px',
          fontWeight: 500,
          fontFamily: 'inherit',
          borderRadius: '8px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isFocused ? '#f97316' : value ? '#fed7aa' : '#e7e5e4',
          boxShadow: isFocused ? '0 0 0 3px rgba(249, 115, 22, 0.12)' : 'none',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
          lineHeight: '42px',
        }}
        className="hover:border-stone-400 focus:border-orange-500"
      />

      {/* Clear Button when text is present */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a8a29e',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            padding: 0,
          }}
          className="hover:text-stone-700 hover:bg-stone-100"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
