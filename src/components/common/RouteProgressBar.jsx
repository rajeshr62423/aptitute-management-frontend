'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // When pathname changes, trigger a quick progress pulse
    setVisible(true);
    setAnimating(true);

    const timer = setTimeout(() => {
      setAnimating(false);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 150);
      return () => clearTimeout(hideTimer);
    }, 220);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="route-progress-track" aria-hidden="true">
      <div className={`route-progress-indicator ${animating ? 'active' : 'complete'}`} />

      <style jsx>{`
        .route-progress-track {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          z-index: 99999;
          pointer-events: none;
          overflow: hidden;
        }

        .route-progress-indicator {
          height: 100%;
          background: linear-gradient(90deg, #ff6b16, #ea580c, #f97316);
          box-shadow: 0 0 8px rgba(255, 107, 22, 0.6);
          transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease;
          width: 0%;
        }

        .route-progress-indicator.active {
          width: 85%;
        }

        .route-progress-indicator.complete {
          width: 100%;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
