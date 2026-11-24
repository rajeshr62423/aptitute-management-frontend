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
  const [prevInitialSeconds, setPrevInitialSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const onTimeoutRef = useRef(onTimeout);
  const onTickRef = useRef(onTick);

  if (initialSeconds !== prevInitialSeconds) {
    setPrevInitialSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
  }

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

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    pauseTimer,
    startTimer,
    resetTimer,
    setTimeLeft,
  };
}

export { useAssessmentTimer };
