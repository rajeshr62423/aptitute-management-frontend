'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import Skeleton from './Skeleton';

/**
 * Standard brand spinner with AptitudePro orange accent
 */
export function BrandSpinner({ size = 24, className = '', color = 'var(--orange, #ff6b16)' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`.trim()}
      style={{ color }}
      aria-hidden="true"
    />
  );
}

/**
 * GlobalLoader - Configurable loader for general use
 */
export function GlobalLoader({
  size = 'md',
  message = '',
  inline = false,
  className = '',
  style = {},
}) {
  const pixelSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  if (inline) {
    return (
      <span
        className={`inline-flex items-center gap-2 ${className}`.trim()}
        style={style}
        role="status"
        aria-live="polite"
      >
        <BrandSpinner size={pixelSize} />
        {message && <span className="text-xs text-slate-600 font-medium">{message}</span>}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`.trim()}
      style={style}
      role="status"
      aria-live="polite"
    >
      <BrandSpinner size={pixelSize} />
      {message && <p className="text-sm text-slate-600 font-semibold">{message}</p>}
    </div>
  );
}

/**
 * PageLoader - Centered loader for whole page content areas
 */
export function PageLoader({ message = 'Loading content...', minHeight = '320px' }) {
  return (
    <div
      className="page-loader-wrapper"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <div className="page-loader-box">
        <div className="page-loader-brand">
          <span className="brand-badge">A</span>
          <BrandSpinner size={32} />
        </div>
        {message && <p className="page-loader-text">{message}</p>}
      </div>

      <style jsx>{`
        .page-loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 40px 20px;
        }

        .page-loader-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .page-loader-brand {
          position: relative;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
        }

        .brand-badge {
          position: absolute;
          font-size: 14px;
          font-weight: 800;
          color: #ff6b16;
        }

        .page-loader-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

/**
 * ButtonLoader - Loading spinner with optional label for buttons
 */
export function ButtonLoader({ text = 'Please wait...', size = 15 }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <Loader2 size={size} className="animate-spin text-current" />
      {text && <span>{text}</span>}
    </span>
  );
}

/**
 * InlineLoader - Compact micro-loader
 */
export function InlineLoader({ size = 16, className = '' }) {
  return <BrandSpinner size={size} className={className} />;
}

/**
 * FullScreenLoader - Full viewport overlay with backdrop blur
 */
export function FullScreenLoader({
  title = 'Please wait...',
  message = '',
  isOpen = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="fullscreen-loader-overlay" role="dialog" aria-modal="true">
      <div className="fullscreen-loader-card">
        <div className="loader-brand-icon">
          <span>A</span>
          <Loader2 size={36} className="animate-spin spin-ring" />
        </div>
        <h4 className="loader-title">{title}</h4>
        {message && <p className="loader-message">{message}</p>}
      </div>

      <style jsx>{`
        .fullscreen-loader-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 99999;
          animation: overlayFade 0.18s ease forwards;
        }

        @keyframes overlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .fullscreen-loader-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.2);
          animation: cardPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: 380px;
          width: 100%;
        }

        @keyframes cardPop {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .loader-brand-icon {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
          color: #ea580c;
          font-weight: 800;
          font-size: 18px;
        }

        :global(.spin-ring) {
          position: absolute;
          inset: -2px;
          color: #ff6b16;
          width: 56px;
          height: 56px;
        }

        .loader-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .loader-message {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

/**
 * SkeletonLoader alias export
 */
export const SkeletonLoader = Skeleton;

export default GlobalLoader;
