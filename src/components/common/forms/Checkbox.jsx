import React from 'react';
import { Controller } from 'react-hook-form';

const Checkbox = ({
  control,
  name,
  errors,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`.trim()}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label className="check flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
            <input
              type="checkbox"
              {...props}
              id={name}
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="cursor-pointer"
            />
            <span>{label}</span>
          </label>
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

export default Checkbox;
