import React from 'react';
import { ChevronRight } from 'lucide-react';
import PremiumButton from './PremiumButton';

export default function JourneyNavigation({
  onNext,
  nextText = 'Continue Journey',
  className = '',
  disabled = false
}) {
  return (
    <div className={`pt-4 w-full flex justify-center z-10 ${className}`}>
      <PremiumButton
        variant="ghost"
        onClick={onNext}
        disabled={disabled}
        className="group !px-7 !py-2.5 hover:!bg-white/10"
      >
        <span>{nextText}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </PremiumButton>
    </div>
  );
}
