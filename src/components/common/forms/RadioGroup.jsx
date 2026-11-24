import React from 'react';
import { Controller } from 'react-hook-form';

const RadioGroup = ({
  control,
  name,
  errors,
  label,
  options = [],
  className = '',
}) => {
  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="block text-xs font-bold text-stone-800 mb-1.5">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isChecked = field.value === optVal;

              return (
                <label
                  key={optVal}
                  className={`option ${isChecked ? 'selected' : ''}`}
                  onClick={() => field.onChange(optVal)}
                >
                  <input
                    type="radio"
                    name={name}
                    checked={isChecked}
                    onChange={() => field.onChange(optVal)}
                  />
                  <span>{optLabel}</span>
                </label>
              );
            })}
          </div>
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

export default RadioGroup;
