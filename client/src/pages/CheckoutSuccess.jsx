import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Gift, Key, ArrowRight, Eye, Check, AlertCircle, Copy, Heart } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const instanceId = searchParams.get('id') || '';
  const password = searchParams.get('pwd') || '';
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

  const handleCopyCredentials = () => {
    const text = `Surprise ID: ${instanceId}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnterCustomizer = async () => {
    if (!instanceId || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await api.loginCustomer(instanceId, password);
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('instanceId', data.instance.instanceId);
        // Pass demoId as search param so review rating can map it
        navigate(`/customizer/${data.instance.instanceId}?demoId=${demoId}`);
      } else {
        setErrorMsg(data.message || 'Auto-login failed. Please try logging in manually.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error logging in. Please try manually at /login.');
    } finally {
      setLoading(false);
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
          Surprise Banao Shuru!
        </h2>
        
        <p className="mt-3 text-sm text-slate-600 font-light leading-relaxed">
          Aapka payment safal raha! Humne aapke loved ones ke liye ek khaas Surprise details dashboard create kar diya hai.
        </p>

        {searchParams.get('noCredentials') === 'true' ? (
          <>
            <div className="my-6 p-6 bg-wineDeep/5 border border-rosePrimary/15 rounded-3xl w-full text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-rosePrimary/10 text-rosePrimary rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Heart className="w-6 h-6 fill-rosePrimary/10" />
              </div>
              <h4 className="font-heading font-extrabold text-lg text-wineDeep">Hum Aapka Invitation Design Karenge!</h4>
              <p className="text-xs text-slate-600 font-light leading-relaxed max-w-sm mx-auto">
                Since this is a specialized Wedding Invitation package, you do not need credentials to self-configure. Our expert design team will contact you directly via Phone / WhatsApp within 24 hours to collect your details and customize everything perfectly for your wedding.
              </p>
            </div>

            <div className="w-full pt-2">
              <Link
                to="/"
                className="py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 w-full text-center hover:scale-[1.01]"
              >
                <span>Go to Home Page</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-medium my-4 w-full text-left flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="my-6 p-5 bg-white/70 border border-rosePrimary/10 rounded-2xl w-full text-left shadow-sm">
              <div className="flex items-center justify-between text-rosePrimary font-semibold text-sm mb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Aapka Login details</span>
                </div>
                <button
                  onClick={handleCopyCredentials}
                  className="text-[10px] bg-rosePrimary/10 hover:bg-rosePrimary/20 text-rosePrimary px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              
              <p className="text-[11px] text-slate-500 mb-4 font-light">
                In credentials ka use karke aap jab chahein customize kar sakte hain:
              </p>
              
              <div className="space-y-2.5 text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border">
                <div><span className="text-slate-400">Surprise ID / Username:</span> <span className="font-bold text-slate-900">{instanceId}</span></div>
                <div><span className="text-slate-400">Password:</span> <span className="font-bold text-slate-900">{password}</span></div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <button
                onClick={handleEnterCustomizer}
                disabled={loading}
                className="py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 w-full disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Entering Panel...' : 'Surprise Customize Karein'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <Link
                to={`/s/${instanceId}`}
                target="_blank"
                className="py-3.5 bg-white border border-rosePrimary/20 hover:bg-slate-50 text-rosePrimary text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span>Live Surprise Preview</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
