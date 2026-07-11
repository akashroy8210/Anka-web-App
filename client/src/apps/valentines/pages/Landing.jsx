import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Copy, Check, ExternalLink, Lock, Plus, LogOut, Compass, ArrowRight } from "lucide-react";
import { CustomConfigProvider, useCustomConfig } from "../contexts/CustomConfigContext";
import { GirlfriendApp } from "../App";

function VisualCustomizerToolbar({ onSave, onCancel, linkId, setLinkId }) {
  const { config } = useCustomConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSaveClick = async () => {
    if (!linkId.trim()) {
      setError("Please enter a link code, my love!");
      return;
    }
    const cleanId = linkId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!cleanId) {
      setError("Please use letters, numbers, and dashes only!");
      return;
    }
    setError("");
    setIsSaving(true);

    try {
      const serverUrl = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://surprisebabebackend.onrender.com";
      const response = await fetch(`${serverUrl}/api/instances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cleanId, config })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onSave(cleanId);
      } else {
        setError(data.error || "Failed to save configuration 😔");
      }
    } catch (err) {
      console.error(err);
      setError("Connection to backend server failed 😔");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-romantic-pink animate-pulse" />
        <span className="text-sm font-semibold text-white font-sans">Visual Customizer Mode</span>
        <span className="text-[10px] text-text-muted font-sans italic bg-white/5 px-2 py-0.5 rounded-md">
          Click any text or image directly on the website to edit!
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 max-w-[200px]">
          <span className="text-xs text-text-muted select-none">/v/</span>
          <input
            type="text"
            value={linkId}
            onChange={(e) => setLinkId(e.target.value.toLowerCase())}
            placeholder="link-code"
            className="bg-transparent text-xs text-white outline-none w-full font-semibold"
          />
        </div>

        {error && <span className="text-xs text-romantic-pink font-semibold">{error}</span>}

        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full border border-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all cursor-pointer font-sans"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(248,200,220,0.3)] cursor-pointer font-sans flex items-center gap-1.5"
        >
          {isSaving ? "Saving..." : "Save & Generate Link"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("timeline");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please tell me what you want to write about!");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");

    try {
      const serverUrl = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://surprisebabebackend.onrender.com";
      const response = await fetch(`${serverUrl}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: category })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.text);
      } else {
        setError(data.error || "Failed to generate text 😔");
      }
    } catch (err) {
      console.error(err);
      setError("Connection to AI server failed 😔");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="pointer-events-auto w-80 p-5 rounded-3xl bg-slate-950/95 border border-romantic-pink/40 shadow-2xl flex flex-col gap-4 text-white font-sans backdrop-blur-md text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-romantic-pink tracking-wide uppercase">
                <Sparkles className="w-4 h-4 fill-current animate-pulse text-romantic-pink" />
                AI Date Assistant
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-white transition-colors text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Prompt Idea</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. first date at temple shyness, or how she sleeps like pookie..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-romantic-pink transition-all min-h-[60px] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Section Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-romantic-pink"
              >
                <option value="timeline">Timeline Memory Description</option>
                <option value="letter">Open When Letter Content</option>
                <option value="things_i_love">Things I Love Detail</option>
                <option value="welcome">Welcome gate message</option>
                <option value="quote">Soft Star quote</option>
              </select>
            </div>

            {error && <span className="text-[10px] text-romantic-pink font-semibold">{error}</span>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-romantic-pink to-lavender-glow hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shadow-[0_2px_10px_rgba(248,200,220,0.2)] cursor-pointer"
            >
              {loading ? "Writing magic..." : "Generate Romantic Text ✨"}
            </button>

            {result && (
              <div className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-3 relative">
                <span className="text-[9px] font-bold text-romantic-pink uppercase tracking-widest block">Generated text:</span>
                <p className="text-xs italic leading-relaxed text-slate-300 pr-6 select-text">
                  "{result}"
                </p>
                <button
                  onClick={handleCopy}
                  className="absolute top-2.5 right-2.5 p-1 rounded-lg hover:bg-white/10 text-romantic-pink transition-all cursor-pointer"
                  title="Copy generated text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto px-4 py-3 rounded-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink text-white font-bold text-xs shadow-lg shadow-romantic-pink/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer font-sans"
      >
        <Sparkles className="w-4 h-4 fill-current animate-pulse text-white" />
        AI Assistant
      </button>
    </div>
  );
}

export default function Landing() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Builder States
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [linkId, setLinkId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copiedLink, setCopiedLink] = useState("");

  // Portal History State
  const [portals, setPortals] = useState([]);

  // Load created portals from localStorage
  useEffect(() => {
    const list = localStorage.getItem("bubu_portals");
    if (list) {
      try {
        setPortals(JSON.parse(list));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!idInput.trim() || !passInput.trim()) {
      setLoginError("Please enter your Client ID and Password!");
      return;
    }
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const serverUrl = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://surprisebabebackend.onrender.com";
      const response = await fetch(`${serverUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idInput, pass: passInput })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || "Incorrect credentials baby 😔");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Failed to connect to authentication server 😔");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
  };

  const startCustomizing = () => {
    // Generate a random string as pre-filled link suffix
    const randomSuffix = `date-${Math.floor(1000 + Math.random() * 9000)}`;
    setLinkId(randomSuffix);
    setIsCustomizing(true);
  };

  const finishSaving = (cleanId) => {
    setIsCustomizing(false);
    setGeneratedId(cleanId);

    // Save portal to local storage list
    const newPortals = [
      { id: cleanId, createdAt: new Date().toLocaleDateString() },
      ...portals.filter((p) => p.id !== cleanId)
    ];
    setPortals(newPortals);
    localStorage.setItem("bubu_portals", JSON.stringify(newPortals));
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  const getDatingUrl = (id) => `${window.location.origin}/v/${id}`;
  const getAdminUrl = (id) => `${window.location.origin}/v/${id}/admin`;

  // Render Visual Customizer Wrapper
  if (isCustomizing) {
    return (
      <CustomConfigProvider isEditingMode={true}>
        <div className="relative min-h-screen bg-bg-from pb-24">
          <GirlfriendApp />
          <AiAssistantWidget />
          <VisualCustomizerToolbar
            linkId={linkId}
            setLinkId={setLinkId}
            onCancel={() => setIsCustomizing(false)}
            onSave={finishSaving}
          />
        </div>
      </CustomConfigProvider>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0A0B1E] via-[#120E2E] to-[#1B143F] text-white flex flex-col justify-between font-sans">
      
      {/* HEADER NAVBAR */}
      <header className="px-6 py-5 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-romantic-pink fill-current" />
          <span className="font-extrabold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink to-lavender-glow">
            BUBU'S DATE FACTORY
          </span>
        </div>
        {token && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-romantic-pink/40 text-xs text-text-secondary hover:text-romantic-pink transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center">
        
        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!token ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 md:p-10 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl relative space-y-6"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-romantic-pink/10 to-lavender-glow/10 blur-xl rounded-full" />
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-romantic-pink/15 text-romantic-pink flex items-center justify-center mx-auto text-xl">
                🔑
              </div>
              <h2 className="text-2xl font-bold font-display text-text-primary">
                Verify Your Credentials
              </h2>
              <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                Log in using your **Anka Client ID** to build and configure dynamic surprises.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                  Anka Client ID
                </label>
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="Enter your Client ID"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none text-sm text-white focus:border-romantic-pink transition-all font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                  Password
                </label>
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none text-sm text-white focus:border-romantic-pink transition-all font-sans"
                />
              </div>

              {loginError && (
                <p className="text-xs text-romantic-pink font-semibold text-center mt-2">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-romantic-pink to-lavender-glow hover:opacity-95 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-[0_4px_15px_rgba(248,200,220,0.3)] cursor-pointer font-sans"
              >
                {isLoggingIn ? "Authenticating..." : "Unlock Builder ✨"}
              </button>
            </form>
          </motion.div>
        ) : (
          
          /* DASHBOARD VIEW */
          <div className="w-full space-y-10">
            {/* Dashboard Welcome Hero */}
            <div className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-romantic-pink font-semibold uppercase tracking-wider font-sans">
                  <Sparkles className="w-3.5 h-3.5" />
                  Starlit Date Factory
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold font-display">
                  Welcome Back, Bubu
                </h1>
                <p className="text-sm text-text-muted max-w-md font-sans">
                  Customize starlit worlds for Sona. Generate individual links that won't interfere with each other!
                </p>
              </div>

              <button
                onClick={startCustomizing}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink text-white font-bold text-xs shadow-[0_4px_20px_rgba(212,165,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Customize New Date
              </button>
            </div>

            {/* Generated Portals List */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-lavender-glow" />
                Active Date Portals ({portals.length})
              </h2>

              {portals.length === 0 ? (
                <div className="glass-panel p-8 text-center text-text-muted border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2.5 py-12">
                  <span className="text-3xl">🌌</span>
                  <p className="font-sans text-sm font-light italic max-w-xs">
                    You haven't generated any worlds yet. Click "Customize New Date" above to build your first one!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portals.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -2 }}
                      className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/2 hover:border-romantic-pink/30 hover:bg-white/4 transition-all duration-300 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-romantic-pink font-bold font-sans tracking-widest uppercase">
                            link code: {p.id}
                          </span>
                          <span className="text-[10px] text-white/40 font-sans">
                            {p.createdAt}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold font-sans text-white truncate">
                          Sona's World ({p.id})
                        </h3>
                      </div>

                      <div className="flex items-center gap-2.5 pt-2">
                        <a
                          href={getDatingUrl(p.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 text-[10px] text-white font-semibold transition-all flex items-center justify-center gap-1 font-sans"
                        >
                          Dating Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        
                        <a
                          href={getAdminUrl(p.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl border border-romantic-pink/30 hover:border-romantic-pink/60 bg-romantic-pink/10 text-[10px] text-romantic-pink font-semibold transition-all flex items-center justify-center gap-1 font-sans"
                        >
                          Controller
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Generated Links Success Dialog Modal */}
            <AnimatePresence>
              {generatedId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 15 }}
                    className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full relative space-y-6 bg-[#0E0F24]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-romantic-pink/10 to-lavender-glow/10 blur-xl rounded-full" />
                    
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-romantic-pink/20 text-romantic-pink flex items-center justify-center mx-auto text-xl animate-bounce">
                        ✨
                      </div>
                      <h2 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink to-lavender-glow">
                        Sona's World is Online!
                      </h2>
                      <p className="text-xs text-text-muted leading-relaxed font-sans max-w-xs mx-auto">
                        Copy these links. Send the dating portal to Sona, and open the Controller Dashboard on your phone to trigger surprises in real-time!
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Dating Link field */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                          Sona's Dating Website URL
                        </label>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3">
                          <input
                            type="text"
                            readOnly
                            value={getDatingUrl(generatedId)}
                            className="bg-transparent text-xs text-white outline-none w-full font-light"
                          />
                          <button
                            onClick={() => handleCopy(getDatingUrl(generatedId), "date")}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-romantic-pink transition-all cursor-pointer"
                          >
                            {copiedLink === "date" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Controller Link field */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-sans">
                          Bubu's Secret Control Dashboard (Open on call)
                        </label>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3">
                          <input
                            type="text"
                            readOnly
                            value={getAdminUrl(generatedId)}
                            className="bg-transparent text-xs text-white/70 outline-none w-full font-light"
                          />
                          <button
                            onClick={() => handleCopy(getAdminUrl(generatedId), "admin")}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-lavender-glow transition-all cursor-pointer"
                          >
                            {copiedLink === "admin" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={() => setGeneratedId("")}
                        className="flex-1 py-3.5 rounded-2xl border border-white/10 hover:border-white/25 text-white font-semibold text-xs transition-all cursor-pointer font-sans"
                      >
                        Return to Dashboard
                      </button>
                      
                      <a
                        href={getAdminUrl(generatedId)}
                        className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-romantic-pink to-lavender-glow hover:opacity-90 text-white font-bold text-xs transition-all shadow-[0_4px_12px_rgba(212,165,255,0.3)] flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        Launch Controller
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs text-white/20 border-t border-white/5">
        Designed with love. Built for starlit dates. — Antigravity 🌸
      </footer>
    </div>
  );
}
