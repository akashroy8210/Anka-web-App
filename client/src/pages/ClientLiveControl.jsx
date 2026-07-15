import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, AlertCircle, Sparkles, Send, Lock } from 'lucide-react';
import { io } from 'socket.io-client';
import LivingBackground from '../components/animations/LivingBackground';
import { OccasionRegistry, getOccasionKey } from '../registry/occasionRegistry';

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
  const [categorySlug, setCategorySlug] = useState('');
  const isVirtualDate = categorySlug.includes('virtual-date') || 
                        categorySlug.includes('valentine');
  const [loadingDetails, setLoadingDetails] = useState(true);
  
  // Recipient Response states
  const [recipientMsg, setRecipientMsg] = useState('');
  const [feedbackLiked, setFeedbackLiked] = useState(null);
  
  const socketRef = useRef(null);

  // Check if already authenticated for this instance
  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const savedInstanceId = localStorage.getItem('instanceId');
    if (token && savedInstanceId === instanceId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
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
          setTier(data.instance.tier || 'Basic');
          setRecipientMsg(data.instance.recipientResponse || '');
          setFeedbackLiked(data.instance.feedbackLiked);
          setCategorySlug(data.instance.categorySlug || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [instanceId, isAuthenticated]);

  // Connect socket when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const socketUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
      ? 'http://127.0.0.1:5000'
      : window.location.origin;

    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Client connected to socket for live control:', instanceId);
      socket.emit('join-room', instanceId);
    });

    socket.on('recipient-message', (data) => {
      console.log('Recipient message received via socket:', data);
      setRecipientMsg(data.recipientResponse || '');
      setFeedbackLiked(data.feedbackLiked);
    });

    socket.on('status_update', (data) => {
      console.log('Status update received:', data);
      setActiveUsersCount(data.activeUsersCount || 0);
      setLastEventText(data.lastEvent || 'None yet');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, instanceId]);

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setAuthError('');
    try {
      const data = await api.customerLogin(instanceId, passcode);
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('instanceId', data.instance.instanceId);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Invalid passcode.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection error verifying passcode.');
    } finally {
      setVerifying(false);
    }
  };

  const sendLiveAction = (action, data = {}) => {
    if (socketRef.current) {
      socketRef.current.emit('admin-action', {
        instanceId,
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
              Enter passcode to connect to the real-time command center for:<br />
              <span className="font-mono text-rose-350 font-bold bg-white/5 px-2.5 py-1 rounded-lg mt-2 inline-block border border-white/5">{instanceId}</span>
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-center text-white placeholder-rose-200/20 transition-all hover:bg-white/10"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-500/5 py-2.5 px-4 rounded-xl border border-rose-500/10">
                <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-650 hover:from-rose-550 hover:to-pink-550 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Connecting...' : '🔑 Connect Controller'}
            </button>
          </form>

          <div className="pt-2">
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#08050f] text-rose-100 space-y-4">
        <LivingBackground />
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
        <p className="text-rose-300 font-light text-xs animate-pulse">Verifying package access...</p>
      </div>
    );
  }

  // If authenticated but tier is not premium, block access
  if (tier.toLowerCase() !== 'premium') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
        <LivingBackground />
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl animate-pulse" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner shadow-rose-500/10">
            <Lock className="w-8 h-8 text-rose-450 fill-rose-550/20 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-romantic text-4xl text-white">Premium Only</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed font-sans font-light">
              Real-time Live Controls (triggering remote Confetti, Fireworks, and custom overlay alerts) are only available on the **Premium Plan**.
            </p>
            <p className="text-[11px] text-rose-350/40 font-mono">
              Current package plan: <span className="font-bold text-rose-300">{tier || 'Basic'}</span>
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={`/customizer/${instanceId}`}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-650 hover:from-rose-550 hover:to-pink-550 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Back to Settings Editor
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
    <div className="min-h-screen bg-[#090514] text-rose-100 pt-28 pb-16 relative overflow-hidden flex flex-col items-center px-4 md:px-8">
      <LivingBackground />

      {/* Background glowing bubbles */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-rose-950/15 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-purple-950/15 filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl space-y-8 relative z-10 font-sans">
        
        {/* Top Header Card */}
        <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[32px] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center animate-pulse shrink-0 mx-auto shadow-inner shadow-rose-500/10">
              <Heart className="w-6 h-6 text-rose-450 fill-rose-500/20" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-full inline-block mb-1.5">
                Client Live Control Room ⚡
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white font-heading">Real-Time Surprise Command Center</h2>
              <p className="text-xs text-rose-200/50 font-mono mt-0.5">Instance ID: {instanceId}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/customizer/${instanceId}`}
              className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-rose-455 hover:bg-white/10 text-xs font-bold uppercase rounded-full text-rose-200 hover:text-white transition-all cursor-pointer shadow-md"
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
            <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-2xl">
              <h3 className="font-heading font-black text-xs text-rose-400 uppercase tracking-widest border-b border-white/15 pb-2">
                Connection Monitor
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[9px] text-rose-200/40 uppercase tracking-wider mb-1">Server Status</span>
                  <span className={`text-[10px] font-black flex items-center gap-1 ${connectionStatus === 'connected' ? "text-emerald-450" : "text-rose-400 animate-pulse"}`}>
                    <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                    {connectionStatus === 'connected' ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[9px] text-rose-200/40 uppercase tracking-wider mb-1">Active Users</span>
                  <span className="text-base font-bold text-amber-450 flex items-center gap-1 justify-center animate-pulse">
                    {activeUsersCount}
                  </span>
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 shadow-inner">
                <span className="text-[9px] text-rose-200/40 uppercase tracking-wider block mb-1">Last Live Trigger</span>
                <p className="text-xs font-bold text-rose-300 italic">
                  "{lastEventText || 'None yet'}"
                </p>
              </div>
            </div>

            {/* Message Announcer */}
            <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-2xl">
              <h3 className="font-heading font-black text-xs text-rose-400 uppercase tracking-widest border-b border-white/15 pb-2">
                Live Message Board
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                Send a sweet floating notification card that will instantly appear on their screen.
              </p>
              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={livePopupMessage}
                  onChange={(e) => setLivePopupMessage(e.target.value)}
                  placeholder="Type a sweet message..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-rose-200/20 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none transition-all hover:bg-white/10"
                />
                <button
                  onClick={() => {
                    if (!livePopupMessage.trim()) return;
                    sendLiveAction('send_message', { text: livePopupMessage.trim() });
                    setLivePopupMessage('');
                  }}
                  disabled={!livePopupMessage.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-650 hover:from-rose-550 hover:to-pink-550 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 cursor-pointer"
                >
                  Send Surprise Message 💌
                </button>
              </div>
            </div>

            {/* Recipient Response Board */}
            <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/15 pb-2">
                <h3 className="font-heading font-black text-xs text-rose-400 uppercase tracking-widest">
                  💌 Recipient Response
                </h3>
                {recipientMsg && (
                  <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full animate-bounce">
                    {feedbackLiked ? 'Loved it! ❤️' : 'Completed 😅'}
                  </span>
                )}
              </div>
              
              {recipientMsg ? (
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2 text-left relative overflow-hidden shadow-inner">
                  <p className="text-xs text-rose-100 font-medium leading-relaxed italic">
                    "{recipientMsg}"
                  </p>
                </div>
              ) : (
                <p className="text-center py-4 text-xs text-rose-200/30 italic font-light">
                  Waiting for response...
                </p>
              )}
            </div>

          </div>

          {/* Column 2: Send Live Triggers */}
          <div className="space-y-6 md:col-span-2">
            <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[32px] space-y-5 shadow-2xl">
              <h3 className="font-heading font-black text-xs text-rose-400 uppercase tracking-widest border-b border-white/15 pb-2">
                Interactive Surprise Remotes (Instant overlays)
              </h3>
              
              {renderControlPanel()}
            </div>

            {/* Action History Logs */}
            {actionHistory.length > 0 && (
              <div className="bg-[#18122c]/65 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-3 shadow-2xl animate-fade-in">
                <h4 className="text-[10px] font-bold text-rose-350 uppercase tracking-widest">Trigger Logs</h4>
                <div className="space-y-2">
                  {actionHistory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/5 last:border-b-0 text-rose-200/50">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        🚀 SENT {item.action}
                      </span>
                      <span className="text-[10px] text-rose-200/30">{item.time}</span>
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
