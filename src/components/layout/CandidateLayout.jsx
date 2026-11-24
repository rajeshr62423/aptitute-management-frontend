'use client';

import React from 'react';
import Link from 'next/link';

export default function CandidateLayout({
  children,
  rightContent = null,
  narrow = false,
  maxWidth = null,
  fullWidth = false,
}) {
  return (
    <div
      className="candidate-shell"
      style={{
        background: '#F8FAFC',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      <header
        className="candidate-top"
        style={{
          height: '58px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 max(20px, calc((100% - 1220px) / 2))',
        }}
      >
        <Link
          href="/register"
          className="brand"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/app-logo.png"
            alt="AptitudePro"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              objectFit: 'cover',
              boxShadow: '0 3px 10px rgba(255, 107, 22, 0.28)',
            }}
          />
          <span
            style={{
              fontSize: '19px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#172033',
            }}
          >
            Aptitude<span style={{ color: '#FF6B16' }}>Pro</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>{rightContent}</div>
      </header>
      <main
        className={`candidate-content ${narrow ? 'narrow' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: maxWidth || (fullWidth ? '100%' : narrow ? '650px' : '900px'),
          margin: fullWidth ? '0 auto' : '28px auto',
          padding: fullWidth ? 0 : '0 20px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
