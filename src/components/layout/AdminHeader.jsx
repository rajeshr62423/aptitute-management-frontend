'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Menu, Bell, ChevronDown, User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import LogoutConfirmModal from '@/components/common/LogoutConfirmModal';
import { post_admin_logout_request } from '@/redux/auth/action';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader({ onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    router.push(path);
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutModal(true);
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
        <span className="muted small">Aptitute Management</span>
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

        {/* Admin Profile Dropdown Trigger */}
        <div className="admin-dropdown-anchor" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className="profile-chip-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="admin-avatar">A</span>
            <span className="admin-name-wrap">
              <span className="admin-name">Admin</span>
              <ChevronDown
                size={13}
                className={`chevron-svg ${dropdownOpen ? 'rotated' : ''}`}
              />
            </span>
          </button>

          {/* Profile Dropdown Panel */}
          {dropdownOpen && (
            <div className="admin-dropdown-menu" role="menu">
              <div className="menu-header">
                <div className="header-avatar">A</div>
                <div className="header-details">
                  <span className="header-title">Administrator</span>
                  <span className="header-email">admin@aptitudepro.com</span>
                  <div className="badge-superadmin">
                    <ShieldCheck size={11} />
                    <span>Super Admin</span>
                  </div>
                </div>
              </div>

              <div className="menu-divider" />

              <div className="menu-items">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleNavigate('/admin/profile')}
                  role="menuitem"
                >
                  <User size={15} className="item-icon" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleNavigate('/admin/settings')}
                  role="menuitem"
                >
                  <Settings size={15} className="item-icon" />
                  <span>Assessment Settings</span>
                </button>
              </div>

              <div className="menu-divider" />

              <div className="menu-footer">
                <button
                  type="button"
                  className="dropdown-item danger"
                  onClick={handleLogoutClick}
                  role="menuitem"
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isAssessmentActive={false}
        role="admin"
      />

      <style jsx>{`
        .profile-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .profile-chip-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .admin-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          display: grid;
          place-items: center;
          box-shadow: 0 2px 6px rgba(234, 88, 12, 0.25);
        }

        .admin-name-wrap {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        :global(.chevron-svg) {
          color: #64748b;
          transition: transform 0.2s ease, color 0.15s ease;
        }

        :global(.chevron-svg.rotated) {
          transform: rotate(180deg);
          color: #ff6b16;
        }

        .admin-dropdown-anchor {
          position: relative;
          display: inline-block;
        }

        /* Dropdown Panel */
        .admin-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 250px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 14px 35px -6px rgba(15, 23, 42, 0.14),
                      0 4px 10px -2px rgba(15, 23, 42, 0.05);
          padding: 12px;
          z-index: 1000;
          pointer-events: auto;
          animation: menuSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes menuSlide {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .menu-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 6px 10px 6px;
        }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .header-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .header-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }

        .header-email {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge-superadmin {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #ea580c;
          background: #fff7ed;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          align-self: flex-start;
        }

        .menu-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 6px 0;
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          border-radius: 8px;
          text-decoration: none;
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          pointer-events: auto;
          user-select: none;
        }

        .dropdown-item * {
          pointer-events: none;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .dropdown-item:active {
          background: #fff7ed;
        }

        :global(.item-icon) {
          color: #94a3b8;
          transition: color 0.15s ease;
        }

        .dropdown-item:hover :global(.item-icon) {
          color: #ff6b16;
        }

        .dropdown-item.danger {
          color: #dc2626;
        }

        .dropdown-item.danger:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        .menu-footer {
          margin-top: 2px;
        }
      `}</style>
    </header>
  );
}
