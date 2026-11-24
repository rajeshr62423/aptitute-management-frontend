'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import CommonSelect from '@/components/common/Select';

const Select = ({
  control,
  name,
  errors,
  label,
  options = [],
  placeholder = 'Select an option',
  required = false,
  full = false,
  className = '',
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CommonSelect
          {...props}
          id={name}
          name={name}
          label={label}
          options={options}
          placeholder={placeholder}
          required={required}
          full={full}
          className={className}
          value={field.value ?? ''}
          onChange={field.onChange}
          error={errors?.[name]?.message}
        />
      )}
    />
  );
};

export default Select;
