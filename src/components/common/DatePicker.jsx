'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Modern AptitudePro DatePicker Component
 * @param {string} label
 * @param {string} name
 * @param {string} value - Date string in 'YYYY-MM-DD'
 * @param {({ target: { name: string, value: string } }) => void} onChange
 * @param {string} placeholder
 * @param {boolean} disabled
 */
export default function DatePicker({
  label,
  name,
  value = '',
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial view year/month from value, or default to current date
  const parsedDate = value ? new Date(value + 'T00:00:00') : null;
  const initialYear = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : new Date().getFullYear();
  const initialMonth = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getMonth() : new Date().getMonth();

  const [prevValue, setPrevValue] = useState(value);
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  // Sync view year/month when value prop changes during render
  if (prevValue !== value) {
    setPrevValue(value);
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Format display text
  const formatDisplay = (val) => {
    if (!val) return '';
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime())) return val;
    return `${shortMonthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    if (disabled) return;
    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const formattedDate = `${y}-${m}-${d}`;
    onChange?.({ target: { name, value: formattedDate } });
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.({ target: { name, value: '' } });
  };

  const handleSelectToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${y}-${m}-${d}`;
    onChange?.({ target: { name, value: formattedDate } });
    setViewYear(y);
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();

  return (
    <div
      ref={containerRef}
      className={`field ${className}`.trim()}
      style={{ position: 'relative' }}
    >
      {label && (
        <label htmlFor={name} className="block text-xs font-bold text-stone-800 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (['Enter', ' '].includes(e.key) && !disabled) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className="w-full flex items-center justify-between text-left rounded-lg border bg-white px-3 py-2.5 text-stone-800 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        style={{
          borderColor: isOpen ? '#f97316' : '#e7e5e4',
          boxShadow: isOpen ? '0 0 0 3px rgba(249, 115, 22, 0.12)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          height: '42px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
          <CalendarIcon size={16} className="text-orange-500 flex-shrink-0" />
          <span
            style={{
              color: value ? '#292524' : '#a8a29e',
              fontSize: '13px',
              fontWeight: value ? 500 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {value ? formatDisplay(value) : placeholder}
          </span>
        </div>

        {/* Clear Icon or Indicator */}
        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            title="Clear date"
            aria-label="Clear selected date"
            style={{
              padding: '2px',
              borderRadius: '4px',
              color: '#a8a29e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hover:text-stone-700 hover:bg-stone-100"
          >
            <X size={14} />
          </button>
        ) : (
          <span style={{ width: '14px' }} />
        )}
      </div>

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 70,
            width: '280px',
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            padding: '14px',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Header: Month / Year Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#292524' }}>
              {monthNames[viewMonth]} {viewYear}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #e7e5e4',
                  backgroundColor: '#fafaf9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#78716c',
                  cursor: 'pointer',
                }}
                className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #e7e5e4',
                  backgroundColor: '#fafaf9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#78716c',
                  cursor: 'pointer',
                }}
                className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Days of Week Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              textAlign: 'center',
              marginBottom: '6px',
            }}
          >
            {daysOfWeek.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#a8a29e',
                  padding: '4px 0',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '3px',
            }}
          >
            {/* Previous month leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span
                key={`prev-${i}`}
                style={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#d6d3d1',
                }}
              >
                {daysInPrevMonth - firstDayOfWeek + i + 1}
              </span>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  style={{
                    height: '32px',
                    borderRadius: '6px',
                    border: isToday && !isSelected ? '1px solid #f97316' : '1px solid transparent',
                    backgroundColor: isSelected ? '#f97316' : 'transparent',
                    color: isSelected ? '#ffffff' : '#292524',
                    fontWeight: isSelected ? 700 : isToday ? 600 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s ease',
                  }}
                  className={isSelected ? '' : 'hover:bg-orange-50 hover:text-orange-700'}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #f0eeeb',
            }}
          >
            <button
              type="button"
              onClick={handleSelectToday}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#ea580c',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '4px',
              }}
              className="hover:bg-orange-50"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#78716c',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
                className="hover:bg-stone-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
