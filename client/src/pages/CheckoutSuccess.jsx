import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Gift, ArrowRight, Eye, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const instanceId = searchParams.get('id') || '';
  const demoId = searchParams.get('demoId') || '';

  // Generate 35 pieces of color confetti
  const confettiColors = ['#E11D48', '#FDA4AF', '#881337', '#D4AF37', '#3B82F6', '#10B981', '#F59E0B'];
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const list = Array.from({ length: 35 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 4 + 4}s`,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: `${Math.random() * 10 + 6}px`,
      shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'
    }));
    setConfetti(list);
  }, []);

  const handleEnterCustomizer = () => {
    if (instanceId) {
      navigate(`/customizer/${instanceId}?demoId=${demoId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] via-[#FFF5F2] to-white pt-28 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background ambient elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blushAccent/20 filter blur-3xl -z-10 animate-float-slow"></div>
      
      {/* Falling Confetti Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {confetti.map((c, i) => (
          <span
            key={i}
            className={`falling-petal absolute ${c.shape}`}
            style={{
              left: c.left,
              animationDelay: c.delay,
              animationDuration: c.duration,
              backgroundColor: c.color,
              width: c.size,
              height: c.size,
            }}
          />
        ))}
      </div>

      <div className="glass-card-rose max-w-lg w-full rounded-3xl p-8 shadow-xl text-center flex flex-col items-center border border-rosePrimary/20 bg-white/90 backdrop-blur-md z-10 animate-fade-in-up">
        
        <div className="p-4 bg-rosePrimary/10 text-rosePrimary rounded-full mb-6 animate-bounce">
          <Gift className="w-12 h-12 text-rosePrimary fill-rosePrimary/10" />
        </div>
        
        <h2 className="font-heading font-extrabold text-3xl text-wineDeep">
          Surprise Created! 🎉
        </h2>
        
        <p className="mt-3 text-sm text-slate-600 font-light leading-relaxed">
          Your payment was successful! Your surprise website has been created and linked to your customer account.
        </p>

        {searchParams.get('noCredentials') === 'true' ? (
          <>
            <div className="my-6 p-6 bg-wineDeep/5 border border-rosePrimary/15 rounded-3xl w-full text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-rosePrimary/10 text-rosePrimary rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Heart className="w-6 h-6 fill-rosePrimary/10" />
              </div>
              <h4 className="font-heading font-extrabold text-lg text-wineDeep">We Will Design Your Invitation!</h4>
              <p className="text-xs text-slate-600 font-light leading-relaxed max-w-sm mx-auto">
                Our expert design team will contact you directly via Phone / WhatsApp within 24 hours to collect your details and customize everything perfectly.
              </p>
            </div>

            <div className="w-full pt-2">
              <Link
                to="/dashboard"
                className="py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 w-full text-center hover:scale-[1.01]"
              >
                <span>Go to My Dashboard</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="my-6 p-5 bg-emerald-50/70 border border-emerald-500/20 rounded-2xl w-full text-left shadow-sm space-y-2 animate-fade-in-up">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Linked to Your Account</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                You can manage, edit photos, and customize this surprise anytime from your customer account dashboard.
              </p>
            </div>

            <div className="flex flex-col space-y-3 w-full animate-fade-in-up">
              <button
                onClick={handleEnterCustomizer}
                className="py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 w-full cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize Surprise Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {instanceId && (
                <Link
                  to={`/s/${instanceId}`}
                  target="_blank"
                  className="py-3.5 bg-white border border-rosePrimary/20 hover:bg-slate-50 text-rosePrimary text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span>Live Surprise Preview</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
