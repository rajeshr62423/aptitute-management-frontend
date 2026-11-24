'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { post_admin_logout_request } from '@/redux/auth/action';
import { useAuth } from '@/context/AuthContext';
import LogoutConfirmModal from '@/components/common/LogoutConfirmModal';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      ],
    },
    {
      label: 'ASSESSMENT',
      items: [
        { icon: Users, label: 'Candidates', href: '/admin/candidates' },
        { icon: HelpCircle, label: 'Question Management', href: '/admin/questions' },
      ],
    },
    {
      label: 'CONFIGURATION',
      items: [
        { icon: Settings, label: 'Assessment Settings', href: '/admin/settings' },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { icon: User, label: 'My Profile', href: '/admin/profile' },
        { icon: LogOut, label: 'Logout', action: 'logout' },
      ],
    },
  ];

  const handleItemClick = (item) => {
    if (onClose) onClose();
    if (item.action === 'logout') {
      setShowLogoutModal(true);
    }
  };

  const handleConfirmLogout = async () => {
    try {
      if (auth?.logout) {
        auth.logout();
      }
      dispatch(post_admin_logout_request());
      setShowLogoutModal(false);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        <Link
          href="/admin/dashboard"
          className="brand"
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <img
            src="/app-logo.png"
            alt="AptitudePro"
            style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
          />
          <span>AptitudePro</span>
        </Link>

        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href &&
                (pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href)));

              if (item.action === 'logout') {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="nav-item text-left w-full cursor-pointer logout-nav-btn"
                    onClick={() => handleItemClick(item)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isAssessmentActive={false}
        role="admin"
      />
    </>
  );
}
