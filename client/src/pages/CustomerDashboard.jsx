import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import PageSkeleton from '../components/common/PageSkeleton';
import { Heart, Sparkles, Eye, Settings, Radio, Plus, CheckCircle, LogOut } from 'lucide-react';

export function getOccasionThemeName(item) {
  if (!item) return 'Digital Surprise Experience';
  if (item.demo && item.demo.name) return item.demo.name;

  const slug = String(item.themeSlug || item.categorySlug || item.demo?.themeSlug || item.demo?.categorySlug || '').toLowerCase().trim();

  const themeMap = {
    'girlfriend-day-dark': "Girlfriend's Day — Dark Luxury",
    'girlfriend-day-pastel': "Girlfriend's Day — Baby Pink & Lavender",
    'girlfriend-day-pink': "Girlfriend's Day — Soft Pink",
    'girlfriends': "Girlfriend's Day Surprise",
    'girlfriend-day': "Girlfriend's Day Surprise",
    'birthday-dark': "Birthday Surprise — Midnight Luxury Gold",
    'birthday-pastel': "Birthday Surprise — Baby Pink & Soft Pastel",
    'birthday-pink': "Birthday Surprise — Hot Magenta & Velvet Pink",
    'birthday': "Birthday Surprise Experience",
    'virtual-date': "Virtual Date Experience",
    'proposal': "Interactive Proposal Experience"
  };

  if (themeMap[slug]) return themeMap[slug];

  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [customerEmail, setCustomerEmail] = useState('');
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  
  // Auth Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = googleClientId && !googleClientId.includes('demo') && !googleClientId.includes('placeholder');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const savedEmail = localStorage.getItem('customerEmail');
    const token = localStorage.getItem('customerToken');

    if (adminToken && !savedEmail && !token) {
      navigate('/admin');
      return;
    }

    if (savedEmail) {
      setCustomerEmail(savedEmail);
      fetchCustomerInstances(savedEmail, token);
      checkReturnRedirect();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const checkReturnRedirect = () => {
    const returnUrl = sessionStorage.getItem('returnUrl') || sessionStorage.getItem('pendingPurchaseUrl');
    if (returnUrl && returnUrl !== '/dashboard' && returnUrl !== '/login') {
      sessionStorage.removeItem('returnUrl');
      sessionStorage.removeItem('pendingPurchaseUrl');
      navigate(returnUrl);
    }
  };

  useEffect(() => {
    // Only initialize Google Identity Services if a valid production VITE_GOOGLE_CLIENT_ID is set
    if (window.google?.accounts?.id && !customerEmail && isGoogleConfigured) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          use_fedcm_for_prompt: true
        });

        const container = document.getElementById('googleSignInBtnContainer');
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill'
          });
        }

        // Trigger Google Native One Tap Prompt showing user profile avatar & name
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('Google One Tap notification reason:', notification.getNotDisplayedReason());
          }
        });
      } catch (err) {
        console.warn('Google One Tap init warning:', err);
      }
    }
  }, [customerEmail, authTab, googleClientId, isGoogleConfigured]);

  const handleGoogleCredentialResponse = async (response) => {
    if (response?.credential) {
      const decoded = parseGoogleJwt(response.credential);
      if (decoded && decoded.email) {
        try {
          const res = await api.customerGoogleAuth(decoded.email, decoded.name, response.credential);
          const activeToken = (res && res.success && res.token) ? res.token : response.credential;
          const userEmail = (res && res.user && res.user.email) ? res.user.email : decoded.email;
          localStorage.setItem('customerToken', activeToken);
          localStorage.setItem('customerEmail', userEmail);
          setCustomerEmail(userEmail);
          fetchCustomerInstances(userEmail, activeToken);
          checkReturnRedirect();
        } catch (err) {
          localStorage.setItem('customerToken', response.credential);
          localStorage.setItem('customerEmail', decoded.email);
          setCustomerEmail(decoded.email);
          fetchCustomerInstances(decoded.email, response.credential);
          checkReturnRedirect();
        }
      }
    }
  };

  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const fetchCustomerInstances = async (email, token) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getCustomerSurprises(email, token);
      if (data.success) {
        setInstances(data.instances || []);
      } else {
        setErrorMsg(data.message || 'No surprises found for this account.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load customer surprises.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerInstanceId');
    localStorage.removeItem('instanceId');
    setCustomerEmail('');
    setInstances([]);
    setAuthTab('login');
  };

  const handleAccountLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setErrorMsg('');
    try {
      const res = await api.customerAccountLogin(loginEmail.trim(), loginPassword);
      if (res.success && res.token) {
        localStorage.setItem('customerToken', res.token);
        localStorage.setItem('customerEmail', res.user.email);
        setCustomerEmail(res.user.email);
        fetchCustomerInstances(res.user.email, res.token);
        checkReturnRedirect();
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error logging in.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleAccountRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setErrorMsg('');
    try {
      const res = await api.customerAccountRegister(regName.trim(), regEmail.trim(), regPassword);
      if (res.success && res.token) {
        localStorage.setItem('customerToken', res.token);
        localStorage.setItem('customerEmail', res.user.email);
        setCustomerEmail(res.user.email);
        fetchCustomerInstances(res.user.email, res.token);
        checkReturnRedirect();
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Network error registering account.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F5] relative font-sans overflow-x-hidden pt-24 sm:pt-28 pb-20 selection:bg-rosePrimary selection:text-white">

      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-rosePrimary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blushAccent/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Account Auth Portal if not signed in */}
        {!customerEmail ? (
          <div className="max-w-md mx-auto p-8 rounded-[36px] bg-white/90 border border-rosePrimary/15 backdrop-blur-2xl shadow-glass-rose text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-rosePrimary/10 border border-rosePrimary/20 flex items-center justify-center mx-auto text-rosePrimary shadow-sm">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-2xl text-wineDeep">Customer Portal</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Sign in to view and manage all your purchased AnKa surprise experiences.
              </p>
            </div>

            {/* Official Google One Tap / Sign-In Button Container */}
            {isGoogleConfigured ? (
              <div id="googleSignInBtnContainer" className="w-full flex justify-center min-h-[44px]"></div>
            ) : (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left text-xs space-y-1 text-amber-800">
                <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                  <span>💡 Google Sign-In Configuration</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  To enable direct Google Login, add your Google OAuth Client ID to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">client/.env</code> as <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_GOOGLE_CLIENT_ID</code>.
                </p>
              </div>
            )}

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">OR</span>
            </div>

            {/* Auth Tab Selector */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl border border-rosePrimary/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`py-2 rounded-xl transition-all ${authTab === 'login' ? 'bg-white text-rosePrimary shadow-sm' : 'text-slate-500 hover:text-wineDeep'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`py-2 rounded-xl transition-all ${authTab === 'register' ? 'bg-white text-rosePrimary shadow-sm' : 'text-slate-500 hover:text-wineDeep'}`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rosePrimary/20 rounded-xl text-xs text-rosePrimary font-medium">
                {errorMsg}
              </div>
            )}

            {/* 1. Customer Account Login */}
            {authTab === 'login' && (
              <form onSubmit={handleAccountLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your-email@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rosePrimary/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingAuth ? 'Authenticating...' : 'Sign In To Account 🔑'}
                </button>
              </form>
            )}

            {/* 2. Customer Account Register */}
            {authTab === 'register' && (
              <form onSubmit={handleAccountRegisterSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Create Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rosePrimary/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingAuth ? 'Creating Account...' : 'Create Account ✨'}
                </button>
              </form>
            )}
          </div>
        ) : loading ? (
          <PageSkeleton type="customizer" />
        ) : (
          <div className="space-y-8 animate-fade-in">

            {/* Account Summary Banner */}
            <div className="p-8 rounded-[36px] bg-white/80 border border-rosePrimary/15 backdrop-blur-xl shadow-glass-rose flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-rosePrimary bg-rosePrimary/10 px-3.5 py-1 rounded-full border border-rosePrimary/20 inline-block">
                  Unified Customer Portal
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-wineDeep pt-1">
                  Welcome Back, <span className="text-rosePrimary">{customerEmail}</span>!
                </h2>
                <p className="text-xs text-slate-600 font-light">
                  You have <strong className="font-bold text-wineDeep">{instances.length}</strong> active digital surprise experience{instances.length === 1 ? '' : 's'} linked to your account.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rosePrimary/20 text-rosePrimary text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <Link
                  to="/surprises"
                  className="px-6 py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rosePrimary/25 transition-all flex items-center space-x-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Surprise</span>
                </Link>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rosePrimary/20 rounded-2xl text-xs text-rosePrimary text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Instances Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instances.map((item) => {
                const isPremium = (item.tier || '').toLowerCase() === 'premium';
                const themeTitle = getOccasionThemeName(item);

                return (
                  <div key={item.instanceId} className="group p-6 rounded-[32px] bg-white/90 hover:bg-white border border-rosePrimary/15 hover:border-rosePrimary/40 backdrop-blur-xl transition-all duration-300 shadow-glass-rose space-y-6 flex flex-col justify-between hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isPremium ? 'bg-amber-500/10 border-amber-500/30 text-amber-700' : 'bg-rosePrimary/10 border-rosePrimary/20 text-rosePrimary'}`}>
                          {item.tier || 'Basic'} Plan {isPremium && '👑'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{item.status || 'Active'}</span>
                        </span>
                      </div>

                      {/* Theme & Occasion Badge */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-wineDeep/5 border border-wineDeep/10 rounded-xl text-xs font-bold text-wineDeep">
                          <Sparkles className="w-3.5 h-3.5 text-rosePrimary" />
                          <span>{themeTitle}</span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-heading font-extrabold text-lg text-wineDeep group-hover:text-rosePrimary transition-colors">
                          {item.config?.recipientName ? `Surprise for ${item.config.recipientName}` : `Surprise #${item.instanceId}`}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">ID: {item.instanceId}</p>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-rosePrimary/10">
                      <Link
                        to={`/customizer/${item.instanceId}`}
                        className="py-3 px-2 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer shadow-sm"
                        title="Customize Content"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Customize</span>
                      </Link>

                      <Link
                        to={`/s/${item.instanceId}`}
                        target="_blank"
                        className="py-3 px-2 bg-slate-100 hover:bg-wineDeep text-slate-700 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer shadow-sm"
                        title="View Live Link"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Live</span>
                      </Link>

                      <Link
                        to={`/control/${item.instanceId}`}
                        className={`py-3 px-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer shadow-sm ${isPremium ? 'bg-amber-500/15 hover:bg-amber-500 text-amber-800 hover:text-white border border-amber-500/30' : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'}`}
                        title={isPremium ? 'Open Live Control Room' : 'Requires Premium Tier'}
                      >
                        <Radio className="w-4 h-4" />
                        <span>Live Control</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
