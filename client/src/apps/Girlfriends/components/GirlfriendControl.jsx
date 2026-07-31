import React, { useState, useEffect } from 'react';
import { Heart, Gift, MessageSquare, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function GirlfriendControl({ instance = {}, socket, api }) {
  const [liveWishes, setLiveWishes] = useState([]);
  const [kissCount, setKissCount] = useState(0);
  const [totalKissesOwed, setTotalKissesOwed] = useState(0);

  // Listen for socket events
  useEffect(() => {
    if (socket) {
      socket.on('girlfriend_wish_received', (data) => {
        setLiveWishes((prev) => [data, ...prev]);
      });

      socket.on('girlfriend_kiss_received', (data) => {
        if (data.kissCount) setKissCount(data.kissCount);
        if (data.totalOwed) setTotalKissesOwed(data.totalOwed);
      });
    }

    return () => {
      if (socket) {
        socket.off('girlfriend_wish_received');
        socket.off('girlfriend_kiss_received');
      }
    };
  }, [socket]);

  return (
    <div className="space-y-6">
      {/* Real-time Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Kisses Received Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold opacity-90">Live Kisses Received</span>
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="text-4xl font-bold font-serif">
            💋 {kissCount} <span className="text-base font-normal opacity-80">/ {totalKissesOwed || 0}</span>
          </div>
          <p className="text-xs opacity-90">
            Real-time kisses sent by your girlfriend during quiz.
          </p>
        </div>

        {/* Wishes Earned Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold opacity-90">Wishes Submitted</span>
            <Gift className="w-5 h-5 fill-white" />
          </div>
          <div className="text-4xl font-bold font-serif">
            🎁 {liveWishes.length}
          </div>
          <p className="text-xs opacity-90">
            Wishes requested by your girlfriend on 100% quiz score.
          </p>
        </div>
      </div>

      {/* Live Wishes Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-500" />
          <span>Live Girlfriend Wishes Feed</span>
        </h4>

        {liveWishes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs italic">
            No wishes received yet. Waiting for girlfriend to complete the quiz!
          </div>
        ) : (
          <div className="space-y-3">
            {liveWishes.map((w, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
                  <span>Wish #{liveWishes.length - idx}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(w.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium italic">
                  "{w.wishText || w.wish}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
