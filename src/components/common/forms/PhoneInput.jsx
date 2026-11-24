'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import en from 'react-phone-number-input/locale/en.json';
import { ChevronDown, Check, Search, X } from 'lucide-react';

/**
 * Pre-sorted list of all supported countries with names and calling codes
 */
const ALL_COUNTRIES = getCountries()
  .map((code) => {
    let callingCode = '';
    try {
      callingCode = `+${getCountryCallingCode(code)}`;
    } catch {
      callingCode = '';
    }
    return {
      code,
      name: en[code] || code,
      callingCode,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Internal PhoneInput component managing unified styling, country selection and numeric input
 */
function PhoneInputInner({
  field,
  name,
  placeholder = 'Enter phone number',
  defaultCountry = 'IN',
  disabled = false,
  errorMessage,
}) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [nationalNumber, setNationalNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Sync initial / external field.value into local country and nationalNumber
  useEffect(() => {
    if (field.value) {
      try {
        const parsed = parsePhoneNumber(field.value);
        if (parsed) {
          if (parsed.country) setSelectedCountry(parsed.country);
          if (parsed.nationalNumber) setNationalNumber(parsed.nationalNumber);
        } else {
          // Fallback: strip leading country code if matches current selected country
          let code = '';
          try {
            code = getCountryCallingCode(selectedCountry);
          } catch {}
          let val = field.value;
          if (code && val.startsWith(`+${code}`)) {
            val = val.slice(code.length + 1);
          }
          setNationalNumber(val.replace(/\D/g, ''));
        }
      } catch {
        const digits = (field.value || '').replace(/\D/g, '');
        setNationalNumber(digits);
      }
    } else if (field.value === '' && nationalNumber !== '') {
      setNationalNumber('');
    }
  }, [field.value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Focus search input on dropdown open
  useEffect(() => {
    if (isDropdownOpen) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      const currentIdx = filteredCountries.findIndex((c) => c.code === selectedCountry);
      setHighlightIndex(currentIdx >= 0 ? currentIdx : 0);
    } else {
      setSearchQuery('');
      setHighlightIndex(-1);
    }
  }, [isDropdownOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active item into view on keyboard navigation
  useEffect(() => {
    if (isDropdownOpen && highlightIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightIndex];
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex, isDropdownOpen]);

  // Calling code for current selected country
  const currentCallingCode = useMemo(() => {
    try {
      return `+${getCountryCallingCode(selectedCountry)}`;
    } catch {
      return '+91';
    }
  }, [selectedCountry]);

  // Filtered countries based on search query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((c) => {
      const name = c.name.toLowerCase();
      const code = c.code.toLowerCase();
      const call = c.callingCode.toLowerCase();
      return (
        name.includes(q) ||
        code.includes(q) ||
        call.includes(q) ||
        call.replace('+', '').includes(q)
      );
    });
  }, [searchQuery]);

  // Handle national number input change (numeric only)
  const handleNumberChange = (e) => {
    const rawVal = e.target.value;
    // Allow only numeric digits, spaces, and hyphens for pleasant formatting
    const sanitized = rawVal.replace(/[^\d\s-]/g, '');
    setNationalNumber(sanitized);

    const cleanDigits = sanitized.replace(/\D/g, '');
    if (!cleanDigits) {
      field.onChange('');
      return;
    }

    let code = '';
    try {
      code = getCountryCallingCode(selectedCountry);
    } catch {
      code = '91';
    }
    const fullNumber = `+${code}${cleanDigits}`;
    field.onChange(fullNumber);
  };

  // Handle country selection
  const handleCountrySelect = (newCountryCode) => {
    setSelectedCountry(newCountryCode);
    setIsDropdownOpen(false);
    inputRef.current?.focus();

    const cleanDigits = nationalNumber.replace(/\D/g, '');
    if (cleanDigits) {
      let code = '';
      try {
        code = getCountryCallingCode(newCountryCode);
      } catch {
        code = '';
      }
      const fullNumber = code ? `+${code}${cleanDigits}` : cleanDigits;
      field.onChange(fullNumber);
    }
  };

  // Keyboard navigation inside country dropdown
  const handleDropdownKeyDown = (e) => {
    if (!isDropdownOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        filteredCountries.length === 0
          ? -1
          : prev < filteredCountries.length - 1
          ? prev + 1
          : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        filteredCountries.length === 0
          ? -1
          : prev > 0
          ? prev - 1
          : filteredCountries.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filteredCountries.length) {
        handleCountrySelect(filteredCountries[highlightIndex].code);
      } else if (filteredCountries.length > 0) {
        handleCountrySelect(filteredCountries[0].code);
      }
    }
  };

  const SelectedFlag = flags[selectedCountry];

  return (
    <div
      ref={containerRef}
      className="aptitudepro-phone-wrapper"
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Unified Phone Input Container */}
      <div
        className="aptitudepro-phone-container"
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '44px',
          minHeight: '44px',
          backgroundColor: '#ffffff',
          border: '1px solid',
          borderColor: errorMessage
            ? '#ef4444'
            : (isFocused || isDropdownOpen)
            ? '#ff6500'
            : '#d1d5db',
          borderRadius: '9px',
          boxShadow: errorMessage && (isFocused || isDropdownOpen)
            ? '0 0 0 3px rgba(239, 68, 68, 0.16)'
            : (isFocused || isDropdownOpen)
            ? '0 0 0 3px rgba(255, 101, 0, 0.16)'
            : 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          position: 'relative',
        }}
      >
        {/* Dedicated Country Code Selector Trigger: [ 🇮🇳 +91 ▼ ] */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsDropdownOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-label="Select Country Code"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '100%',
            padding: '0 10px 0 12px',
            background: 'transparent',
            border: 'none',
            borderRight: '1px solid #e5e7eb',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            userSelect: 'none',
            flexShrink: 0,
            marginRight: '8px',
          }}
        >
          {SelectedFlag ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                width: '20px',
                height: '14px',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                flexShrink: 0,
              }}
            >
              <SelectedFlag
                title={en[selectedCountry] || selectedCountry}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </span>
          ) : (
            <span style={{ fontSize: '14px' }}>🌐</span>
          )}

          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#172033',
              letterSpacing: '0.01em',
            }}
          >
            {currentCallingCode}
          </span>

          <ChevronDown
            size={14}
            style={{
              color: '#64748b',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              marginLeft: '1px',
            }}
          />
        </button>

        {/* Dedicated National Phone Number Input: [ Enter phone number ] */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={nationalNumber}
          onChange={handleNumberChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            field.onBlur();
          }}
          disabled={disabled}
          className="phone-number-field"
          style={{
            boxSizing: 'border-box',
            flex: 1,
            width: '100%',
            minWidth: 0,
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '0 12px 0 0',
            fontSize: '14px',
            color: '#172033',
            fontFamily: 'inherit',
            boxShadow: 'none',
          }}
        />

        {/* Floating Country Selection Panel */}
        {isDropdownOpen && (
          <div
            role="listbox"
            onKeyDown={handleDropdownKeyDown}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              width: 'min(330px, calc(100vw - 40px))',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 14px 35px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 100,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search Header */}
            <div
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: '#fafaf9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Search size={14} style={{ color: '#a8a29e', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '13px',
                    color: '#1c1917',
                    fontFamily: 'inherit',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#a8a29e',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Country List Items */}
            <div
              ref={listRef}
              style={{
                maxHeight: '230px',
                overflowY: 'auto',
                padding: '6px',
              }}
            >
              {filteredCountries.length === 0 ? (
                <div
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: '#78716c',
                    fontSize: '13px',
                  }}
                >
                  No country found matching "{searchQuery}"
                </div>
              ) : (
                filteredCountries.map((c, idx) => {
                  const isSelected = c.code === selectedCountry;
                  const isHighlighted = idx === highlightIndex;
                  const CountryFlag = flags[c.code];

                  return (
                    <div
                      key={c.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(c.code)}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected
                          ? '#fff7ed'
                          : isHighlighted
                          ? '#f5f5f4'
                          : 'transparent',
                        color: isSelected ? '#ea580c' : '#172033',
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '13px',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {CountryFlag && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              width: '18px',
                              height: '13px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                              flexShrink: 0,
                            }}
                          >
                            <CountryFlag
                              title={c.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </span>
                        )}
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {c.name}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: isSelected ? '#ea580c' : '#64748b',
                            fontWeight: 600,
                          }}
                        >
                          {c.callingCode}
                        </span>
                        {isSelected && (
                          <Check size={14} className="text-orange-600" strokeWidth={2.5} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AptitudePro Custom Phone Input Component with react-hook-form integration
 */
export default function PhoneInput({
  control,
  name = 'phone',
  errors,
  label = 'Phone number',
  placeholder = 'Enter phone number',
  required = false,
  full = false,
  defaultCountry = 'IN',
  disabled = false,
  className = '',
}) {
  const errorMessage = errors?.[name]?.message;

  return (
    <div className={`field ${full ? 'full' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="block text-xs font-bold text-stone-800 mb-1.5">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInputInner
            field={field}
            name={name}
            placeholder={placeholder}
            defaultCountry={defaultCountry}
            disabled={disabled}
            errorMessage={errorMessage}
          />
        )}
      />

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {errorMessage}
        </p>
      )}

      <style jsx global>{`
        .aptitudepro-phone-wrapper .phone-number-field {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
          font-size: 14px !important;
          font-family: inherit !important;
          color: #172033 !important;
          height: 100% !important;
          padding: 0 12px 0 0 !important;
        }

        .aptitudepro-phone-wrapper .phone-number-field::placeholder {
          color: #94a3b8 !important;
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
}
