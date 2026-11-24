'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg)',
        padding: '20px',
      }}
    >
      <div className="panel center" style={{ maxWidth: '440px', padding: '36px' }}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '16px' }}>
          <span className="brand-mark">A</span>
          <span>AptitudePro</span>
        </div>
        <h1 className="page-title" style={{ fontSize: '32px', color: 'var(--orange)' }}>
          404
        </h1>
        <p className="page-subtitle" style={{ margin: '8px 0 24px' }}>
          Page not found. The requested page does not exist.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/register" className="btn btn-primary btn-sm">
            Candidate Home
          </Link>
          <Link href="/admin/login" className="btn btn-secondary btn-sm">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
