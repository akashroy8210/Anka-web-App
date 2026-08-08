import React, { useState, useEffect } from 'react';

export default function ApologyControl({ instanceData, socket }) {
  const [recipientResponse, setRecipientResponse] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);
  const [liveLog, setLiveLog] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('live-trigger', (data) => {
      if (data.type === 'recipient-response') {
        setRecipientResponse(data.payload);
        setLiveLog(prev => [`[${new Date().toLocaleTimeString()}] Recipient responded: "${data.payload.text || data.payload.quickChoice}"`, ...prev]);
      }
      if (data.type === 'final-choice') {
        setFinalChoice(data.payload);
        setLiveLog(prev => [`[${new Date().toLocaleTimeString()}] Recipient choice: "${data.payload}"`, ...prev]);
      }
    });

    return () => {
      socket.off('live-trigger');
    };
  }, [socket]);

  return (
    <div className="space-y-4 font-sans text-xs text-slate-800">
      {/* Live Status Header */}
      <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-rose-900 uppercase tracking-wider text-[11px]">
            Live Control Panel — Apology Experience
          </span>
        </div>
        <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">
          Socket Connected
        </span>
      </div>

      {/* Recipient Response Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Latest Recipient Response
        </span>
        {recipientResponse ? (
          <div className="space-y-1">
            {recipientResponse.quickChoice && (
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {recipientResponse.quickChoice}
              </span>
            )}
            {recipientResponse.text && (
              <p className="text-xs italic text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{recipientResponse.text}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Waiting for recipient response...</p>
        )}
      </div>

      {/* Final Choice Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Final Decision Choice
        </span>
        {finalChoice ? (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {finalChoice}
          </span>
        ) : (
          <p className="text-xs text-slate-400 italic">Recipient has not made final selection yet.</p>
        )}
      </div>

      {/* Live Event Activity Feed */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-200 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 block">
          Live Event Activity Log
        </span>
        <div className="space-y-1 max-h-36 overflow-y-auto font-mono text-[10px]">
          {liveLog.length > 0 ? (
            liveLog.map((log, i) => <div key={i} className="text-emerald-400">{log}</div>)
          ) : (
            <div className="text-slate-500 italic">No live events recorded yet...</div>
          )}
        </div>
      </div>
    </div>
  );
}
