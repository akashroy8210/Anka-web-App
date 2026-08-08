import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, AlertCircle, Sparkles, Send, Lock } from 'lucide-react';
import { io } from 'socket.io-client';
import LivingBackground from '../components/animations/LivingBackground';
import PageSkeleton from '../components/common/PageSkeleton';
import { OccasionRegistry, getOccasionKey } from '../registry/occasionRegistry';
import { getTierPermissions } from '../utils/tierPermissions';

export default function ClientLiveControl() {
  const { instanceId } = useParams();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [livePopupMessage, setLivePopupMessage] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [lastEventText, setLastEventText] = useState('None yet');
  const [customMessage, setCustomMessage] = useState('');
  const [tier, setTier] = useState('');
  const [categoryTiers, setCategoryTiers] = useState([]);
  const [categorySlug, setCategorySlug] = useState('');
  const isVirtualDate = categorySlug.includes('virtual-date') ||
    categorySlug.includes('valentine');
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Recipient Response states
  const [recipientMsg, setRecipientMsg] = useState('');
  const [feedbackLiked, setFeedbackLiked] = useState(null);

  const socketRef = useRef(null);

  // Check if authenticated via customer account token
  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const email = localStorage.getItem('customerEmail');
    const isDemo = (instanceId || '').toLowerCase().includes('demo');
    if (token || email || isDemo) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
  }, [instanceId]);

  // Fetch instance details to check tier limit when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const token = localStorage.getItem('customerToken');
        const data = await api.getInstanceDetails(instanceId, token);
        if (data.success) {
          const rawTier = data.instance.tier;
          const isExplicitDemoParam = (instanceId || '').toLowerCase().startsWith('demo-');
          setTier(rawTier ? rawTier : (isExplicitDemoParam ? 'Premium' : 'Basic'));
          setRecipientMsg(data.instance.recipientResponse || '');
          setFeedbackLiked(data.instance.feedbackLiked);
          const catTiers = data.instance.categoryTiers || data.instance.demo?.tiers || data.instance.category?.tiers || [];
          setCategoryTiers(catTiers);
          const resolvedThemeSlug = data.instance.demo?.themeSlug || data.instance.category?.slug || 'birthday';
          setCategorySlug(resolvedThemeSlug);  
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [instanceId, isAuthenticated]);

  // Connect socket when instanceId is present
  useEffect(() => {
    if (!instanceId) return;

    const envUrl = import.meta.env.VITE_API_URL;
    let socketUrl = window.location.origin;
    if (envUrl && envUrl.startsWith('http')) {
      socketUrl = envUrl.replace(/\/api\/?$/, '');
    } else if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
      socketUrl = 'http://127.0.0.1:5000';
    }

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Client Live Controller connected to socket for room:', instanceId);
      socket.emit('join-room', instanceId);
    });

    socket.on('recipient-message', (data) => {
      console.log('Recipient message received via socket:', data);
      setRecipientMsg(data.recipientResponse || data.choice || data.message || '');
      if (data.feedbackLiked !== undefined) setFeedbackLiked(data.feedbackLiked);
    });

    socket.on('status_update', (data) => {
      console.log('Status update received:', data);
      if (data.activeUsersCount !== undefined) setActiveUsersCount(data.activeUsersCount);
      if (data.lastEvent) setLastEventText(data.lastEvent);
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connect error:', err);
      setConnectionStatus('disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [instanceId]);

  const sendLiveAction = (action, data = {}) => {
    if (socketRef.current) {
      socketRef.current.emit('admin-action', {
        instanceId,
        action,
        data
      });
      socketRef.current.emit('live-trigger', {
        instanceId,
        type: action,
        payload: data,
        action,
        data
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setActionHistory(prev => [{ action: action.toUpperCase(), time }, ...prev].slice(0, 5));
      setLastEventText(action.toUpperCase().replace('_', ' '));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
        <LivingBackground />

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl animate-pulse" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner shadow-rose-500/10">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading font-extrabold text-3xl text-white">Live Controller</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed font-sans font-light">
              Please sign in to your customer account to access the real-time command center for:<br />
              <span className="font-mono text-rose-350 font-bold bg-white/5 px-2.5 py-1 rounded-lg mt-2 inline-block border border-white/5">{instanceId}</span>
            </p>
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <Link
              to="/dashboard"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-950/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In To Account</span>
            </Link>
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-rose-300/40 hover:text-rose-300/80 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, if loading details, show loader
  if (loadingDetails) {
    return <PageSkeleton type="customizer" />;
  }

  // If tier is Basic, block access to Live Control panel
  const permissions = getTierPermissions(tier, categoryTiers);
  if (permissions.isBasic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
        <LivingBackground />

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl animate-pulse" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner shadow-amber-500/10">
            <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading font-extrabold text-2xl text-white">Upgrade Required 🔒</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed font-sans font-light">
              Live Control Room is a premium feature. Please upgrade your plan to unlock real-time control room actions for:<br />
              <span className="font-mono text-rose-350 font-bold bg-white/5 px-2.5 py-1 rounded-lg mt-2 inline-block border border-white/5">{instanceId}</span>
            </p>
          </div>

          <div className="p-4 bg-rose-500/5 border border-rosePrimary/10 rounded-2xl text-left space-y-2">
            <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">
              Why Upgrade to Premium?
            </span>
            <ul className="text-[10px] text-slate-350 leading-relaxed space-y-1 font-light list-disc pl-4">
              <li>Open real-time interactive Cupid control room</li>
              <li>Trigger live fireworks & falling heart rain on screen</li>
              <li>Track recipient active visitors and actions live</li>
              <li>Lock memories timeline with security question</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              to={`/customizer/${instanceId}`}
              className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <span>Back to Customizer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  const renderControlPanel = () => {
    const occasionKey = getOccasionKey(categorySlug);
    const occasion = OccasionRegistry[occasionKey];
    if (occasion?.control) {
      const ControlComp = occasion.control;
      return (
        <React.Suspense fallback={<div className="text-xs text-slate-400 py-6 text-center italic">Loading live control panel...</div>}>
          <ControlComp sendLiveAction={sendLiveAction} />
        </React.Suspense>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => sendLiveAction('confetti')}
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer group hover:border-rose-500/30"
        >
          <span className="text-3xl transition-transform group-hover:scale-110">🎉</span>
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Trigger Confetti</span>
        </button>
        <button
          onClick={() => sendLiveAction('fireworks')}
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer group hover:border-rose-500/30"
        >
          <span className="text-3xl transition-transform group-hover:scale-110">🎆</span>
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Trigger Fireworks</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/80 to-pink-100 text-slate-900 pt-28 pb-16 relative overflow-hidden flex flex-col items-center px-4 md:px-8 select-none">
      <LivingBackground />

      {/* Background glowing pastel bubbles */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-rose-200/40 filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-pink-200/40 filter blur-3xl pointer-events-none animate-pulse" />

      <div className="w-full max-w-5xl space-y-8 relative z-10 font-sans">

        {/* Top Header Card */}
        <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 md:p-8 rounded-[32px] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg shadow-rose-950/5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-13 h-13 bg-rose-100 border border-rose-300 rounded-2xl flex items-center justify-center animate-pulse shrink-0 mx-auto shadow-inner">
              <Heart className="w-7 h-7 text-[#6B1D2F] fill-[#6B1D2F]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#6B1D2F] uppercase tracking-widest bg-rose-100/80 border border-rose-300 px-3.5 py-1.5 rounded-full inline-block mb-1.5">
                Client Live Control Room ⚡
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#6B1D2F] font-heading">Real-Time Surprise Command Center</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Instance ID: {instanceId}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/customizer/${instanceId}`}
              className="px-5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-bold uppercase rounded-full text-[#6B1D2F] transition-all cursor-pointer shadow-xs"
            >
              Back to Settings Customizer
            </Link>
          </div>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Column 1: Monitor, Message Board, Response */}
          <div className="space-y-6 md:col-span-1">

            {/* Connection Monitor */}
            <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-lg shadow-rose-950/5">
              <h3 className="font-heading font-black text-xs text-[#6B1D2F] uppercase tracking-widest border-b border-rose-200/60 pb-2">
                Connection Monitor
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Server Status</span>
                  <span className={`text-[10px] font-black flex items-center gap-1 ${connectionStatus === 'connected' ? "text-emerald-600" : "text-rose-600 animate-pulse"}`}>
                    <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                    {connectionStatus === 'connected' ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>
                <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Active Users</span>
                  <span className="text-base font-bold text-[#6B1D2F] flex items-center gap-1 justify-center animate-pulse">
                    {activeUsersCount}
                  </span>
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3.5 shadow-xs">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Last Live Trigger</span>
                <p className="text-xs font-bold text-[#6B1D2F] italic">
                  "{lastEventText || 'None yet'}"
                </p>
              </div>
            </div>

            {/* Message Announcer */}
            <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-lg shadow-rose-950/5">
              <h3 className="font-heading font-black text-xs text-[#6B1D2F] uppercase tracking-widest border-b border-rose-200/60 pb-2">
                Live Message Board
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                Send a sweet floating notification card that will instantly appear on their screen.
              </p>
              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={livePopupMessage}
                  onChange={(e) => setLivePopupMessage(e.target.value)}
                  placeholder="Type a sweet message..."
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] resize-none transition-all"
                />
                <button
                  onClick={() => {
                    if (!livePopupMessage.trim()) return;
                    sendLiveAction('send_message', { text: livePopupMessage.trim(), message: livePopupMessage.trim() });
                    setLivePopupMessage('');
                  }}
                  disabled={!livePopupMessage.trim()}
                  className="w-full py-2.5 bg-[#6B1D2F] hover:bg-[#521523] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
                >
                  Send Surprise Message 💌
                </button>
              </div>
            </div>

            {/* Recipient Response Board */}
            <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-lg shadow-rose-950/5">
              <div className="flex justify-between items-center border-b border-rose-200/60 pb-2">
                <h3 className="font-heading font-black text-xs text-[#6B1D2F] uppercase tracking-widest">
                  💌 Recipient Response
                </h3>
                {recipientMsg && (
                  <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#6B1D2F] px-2.5 py-1 rounded-full animate-bounce">
                    {feedbackLiked ? 'Loved it! ❤️' : 'Completed 😅'}
                  </span>
                )}
              </div>

              {recipientMsg ? (
                <div className="p-4 bg-rose-50/60 border border-rose-200/60 rounded-2xl space-y-2 text-left relative overflow-hidden shadow-xs">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                    "{recipientMsg}"
                  </p>
                </div>
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 italic font-light">
                  Waiting for response...
                </p>
              )}
            </div>

          </div>

          {/* Column 2: Send Live Triggers */}
          <div className="space-y-6 md:col-span-2">
            <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 md:p-8 rounded-[32px] space-y-5 shadow-lg shadow-rose-950/5">
              <h3 className="font-heading font-black text-xs text-[#6B1D2F] uppercase tracking-widest border-b border-rose-200/60 pb-2">
                Interactive Surprise Remotes (Instant overlays)
              </h3>

              {renderControlPanel()}
            </div>

            {/* Action History Logs */}
            {actionHistory.length > 0 && (
              <div className="bg-white/90 border border-rose-200/80 backdrop-blur-xl p-6 rounded-[32px] space-y-3 shadow-lg shadow-rose-950/5 animate-fade-in">
                <h4 className="text-[10px] font-bold text-[#6B1D2F] uppercase tracking-widest">Trigger Logs</h4>
                <div className="space-y-2">
                  {actionHistory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-rose-100 last:border-b-0 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B1D2F] animate-ping" />
                        🚀 SENT {item.action}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
