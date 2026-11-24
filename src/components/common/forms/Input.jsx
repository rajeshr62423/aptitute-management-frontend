import React from 'react';
import { Controller } from 'react-hook-form';

const Input = ({
  control,
  name,
  errors,
  type = 'text',
  label,
  placeholder,
  required = false,
  full = false,
  className = '',
  ...props
}) => {
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
          <input
            {...field}
            {...props}
            id={name}
            type={type}
            placeholder={placeholder}
            value={field.value ?? ''}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-800 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        )}
      />

      {errors?.[name] && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Input;
