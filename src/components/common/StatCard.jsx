'use client';

import React from 'react';

export default function StatCard({
  label,
  value,
  note = '',
  className = '',
}) {
  return (
    <div className={`stat ${className}`.trim()}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}
