'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Custom AptitudePro Select Component
 * Features:
 * - Visually identical to AptitudePro text inputs (height, border, radius, padding, colors)
 * - Right-aligned smooth rotating dropdown arrow
 * - Clean white background with subtle #D1D5DB border
 * - Brand orange hover/focus states (#F97316)
 * - Full-field clickable area with accessible ARIA combobox pattern
 * - Keyboard navigation (Arrow keys, Enter, Space, Escape, Tab)
 * - Auto-scroll on keyboard navigation
 * - Responsive width filling 100% of its grid column
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error = null,
  disabled = false,
  className = '',
  full = false,
  size = 'md',
  dropUp = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxRef = useRef(null);
  const listboxId = useId();

  const isSmall = size === 'sm';

  // Normalize options to [{ value, label }]
  const normalizedOptions = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return { value: opt.value, label: opt.label ?? opt.value };
      }
      return { value: opt, label: opt };
    });
  }, [options]);

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsHovered(false);
        setHighlightedIndex(-1);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto-scroll highlighted option into view on keyboard navigation
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.querySelectorAll('[role="option"]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name,
          value: optValue,
        },
      });
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
        const idx = normalizedOptions.findIndex(
          (opt) => String(opt.value) === String(value)
        );
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < normalizedOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : normalizedOptions.length - 1
      );
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
        handleSelect(normalizedOptions[highlightedIndex].value);
      }
    }
  };

  // Border & focus calculation
  const borderColor = error
    ? '#ef4444'
    : isOpen
    ? '#f97316'
    : isHovered && !disabled
    ? '#9ca3af'
    : '#d1d5db';

  const boxShadow = error && isOpen
    ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
    : isOpen
    ? '0 0 0 3px rgba(249, 115, 22, 0.15)'
    : 'none';

  return (
    <div
      ref={containerRef}
      className={`field ${full ? 'full' : ''} ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      {...props}
    >
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-bold text-stone-800 mb-1.5"
          style={{ cursor: 'pointer' }}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* Select trigger button */}
      <button
        id={name}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full flex items-center justify-between text-left rounded-lg bg-white text-stone-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: isSmall ? '32px' : '42px',
          minHeight: isSmall ? '32px' : '42px',
          padding: isSmall ? '0 10px' : '0 12px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor,
          borderRadius: '8px',
          backgroundColor: disabled ? '#f5f5f4' : '#ffffff',
          boxShadow,
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontFamily: 'inherit',
          fontSize: isSmall ? '12px' : '14px',
          fontWeight: 500,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <span
          style={{
            flex: '1 1 auto',
            textAlign: 'left',
            color: selectedOption ? '#292524' : '#9ca3af',
            fontSize: isSmall ? '12px' : '14px',
            fontWeight: selectedOption ? 500 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: isSmall ? '30px' : '40px',
            userSelect: 'none',
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Right-aligned ChevronDown icon */}
        <ChevronDown
          size={isSmall ? 14 : 16}
          style={{
            color: error ? '#ef4444' : isOpen ? '#f97316' : '#6b7280',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
            marginLeft: '8px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Options Listbox */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          style={{
            position: 'absolute',
            ...(dropUp
              ? { bottom: 'calc(100% + 4px)', left: 0 }
              : { top: 'calc(100% + 4px)', left: 0 }),
            width: '100%',
            minWidth: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            zIndex: 50,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '4px',
            margin: 0,
            listStyle: 'none',
          }}
        >
          {/* Optional clear/placeholder option if field is not required */}
          {placeholder && !required && (
            <li
              role="option"
              aria-selected={!selectedOption}
              onClick={() => handleSelect('')}
              style={{
                padding: isSmall ? '6px 10px' : '9px 12px',
                fontSize: isSmall ? '12px' : '14px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: !selectedOption ? '#ea580c' : '#78716c',
                backgroundColor: !selectedOption ? '#fff7ed' : 'transparent',
                fontWeight: !selectedOption ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={() => setHighlightedIndex(-1)}
            >
              <span>{placeholder}</span>
            </li>
          )}

          {normalizedOptions.map((opt, idx) => {
            const isSelected =
              selectedOption && String(selectedOption.value) === String(opt.value);
            const isHighlighted = highlightedIndex === idx;

            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  padding: isSmall ? '6px 10px' : '9px 12px',
                  fontSize: isSmall ? '12px' : '14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isSelected ? '#ea580c' : '#292524',
                  backgroundColor: isSelected
                    ? '#fff7ed'
                    : isHighlighted
                    ? '#fafaf9'
                    : 'transparent',
                  fontWeight: isSelected ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <Check
                    size={isSmall ? 13 : 15}
                    className="text-orange-600 flex-shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Validation Error Message */}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-xs text-red-600 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
