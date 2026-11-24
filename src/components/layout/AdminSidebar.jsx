'use client';

import React from 'react';
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

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

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
      dispatch(post_admin_logout_request());
      router.push('/admin/login');
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <Link href="/admin/dashboard" className="brand" onClick={onClose}>
        <span className="brand-mark">A</span>
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

            if (item.action) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="nav-item"
                  style={{ width: '100%', textAlign: 'left', border: 0 }}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="ico" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon size={18} />
                  </span>
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
                <span className="ico" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
