import { useState, useEffect } from 'react';
import { calculateTimeLeft } from '../utils/dateUtils';

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) return;

    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      setTimeLeft(remaining);
      if (remaining.expired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
