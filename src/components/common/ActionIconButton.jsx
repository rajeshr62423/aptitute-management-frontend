'use client';

import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

/**
 * Universal Action Icon Button for table rows using Lucide Icons
 * @param {'view' | 'edit' | 'delete'} action
 * @param {string} tooltip
 * @param {string} ariaLabel
 * @param {() => void} onClick
 * @param {boolean} disabled
 */
export default function ActionIconButton({
  action = 'view',
  tooltip,
  ariaLabel,
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const configs = {
    view: {
      defaultLabel: 'View details',
      icon: <Eye size={15} />,
      style: {
        color: '#64748b',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
      },
      hoverClass: 'hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300',
    },
    edit: {
      defaultLabel: 'Edit record',
      icon: <Pencil size={15} />,
      style: {
        color: '#ea580c',
        backgroundColor: '#ffffff',
        borderColor: '#fed7aa',
      },
      hoverClass: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300',
    },
    delete: {
      defaultLabel: 'Delete record',
      icon: <Trash2 size={15} />,
      style: {
        color: '#dc2626',
        backgroundColor: '#ffffff',
        borderColor: '#fecaca',
      },
      hoverClass: 'hover:bg-red-50 hover:text-red-700 hover:border-red-300',
    },
  };

  const current = configs[action] || configs.view;
  const label = ariaLabel || tooltip || current.defaultLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip || label}
      aria-label={label}
      style={{
        width: '32px',
        height: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease-in-out',
        opacity: disabled ? 0.5 : 1,
        ...current.style,
      }}
      className={`focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${current.hoverClass} ${className}`.trim()}
      {...props}
    >
      {current.icon}
    </button>
  );
}
