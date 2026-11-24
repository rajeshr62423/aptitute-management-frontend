'use client';

import React from 'react';

export default function Skeleton({
  width = '100%',
  height = '16px',
  borderRadius = '6px',
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
