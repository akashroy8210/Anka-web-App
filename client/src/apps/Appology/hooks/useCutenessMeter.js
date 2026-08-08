import { useState, useRef } from 'react';

export function useCutenessMeter() {
  const [percent, setPercent] = useState(0);
  const [isOverload, setIsOverload] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const intervalRef = useRef(null);

  const startAutomaticMeter = () => {
    if (isMeasuring || isBroken) return;
    setIsMeasuring(true);

    intervalRef.current = setInterval(() => {
      setPercent(prev => {
        const next = prev + 20;
        if (next >= 300) {
          clearInterval(intervalRef.current);
          setIsOverload(true);

          // Immediate Glass Break & Screen Tremor (0ms delay) -> Fast crisp popup (700ms)
          setIsBroken(true);
          setTimeout(() => {
            setShowPopup(true);
          }, 700);

          return 300;
        }

        if (next >= 100) {
          setIsOverload(true);
        }
        return next;
      });
    }, 80);
  };

  const getStatusText = () => {
    if (percent < 100) return "Measuring cuteness level...";
    if (percent === 100) return "100% — Extremely Cute ❤️";
    if (percent <= 150) return "150% — Above Normal Limits!";
    if (percent <= 225) return "225% — Cuteness Overload Detected!";
    if (percent < 300) return "275% — SYSTEM LIMIT EXCEEDED!";
    return "300%+ — CRITICAL SYSTEM FAILURE! METER BROKEN!";
  };

  return {
    percent,
    isOverload,
    isBroken,
    showPopup,
    isMeasuring,
    startAutomaticMeter,
    statusText: getStatusText()
  };
}
