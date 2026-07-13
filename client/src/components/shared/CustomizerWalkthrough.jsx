import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X, RefreshCw } from 'lucide-react';

export default function CustomizerWalkthrough({ steps, instanceId }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const storageKey = `walkthrough_completed_${instanceId}`;

  useEffect(() => {
    // Check if walkthrough was already completed for this client instance
    const completed = localStorage.getItem(storageKey);
    if (!completed && steps && steps.length > 0) {
      // Auto-start walkthrough with a 1.2s delay for page load
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStep(0);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [instanceId, steps, storageKey]);

  // Handle highlighting the active DOM element
  useEffect(() => {
    if (!isActive || !steps || steps.length === 0) return;

    const step = steps[currentStep];
    if (!step || !step.target) return;

    const element = document.querySelector(step.target);
    if (element) {
      // Scroll to target element
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add glowing outline classes
      element.classList.add('ring-4', 'ring-rosePrimary', 'ring-offset-4', 'transition-all', 'duration-300');

      return () => {
        // Clean up classes on change or close
        element.classList.remove('ring-4', 'ring-rosePrimary', 'ring-offset-4');
      };
    }
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
  };

  const handleRestart = () => {
    localStorage.removeItem(storageKey);
    setIsActive(true);
    setCurrentStep(0);
  };

  // Expose restart action globally using custom events so that Settings panel can trigger it
  useEffect(() => {
    const handleRestartEvent = () => {
      handleRestart();
    };

    window.addEventListener(`restart-walkthrough-${instanceId}`, handleRestartEvent);
    return () => {
      window.removeEventListener(`restart-walkthrough-${instanceId}`, handleRestartEvent);
    };
  }, [instanceId]);

  if (!isActive || !steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4 animate-fade-in-up">
      {/* Walkthrough glassmorphic notification tooltip card */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-rosePrimary/30 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4.5 h-4.5 text-rosePrimary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-rosePrimary">Quick Tutorial Tour</span>
          </div>
          <button 
            onClick={handleSkip}
            className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Skip Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-baseline">
            <h4 className="font-heading font-black text-base text-white">
              {currentStepData.title}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
          <button
            onClick={handleSkip}
            className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider cursor-pointer"
          >
            Skip Tour
          </button>
          
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4.5 py-1.5 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-lg transition-all flex items-center space-x-1 cursor-pointer shadow-md"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStep < steps.length - 1 && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
