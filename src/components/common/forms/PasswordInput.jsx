'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  control,
  name,
  errors,
  label = 'Password',
  placeholder = 'Your password',
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="block text-xs font-bold text-stone-800 mb-1.5">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              {...props}
              id={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              value={field.value ?? ''}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-800 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{ paddingRight: '40px' }}
            />
          )}
        />

        <button
          type="button"
          className="btn-ghost"
          style={{
            position: 'absolute',
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '6px 8px',
            color: '#78716c',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {errors?.[name] && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
