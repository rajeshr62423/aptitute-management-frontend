'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { init_auth_state } from '@/redux/auth/action';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const emptySubscribe = () => () => {};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    dispatch(init_auth_state());
  }, [dispatch]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isClient, router]);

  if (!isClient) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <div className="muted font-bold">Loading AptitudePro...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-area">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
