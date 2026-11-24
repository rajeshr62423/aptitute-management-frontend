'use client';

import React from 'react';

export default function AssessmentTimer({ formattedTime }) {
  return (
    <span style={{ color: 'var(--orange)', fontSize: '17px', fontWeight: 800 }}>
      ◷ <b id="timer">{formattedTime}</b>
    </span>
  );
}
