import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, AlertCircle, Sparkles, Send, Lock } from 'lucide-react';
import { io } from 'socket.io-client';
import LivingBackground from '../components/animations/LivingBackground';
import VirtualDateAdmin from '../apps/virtual-date/pages/Admin';
import { SocketProvider } from '../apps/virtual-date/contexts/SocketContext';

export default function ClientLiveControl() {
  const { instanceId } = useParams();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const [livePopupMessage, setLivePopupMessage] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected
  const [tier, setTier] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
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
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
        <LivingBackground />
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-romantic text-4xl text-white">Live Controller</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed">
              Enter the passcode to launch the real-time controller panel for:<br />
              <span className="font-mono text-rose-300 font-bold bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">{instanceId}</span>
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 text-center text-white placeholder-rose-200/20"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-500/5 py-2.5 px-4 rounded-xl border border-rose-500/10">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Connecting...' : '🔑 Connect Controller'}
            </button>
          </form>

          <div className="pt-2">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-rose-300/60 hover:text-rose-300 transition-colors"
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
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl" />

        <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-rose-450 fill-rose-550/20 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-romantic text-4xl text-white">Premium Only</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed">
              Real-time Live Controls (triggering remote Confetti, Fireworks, and custom overlay alerts) are only available on the **Premium Plan**.
            </p>
            <p className="text-[11px] text-rose-350/40">
              Current package plan: <span className="font-bold text-rose-300">{tier || 'Basic'}</span>
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={`/customizer/${instanceId}`}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Back to Settings Editor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && categorySlug === 'virtual-date') {
    return (
      <SocketProvider isAdmin={true} customInstanceId={instanceId}>
        <VirtualDateAdmin bypassAuth={true} />
      </SocketProvider>
    );
  }

  return (
    <div className="min-h-screen bg-[#08050f] text-rose-100 pt-28 pb-16 relative overflow-hidden flex flex-col items-center px-4">
      <LivingBackground />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        
        {/* Status card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] text-center space-y-3 relative">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-5 h-5 text-rose-400 animate-spin-slow" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-full inline-block">
                Client Live Controller ⚡
              </span>
              {connectionStatus === 'connected' ? (
                <span className="text-[9px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full inline-block">
                  🟢 Live
                </span>
              ) : connectionStatus === 'connecting' ? (
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full inline-block animate-pulse">
                  🟡 Connecting...
                </span>
              ) : (
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full inline-block">
                  🔴 Offline
                </span>
              )}
            </div>
            <h2 className="font-romantic text-3xl text-white">Real-Time Control Room</h2>
            <p className="text-xs text-rose-200/40 font-mono">Instance ID: {instanceId}</p>
          </div>
        </div>

        {/* Buttons grid */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-5">
          <h3 className="font-heading font-black text-xs text-rose-300 uppercase tracking-wider border-b border-white/5 pb-2">
            Send Live Triggers
          </h3>
          
          {categorySlug === 'virtual-date' ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => sendLiveAction('confetti')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">💝</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Trigger Heart Rain</span>
              </button>

              <button
                onClick={() => sendLiveAction('fireworks')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">✨</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Trigger Magical Finale</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => sendLiveAction('confetti')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">🎉</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Trigger Confetti</span>
              </button>

              <button
                onClick={() => sendLiveAction('fireworks')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">🎆</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Trigger Fireworks</span>
              </button>

              <button
                onClick={() => sendLiveAction('reveal')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">🔓</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Force Unlock</span>
              </button>

              <button
                onClick={() => sendLiveAction('start-celebration')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span className="text-3xl">🎂</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Extinguish Candles</span>
              </button>

              <button
                onClick={() => sendLiveAction('cake-reveal')}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer col-span-2"
              >
                <span className="text-3xl">🔪</span>
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Cake Slicing Animation</span>
              </button>
            </div>
          )}
        </div>

        {/* Recipient Response Section */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-heading font-black text-xs text-rose-300 uppercase tracking-wider">
              💌 Recipient Response
            </h3>
            {recipientMsg && (
              <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                {feedbackLiked ? 'Loved it! ❤️' : 'Completed 😅'}
              </span>
            )}
          </div>
          
          {recipientMsg ? (
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-left relative overflow-hidden animate-fade-in-up">
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs text-rose-100 font-medium leading-relaxed italic">
                "{recipientMsg}"
              </p>
            </div>
          ) : (
            <p className="text-center py-4 text-xs text-rose-200/45 italic font-light">
              No response received yet. When they write a thank-you note on the surprise page, it will appear here in real-time!
            </p>
          )}
        </div>

        {/* Message announcer */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-4">
          <label className="text-[10px] font-bold text-rose-350 uppercase tracking-wider block">
            Send Live Message:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={livePopupMessage}
              onChange={(e) => setLivePopupMessage(e.target.value)}
              placeholder="e.g. Look at the screen right now! ❤️"
              className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 text-white placeholder-rose-200/20 bg-transparent"
            />
            <button
              onClick={() => {
                if (!livePopupMessage.trim()) return;
                sendLiveAction('popup', { message: livePopupMessage });
                setLivePopupMessage('');
              }}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Action log history */}
        {actionHistory.length > 0 && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[32px] space-y-3">
            <h4 className="text-[10px] font-bold text-rose-350 uppercase tracking-wider">Trigger Logs</h4>
            <div className="space-y-2">
              {actionHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/5 last:border-b-0 text-rose-200/60">
                  <span>🚀 SENT {item.action}</span>
                  <span className="text-[10px] text-rose-200/30">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
