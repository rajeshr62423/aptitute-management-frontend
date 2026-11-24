import React from 'react';
import { Controller } from 'react-hook-form';

const TextArea = ({
  control,
  name,
  errors,
  label,
  placeholder,
  rows = 3,
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
          <textarea
            {...field}
            {...props}
            id={name}
            rows={rows}
            placeholder={placeholder}
            value={field.value ?? ''}
            className="w-full min-h-[90px] rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-800 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
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

export default TextArea;
