'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '@/utils/scoring';

export default function useAssessmentTimer({
  initialSeconds = 900,
  onTick = null,
  onTimeout = null,
  autoStart = true,
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const isRecoveredRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    if (!isRecoveredRef.current) {
      setTimeLeft(initialSeconds);
    }
  }, [initialSeconds]);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onTickRef.current = onTick;
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeoutRef.current) {
            onTimeoutRef.current();
          }
          return 0;
        }
        const updated = prev - 1;
        if (onTickRef.current) {
          onTickRef.current(updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const pauseTimer = useCallback(() => setIsActive(false), []);
  const startTimer = useCallback(() => setIsActive(true), []);
  const resetTimer = useCallback(
    (seconds) => {
      setTimeLeft(seconds || initialSeconds);
      setIsActive(true);
    },
    [initialSeconds]
  );

  const handleSetTimeLeft = useCallback((seconds) => {
    isRecoveredRef.current = true;
    setTimeLeft(seconds);
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    pauseTimer,
    startTimer,
    resetTimer,
    setTimeLeft: handleSetTimeLeft,
  };
}

export { useAssessmentTimer };
