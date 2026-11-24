'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this tab session
    const hasSeenSplash = sessionStorage.getItem('aptitudepro_splash_seen');
    if (hasSeenSplash) {
      return;
    }

    // Show splash screen on first bootstrap
    setIsVisible(true);

    // Initial entrance and state hydration window
    const hideTimer = setTimeout(() => {
      setIsFadingOut(true);
      sessionStorage.setItem('aptitudepro_splash_seen', 'true');

      // Unmount after fade-out transition completes
      const unmountTimer = setTimeout(() => {
        setIsVisible(false);
      }, 280);

      return () => clearTimeout(unmountTimer);
    }, 600);

    return () => clearTimeout(hideTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`splash-screen-overlay ${isFadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="AptitudePro initializing"
    >
      <div className="splash-content">
        {/* Animated Brand Mark */}
        <div className="splash-logo-wrap">
          <img src="/app-logo.png" alt="AptitudePro Logo" className="splash-logo" />
          <div className="splash-glow" />
        </div>

        {/* Brand Name */}
        <h1 className="splash-brand-title">
          Aptitude<span className="text-orange">Pro</span>
        </h1>

        {/* Tagline */}
        <p className="splash-tagline">Your Journey to Excellence Starts Here.</p>

        {/* Animated Progress Indicator */}
        <div className="splash-progress-track">
          <div className="splash-progress-bar" />
        </div>
      </div>

      <style jsx>{`
        .splash-screen-overlay {
          position: fixed;
          inset: 0;
          background: #ffffff;
          background-image: radial-gradient(circle at 50% 40%, rgba(255, 107, 22, 0.06) 0%, rgba(248, 250, 252, 1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 1;
          visibility: visible;
        }

        .splash-screen-overlay.fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          animation: contentEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes contentEntrance {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .splash-logo-wrap {
          position: relative;
          width: 68px;
          height: 68px;
          margin-bottom: 20px;
        }

        .splash-logo {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.35);
          position: relative;
          z-index: 2;
          animation: logoPulse 1.8s ease-in-out infinite alternate;
        }

        @keyframes logoPulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.04);
          }
        }

        .splash-glow {
          position: absolute;
          inset: -8px;
          border-radius: 28px;
          background: radial-gradient(circle, rgba(255, 107, 22, 0.25) 0%, rgba(255, 107, 22, 0) 70%);
          z-index: 1;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .splash-brand-title {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.8px;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .text-orange {
          color: #ff6b16;
        }

        .splash-tagline {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.2px;
          margin: 0 0 28px 0;
        }

        .splash-progress-track {
          width: 170px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }

        .splash-progress-bar {
          position: absolute;
          height: 100%;
          width: 45%;
          background: linear-gradient(90deg, #ff6b16, #ea580c);
          border-radius: 9999px;
          animation: progressSlide 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes progressSlide {
          0% {
            left: -45%;
          }
          100% {
            left: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-logo,
          .splash-glow,
          .splash-progress-bar,
          .splash-content {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
