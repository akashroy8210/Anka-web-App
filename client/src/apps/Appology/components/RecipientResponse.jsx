import React, { useState } from 'react';

export default function RecipientResponse({ config, onNext, onSendResponse }) {
  const [selectedQuickChoice, setSelectedQuickChoice] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quickChoices = [
    "I'm still upset",
    "I need some time",
    "I want to talk",
    "I'm ready to forgive you"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSendResponse) {
      onSendResponse({ quickChoice: selectedQuickChoice, text: responseText });
    }
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-2xl w-full z-10 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest block text-rose-300">
            Private Voice & Message
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight" style={{ color: 'var(--ap-text-primary)' }}>
            Tell Me How You Feel 💬
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            You don't have to pretend you're okay. Say whatever is on your heart:
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-xl mx-auto">
            {/* Quick choices */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {quickChoices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedQuickChoice(choice)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    selectedQuickChoice === choice
                      ? 'ap-btn-secondary shadow-lg scale-105'
                      : 'border-rose-400/30 bg-white/40 hover:bg-white/60 opacity-90'
                  }`}
                  style={{ color: 'var(--ap-text-primary)' }}
                >
                  {choice}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write what you really want to say..."
              className="w-full p-5 rounded-2xl ap-glass-card text-sm focus:outline-none shadow-xl leading-relaxed font-medium"
              style={{ color: 'var(--ap-text-primary)' }}
            />

            <div className="pt-2 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                Send Response ❤️
              </button>

              <button
                type="button"
                onClick={onNext}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold border border-pink/20 hover:border-pink/40 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-pink bg-white/10"
              >
                Skip For Now →
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 py-6 animate-paper-unfold">
            <p className="text-xl sm:text-2xl font-serif italic text-rose-200 leading-relaxed">
              "Thank you for sharing your heart with me. I have received your message." ❤️
            </p>
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex items-center gap-3 px-12 py-5 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                <span>Continue Journey →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
