'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { ChevronDown, User, Mail, Phone, GraduationCap, LogOut, CheckCircle2 } from 'lucide-react';
import LogoutConfirmModal from '@/components/common/LogoutConfirmModal';
import { clearTestRecovery, clearCurrentCandidate } from '@/services/assessmentService';
import { set_current_candidate } from '@/redux/candidates/action';

export default function CandidateProfileDropdown({ candidate, isAssessmentActive = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const name = candidate?.name || 'Candidate';
  const email = candidate?.email || '';
  const phone = candidate?.phone || '';
  const qualification = candidate?.qualification || '';

  // Calculate initials (up to 2 characters)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'C';

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    // Clear candidate session and any ongoing recovery state
    clearTestRecovery();
    clearCurrentCandidate();
    dispatch(set_current_candidate(null));
    setShowLogoutModal(false);
    router.push('/register');
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="profile-trigger"
      >
        <div className="avatar-wrapper">
          <span className="avatar-initials">{initials}</span>
          <span className="online-badge" />
        </div>

        <div className="profile-info">
          <span className="profile-name">{name}</span>
          <span className="profile-role">Candidate</span>
        </div>

        <ChevronDown
          size={15}
          className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {/* Header Card */}
          <div className="menu-header">
            <div className="menu-avatar">{initials}</div>
            <div className="menu-user-details">
              <span className="menu-name">{name}</span>
              {email && <span className="menu-email" title={email}>{email}</span>}
              <div className="verified-badge">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>Verified Candidate</span>
              </div>
            </div>
          </div>

          {/* Meta Details Section (Phone, Qualification) */}
          {(phone || qualification) && (
            <div className="menu-meta-section">
              {phone && (
                <div className="meta-item">
                  <Phone size={13} className="meta-icon" />
                  <span className="meta-text">{phone}</span>
                </div>
              )}
              {qualification && (
                <div className="meta-item">
                  <GraduationCap size={13} className="meta-icon" />
                  <span className="meta-text">{qualification}</span>
                </div>
              )}
            </div>
          )}

          <div className="menu-divider" />

          {/* Actions */}
          <div className="menu-actions">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="menu-action-btn danger"
              role="menuitem"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isAssessmentActive={isAssessmentActive}
        role="candidate"
      />

      <style jsx>{`
        .profile-trigger {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 12px 5px 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .profile-trigger:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
        }

        .avatar-wrapper {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(234, 88, 12, 0.25);
        }

        .avatar-initials {
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .online-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          line-height: 1.25;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
        }

        :global(.chevron-icon) {
          color: #94a3b8;
          transition: transform 0.2s ease, color 0.15s ease;
        }

        .profile-trigger:hover :global(.chevron-icon) {
          color: #475569;
        }

        :global(.chevron-icon.rotated) {
          transform: rotate(180deg);
          color: #ff6b16;
        }

        /* Floating Dropdown */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 270px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 14px 35px -6px rgba(15, 23, 42, 0.14),
                      0 4px 10px -2px rgba(15, 23, 42, 0.05);
          padding: 14px;
          z-index: 50;
          animation: menuEnter 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes menuEnter {
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
          gap: 12px;
          padding-bottom: 12px;
        }

        .menu-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 3px 8px rgba(234, 88, 12, 0.25);
        }

        .menu-user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .menu-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-email {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          align-self: flex-start;
        }

        .menu-meta-section {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          padding: 8px 10px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #475569;
        }

        :global(.meta-icon) {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 4px 0 8px 0;
        }

        .menu-actions {
          display: flex;
          flex-direction: column;
        }

        .menu-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .menu-action-btn.danger {
          color: #dc2626;
        }

        .menu-action-btn.danger:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        @media (max-width: 640px) {
          .profile-info {
            display: none;
          }
          .profile-trigger {
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
}
