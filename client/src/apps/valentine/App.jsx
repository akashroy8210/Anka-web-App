import './App.css'
import React, { useState, useEffect } from 'react';
import LandingPage from './component/Landing Page/LandingPage'
import GlobalEffects from './component/GlobalEffects'
import MusicPlayer from "./component/MusicPlayer";
import { io } from 'socket.io-client';
import canvasConfetti from 'canvas-confetti';

function App({ instance }) {
  const instanceId = instance?.instanceId;
  const [liveMessage, setLiveMessage] = useState('');
  const [roseShowerActive, setRoseShowerActive] = useState(false);
  const [forceDay, setForceDay] = useState(null);

  useEffect(() => {
    if (!instanceId) return;

    const socketUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
      ? 'http://127.0.0.1:5000'
      : window.location.origin;

    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Valentine surprise connected to socket:', instanceId);
      socket.emit('join-room', instanceId);
    });

    socket.on('live-trigger', ({ action, data }) => {
      console.log('Valentine live trigger received:', action, data);
      if (action === 'heart-rain' || action === 'confetti') {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          const particleCount = 50 * (timeLeft / duration);
          canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else if (action === 'rose-fall') {
        setRoseShowerActive(true);
        setTimeout(() => setRoseShowerActive(false), 9000);
      } else if (action === 'reveal-day' || action === 'reveal_day') {
        if (data?.day) {
          setForceDay(data.day);
        }
      } else if (action === 'send_message' || action === 'popup') {
        if (data?.text || data?.message) {
          setLiveMessage(data.text || data.message);
          setTimeout(() => setLiveMessage(''), 8000);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [instanceId]);

  return (
    <GlobalEffects>
      {roseShowerActive && (
        <div className="rose-shower-overlay pointer-events-none fixed inset-0 z-[99999] flex justify-around overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="text-4xl absolute animate-fall-rose"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                top: '-50px'
              }}
            >
              🌹
            </span>
          ))}
        </div>
      )}
      
      {liveMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[99999] bg-[#fff8e7] border-2 border-[#e450b3] p-6 rounded-2xl shadow-[0_10px_30px_rgba(228,80,179,0.3)] animate-bounce text-center max-w-sm">
          <span className="text-[10px] font-black text-pink-655 uppercase tracking-widest block mb-1">Message from partner 💌</span>
          <p className="text-sm font-bold text-slate-800 italic">"{liveMessage}"</p>
        </div>
      )}

      <MusicPlayer />
      <LandingPage instance={instance} forceDay={forceDay} setForceDay={setForceDay} />
    </GlobalEffects>
  );
}

export default App;
