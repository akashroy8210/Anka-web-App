import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/SocketContext";
import { 
  Heart, Sparkles, LogIn, Lock, Users, Activity, 
  Send, Calendar, Volume2, Moon, Sun, Clock, Gift, LogOut
} from "lucide-react";

export default function Admin({ bypassAuth = false }) {
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(bypassAuth);
  const [loginError, setLoginError] = useState("");
  
  // Controls local state
  const [customMessage, setCustomMessage] = useState("");
  const [shootingStarWish, setShootingStarWish] = useState("Just wanted to remind you that you're loved ❤️");
  const [countdownSecs, setCountdownSecs] = useState(10);
  const [countdownSurprise, setCountdownSurprise] = useState("We are going on a virtual coffee date right now! ☕");
  const [customQuote, setCustomQuote] = useState("Rest is not weakness, bubu.");
  const [selectedMemoryId, setSelectedMemoryId] = useState(2);
  const [customVoiceUrl, setCustomVoiceUrl] = useState("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordError, setRecordError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const startRecording = async () => {
    setRecordError("");
    setAudioChunks([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsUploading(true);
        const blob = new Blob(chunks, { type: "audio/webm" });
        
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = reader.result;
          try {
            const serverUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
              ? 'http://localhost:5000'
              : window.location.origin;
            const res = await fetch(`${serverUrl}/api/admin/upload-voice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioData: base64Data })
            });
            const data = await res.json();
            if (data.success) {
              setCustomVoiceUrl(data.audioUrl);
            } else {
              setRecordError(data.error || "Failed to upload recording");
            }
          } catch (err) {
            console.error(err);
            setRecordError("Could not upload recording to backend");
          } finally {
            setIsUploading(false);
          }
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setRecordError("Microphone access denied or unsupported");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const socketContext = useSocket();

  useEffect(() => {
    // Check if token exists in storage
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPass.trim()) {
      setLoginError("Please fill in both fields!");
      return;
    }
    setLoginError("");

    try {
      const serverUrl = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://surprisebabebackend.onrender.com";
      const res = await fetch(`${serverUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, pass: adminPass })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Could not connect to the backend server 😔");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-tr from-[#0A0B1E] via-[#120E2E] to-[#221A52] text-white font-sans text-center">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel max-w-md w-full p-8 md:p-10 rounded-3xl border border-glass-border shadow-2xl relative flex flex-col items-center gap-6"
        >
          {/* Logo / Header */}
          <div className="w-14 h-14 bg-romantic-pink/20 text-romantic-pink rounded-full flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold font-display text-text-primary">
              Private Admin Entry
            </h2>
            <p className="text-sm text-text-muted">
              Enter your Client ID and Password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                Anka Client ID
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter client ID..."
                className="w-full bg-black/20 border border-glass-border rounded-xl py-2.5 px-4 text-white placeholder-white/30 text-sm outline-none focus:border-romantic-pink transition-all font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                Password
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-black/20 border border-glass-border rounded-xl py-2.5 px-4 text-white placeholder-white/30 text-sm outline-none focus:border-romantic-pink transition-all font-sans"
              />
            </div>

            {loginError && (
              <p className="text-xs text-romantic-pink font-semibold text-center italic mt-2">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink text-white font-semibold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <LogIn className="w-4 h-4" />
              Verify & Enter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const { isConnected, activeUsersCount, lastEventText, triggerEvent } = socketContext || {};

  return (
    <div className="min-h-screen relative bg-gradient-to-tr from-[#0A0B1E] via-[#120E2E] to-[#221A52] text-white font-sans p-6 md:p-12 overflow-y-auto">
      {/* Background glowing bubbles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-lavender-glow/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-glass-border pb-6 mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-romantic-pink/15 flex items-center justify-center text-romantic-pink animate-pulse">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-text-primary">
              Bubu's Surprise Control Room
            </h1>
            <p className="text-xs text-text-muted font-sans font-light">
              Trigger live real-time interactive overlays.
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-glass-border hover:border-romantic-pink text-xs text-text-muted hover:text-romantic-pink transition-all cursor-pointer font-sans"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10 pb-20">
        
        {/* COL 1: Status & Text Messages */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Connection Monitor */}
          <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-lg space-y-6">
            <h2 className="text-lg font-bold font-display text-romantic-pink flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Connection Monitor
            </h2>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold font-sans mb-1">
                  Server Health
                </span>
                <span className={`text-sm font-bold flex items-center gap-1.5 ${isConnected ? "text-emerald-400" : "text-romantic-pink animate-pulse"}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-romantic-pink"}`} />
                  {isConnected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>

              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold font-sans mb-1">
                  Active Users
                </span>
                <span className="text-2xl font-bold font-display text-amber-highlight flex items-center gap-1.5 justify-center">
                  <Users className="w-5 h-5 stroke-1.5" />
                  {activeUsersCount}
                </span>
              </div>
            </div>

            <div className="bg-black/15 border border-glass-border rounded-2xl p-4">
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold font-sans block mb-1">
                Last Surprise Triggered
              </span>
              <p className="text-sm font-semibold italic text-lavender-glow">
                "{lastEventText || "None yet"}"
              </p>
            </div>
          </div>

          {/* Live Messages Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-lg space-y-4">
            <h2 className="text-lg font-bold font-display text-romantic-pink flex items-center gap-2">
              <Send className="w-5 h-5" />
              Live Message Board
            </h2>
            <p className="text-xs text-text-muted font-sans font-light">
              Send a floating notification card that will instantly appear on her screen.
            </p>

            <div className="space-y-3">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type a sweet message..."
                rows={3}
                className="w-full bg-black/20 border border-glass-border rounded-xl p-3 text-sm text-white placeholder-white/20 outline-none focus:border-romantic-pink resize-none transition-all font-sans"
              />
              <button
                onClick={() => {
                  if (!customMessage.trim()) return;
                  triggerEvent("send_message", { text: customMessage.trim() });
                  setCustomMessage("");
                }}
                disabled={!customMessage.trim()}
                className="w-full py-3 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow disabled:opacity-50 text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                Send Surprise message 💌
              </button>
            </div>
          </div>

        </div>

        {/* COL 2: Magic Effects Panel */}
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          
          {/* Interactive Surprise Remotes */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-glass-border shadow-lg space-y-6">
            <h2 className="text-lg font-bold font-display text-romantic-pink flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Magical Remotes (Instant overlays)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Heart Rain control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-romantic-pink fill-current" />
                    Heart Rain
                  </h3>
                  <p className="text-xs text-text-muted font-sans font-light mt-1">
                    Spawns hundreds of soft pink and purple floating hearts falling down.
                  </p>
                </div>
                <button
                  onClick={() => triggerEvent("heart_rain")}
                  className="w-full py-2.5 rounded-full bg-romantic-pink/20 hover:bg-romantic-pink/30 text-romantic-pink border border-romantic-pink/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Trigger Heart Rain ❤️
                </button>
              </div>

              {/* Shooting star control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-highlight" />
                    Shooting Star Wish
                  </h3>
                  <input
                    type="text"
                    value={shootingStarWish}
                    onChange={(e) => setShootingStarWish(e.target.value)}
                    placeholder="Enter wish wish..."
                    className="w-full bg-black/10 border border-glass-border rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-amber-highlight transition-all font-sans"
                  />
                </div>
                <button
                  onClick={() => triggerEvent("shooting_star", { message: shootingStarWish })}
                  className="w-full py-2.5 rounded-full bg-amber-highlight/20 hover:bg-amber-highlight/30 text-amber-highlight border border-amber-highlight/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Shoot Star 💫
                </button>
              </div>

              {/* Knock knock control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    🚪 Knock Knock
                  </h3>
                  <p className="text-xs text-text-muted font-sans font-light mt-1">
                    Triggers a knock sound alert and initiates a loving 3-step conversation gateway.
                  </p>
                </div>
                <button
                  onClick={() => triggerEvent("knock")}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Knock on her screen 🚪
                </button>
              </div>

              {/* Theme toggle control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    🎨 Remote Theme Overrider
                  </h3>
                  <p className="text-xs text-text-muted font-sans font-light mt-1">
                    Instantly change her website skin between starlit night and daylight meadow.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => triggerEvent("change_theme", { theme: "dark" })}
                    className="py-2 rounded-full bg-[#120E2E] hover:bg-[#1B143F] text-lavender-glow border border-lavender-glow/30 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Starlit
                  </button>
                  <button
                    onClick={() => triggerEvent("change_theme", { theme: "light" })}
                    className="py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    Meadow
                  </button>
                </div>
              </div>

              {/* Countdown control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4 sm:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-blue" />
                      Live Screen Countdown
                    </h3>
                    <div className="flex items-center gap-2">
                      {[10, 20, 30].map((secs) => (
                        <button
                          key={secs}
                          onClick={() => setCountdownSecs(secs)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-bold font-sans cursor-pointer ${countdownSecs === secs ? "bg-sky-blue/20 border-sky-blue text-sky-blue" : "border-glass-border text-text-muted"}`}
                        >
                          {secs}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase font-sans">
                      Surprise reveal message
                    </label>
                    <input
                      type="text"
                      value={countdownSurprise}
                      onChange={(e) => setCountdownSurprise(e.target.value)}
                      placeholder="Surprise message..."
                      className="w-full bg-black/10 border border-glass-border rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-sky-blue transition-all font-sans"
                    />
                  </div>
                </div>
                <button
                  onClick={() => triggerEvent("show_countdown", { duration: countdownSecs, message: countdownSurprise })}
                  className="w-full py-2.5 rounded-full bg-sky-blue/20 hover:bg-sky-blue/30 text-sky-blue border border-sky-blue/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Trigger Screen Countdown ⌛
                </button>
              </div>

              {/* Cinematic Quote controls */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4 sm:col-span-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    📜 Cinematic Comfort Quote
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuote}
                      onChange={(e) => setCustomQuote(e.target.value)}
                      placeholder="Enter cinematic quote..."
                      className="flex-1 bg-black/10 border border-glass-border rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-romantic-pink transition-all font-sans"
                    />
                    <div className="flex gap-1">
                      {[
                        "You don't have to carry everything alone.",
                        "Rest is not weakness.",
                        "I'm here."
                      ].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setCustomQuote(preset)}
                          title={preset}
                          className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-text-muted hover:text-white truncate max-w-[80px]"
                        >
                          {preset.split(" ")[0]}...
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => triggerEvent("display_quote", { text: customQuote })}
                  className="w-full py-2.5 rounded-full bg-romantic-pink/20 hover:bg-romantic-pink/30 text-romantic-pink border border-romantic-pink/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Cast Comfort Quote Card 📜
                </button>
              </div>

              {/* Timeline unlock control */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-lavender-glow" />
                    Unlock Secret Memory
                  </h3>
                  <p className="text-[10px] text-text-muted font-sans">
                    Force unlock a locked timeline milestone.
                  </p>
                  <select
                    value={selectedMemoryId}
                    onChange={(e) => setSelectedMemoryId(Number(e.target.value))}
                    className="w-full bg-black/20 border border-glass-border rounded-lg py-1.5 px-3 text-xs text-white outline-none focus:border-lavender-glow font-sans"
                  >
                    <option value={2} className="bg-[#120E2E]">Memory #2 (Jackets swapped)</option>
                    <option value={3} className="bg-[#120E2E]">Memory #3 (Chaos road trip)</option>
                    <option value={4} className="bg-[#120E2E]">Memory #4 (Asleep on shoulder)</option>
                    <option value={5} className="bg-[#120E2E]">Memory #5 (Jaw dropped date)</option>
                  </select>
                </div>
                <button
                  onClick={() => triggerEvent("unlock_memory", { memoryId: selectedMemoryId })}
                  className="w-full py-2.5 rounded-full bg-lavender-glow/20 hover:bg-lavender-glow/30 text-lavender-glow border border-lavender-glow/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans"
                >
                  Unlock Selected Memory ✨
                </button>
              </div>

              {/* Voice Note trigger */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-romantic-pink" />
                    Push Voice Note / YouTube Song
                  </h3>
                  <p className="text-[10px] text-text-muted font-sans">
                    Record your own voice live or enter a direct audio/YouTube link.
                  </p>

                  <div className="flex gap-2 items-center">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={isUploading}
                        className="flex-1 py-2 rounded-xl bg-romantic-pink/20 hover:bg-romantic-pink/35 text-romantic-pink text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-romantic-pink/30 cursor-pointer disabled:opacity-50 font-sans"
                      >
                        <span className="w-2 h-2 rounded-full bg-romantic-pink animate-pulse" />
                        Record Voice
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-red-500/30 cursor-pointer font-sans"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        Stop Recording
                      </button>
                    )}
                  </div>

                  {isUploading && (
                    <p className="text-[10px] text-lavender-glow animate-pulse text-center font-sans">
                      Uploading recording, please wait...
                    </p>
                  )}

                  {recordError && (
                    <p className="text-[10px] text-romantic-pink text-center font-sans">
                      {recordError}
                    </p>
                  )}

                  <input
                    type="text"
                    value={customVoiceUrl}
                    onChange={(e) => setCustomVoiceUrl(e.target.value)}
                    placeholder="Recorded URL or YouTube link..."
                    className="w-full bg-black/10 border border-glass-border rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-romantic-pink transition-all font-sans"
                  />
                </div>
                <button
                  onClick={() => triggerEvent("play_voice", { audioUrl: customVoiceUrl })}
                  disabled={!customVoiceUrl || isUploading || isRecording}
                  className="w-full py-2.5 rounded-full bg-romantic-pink/20 hover:bg-romantic-pink/30 text-romantic-pink border border-romantic-pink/35 text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans disabled:opacity-40"
                >
                  Push Audio Note 🎙️
                </button>
              </div>

              {/* Special Finale trigger */}
              <div className="bg-black/15 border border-glass-border rounded-2xl p-6 flex flex-col justify-between gap-4 sm:col-span-2 shadow-[0_0_20px_rgba(244,63,94,0.1)] border-romantic-pink/25">
                <div>
                  <h3 className="text-lg font-bold text-romantic-pink font-display flex items-center gap-2">
                    <Gift className="w-5 h-5 animate-bounce" />
                    Special Finale Sequence
                  </h3>
                  <p className="text-xs text-text-muted font-sans font-light mt-1.5 leading-relaxed">
                    Trigger the grand romantic ending. Her screen will fade to deep navy darkness, background stars will glow at maximum intensity, hearts will float upward, and the final glass letter card will appear.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const confirmFinale = window.confirm("Are you ready to trigger the Grand Finale ending, idiot? ❤️");
                    if (confirmFinale) {
                      triggerEvent("special_finale");
                    }
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer font-sans tracking-widest uppercase"
                >
                  🎆 Trigger Grand Finale 🎆
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
