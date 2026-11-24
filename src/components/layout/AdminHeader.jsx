'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, ChevronDown } from 'lucide-react';

export default function AdminHeader({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="btn-ghost mobile-menu lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>
        <span className="muted small">Assessment Management</span>
      </div>
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          className="btn-ghost"
          aria-label="Notifications"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#78716c',
            padding: '6px',
            borderRadius: '6px',
          }}
        >
          <Bell size={18} />
        </button>
        <Link href="/admin/profile" className="profile-chip" style={{ color: 'inherit' }}>
          <span className="avatar">A</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Admin
            <ChevronDown size={13} className="text-stone-500" />
          </span>
        </Link>
      </div>
    </header>
  );
}
