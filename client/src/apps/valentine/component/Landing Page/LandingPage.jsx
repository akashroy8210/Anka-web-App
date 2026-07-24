import React, { useState } from 'react'
import Happy from "./Happy";
import envelop from "../../assets/image/envelop.png";
import { Choclate, Promise, Hug, Kiss, Propose, Valentine, Teddy,Rose} from '../cards/index'

function LandingPage({ instance, forceDay, setForceDay }) {
  const config = instance?.config || {};
  const valentineGreeting = config.valentineGreeting || "For You Baby (-ve♥️)💕";
  const valentineProposalText = config.valentineProposalText || "I've planned a day full of sweet moments, but it's missing the most important ingredient:";
  const unlockAllDays = !!config.unlockAllDays;
  const recipientName = config.recipientName || "You";

  const [mood, setMood] = useState("landing");
  const [letter, setletter] = useState();
  const [day, setDay] = useState();

  const themePresets = {
    'classic-red': {
      bg: 'bg-gradient-to-t from-[#8a001a] to-[#e63956]',
      card: 'bg-white/95 border-[#8a001a] text-slate-800',
      text: 'text-white',
      accent: 'text-[#8a001a]',
      btn: 'bg-rose-600 text-white hover:bg-rose-500 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.4)]',
      heading: 'text-pink-700',
      pText: 'text-[#59656f]'
    },
    'valentine-week': {
      bg: 'bg-gradient-to-t from-[#8a001a] to-[#e63956]',
      card: 'bg-white/95 border-[#8a001a] text-slate-800',
      text: 'text-white',
      accent: 'text-[#8a001a]',
      btn: 'bg-rose-600 text-white hover:bg-rose-500 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.4)]',
      heading: 'text-pink-700',
      pText: 'text-[#59656f]'
    },
    'pastel-lavender': {
      bg: 'bg-gradient-to-t from-[#c084fc] to-[#f472b6]',
      card: 'bg-[#fffbfe] border-[#c084fc] text-slate-800',
      text: 'text-white',
      accent: 'text-[#c084fc]',
      btn: 'bg-[#c084fc] text-white hover:bg-[#a855f7] hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(192,132,252,0.4)]',
      heading: 'text-[#a855f7]',
      pText: 'text-[#64748b]'
    },
    'neon-passion': {
      bg: 'bg-[#090514]',
      card: 'bg-[#120b24]/90 border-fuchsia-500/30 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.2)]',
      text: 'text-fuchsia-300',
      accent: 'text-fuchsia-400',
      btn: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(217,70,239,0.6)]',
      heading: 'text-fuchsia-500',
      pText: 'text-fuchsia-200/70'
    },
    'vintage-letterpress': {
      bg: 'bg-gradient-to-t from-[#d9c5b2] to-[#f3ebd8]',
      card: 'bg-[#f4efe2] border-[#a89582] text-[#3e3429] font-serif shadow-md',
      text: 'text-[#3e3429]',
      accent: 'text-[#8c6d58]',
      btn: 'bg-[#6f4e37] text-white hover:bg-[#5c3e2b] hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(111,78,55,0.3)]',
      heading: 'text-[#6f4e37]',
      pText: 'text-[#5a4d41]'
    }
  };

  const currentTheme = themePresets[themeSlug] || {
    bg: personality.id === 'luxury' ? 'bg-[#0a0906]' : personality.id === 'pastel' ? 'bg-[#faf5ff]' : personality.id === 'cyber' ? 'bg-[#090514]' : personality.id === 'retro' ? 'bg-[#0f0e0c]' : 'bg-gradient-to-t from-[#8a001a] to-[#e63956]',
    card: personality.cardStyle,
    text: 'text-white',
    accent: 'text-amber-400',
    btn: personality.buttonStyle,
    heading: 'text-amber-300',
    pText: 'text-slate-300'
  };

  React.useEffect(() => {
    if (forceDay) {
      setMood("good");
      setletter("open");
      setDay(forceDay);
    }
  }, [forceDay]);

  // ✅ Valentine Unlock Logic (ADDED)
  const valentineWeek = {
    Rose: 8,
    Propose: 8,
    Choclate: 8,
    Teddy: 8,
    Promise: 8,
    Hug: 8,
    Kiss: 8,
    Valentine: 8,
  };

  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth(); // Jan = 0, Feb = 1

  const isUnlocked = (dayName) => {
    if (unlockAllDays) return true;
    return currentMonth === 1 && currentDate >= valentineWeek[dayName];
  };

// ✅ Auto unlock at midnight
setTimeout(() => {
  window.location.reload();
}, (24 - today.getHours()) * 3600000);


// -------- YOUR ORIGINAL FLOW (NOT TOUCHED) --------

  const renderDayComponent = () => {
    const photos = config.photos || [];
    const valentineConfig = {
      roseTitle: config.vRoseTitle,
      roseDesc1: config.vRoseDesc1,
      roseDesc2: config.vRoseDesc2,
      chocTitle: config.vChocTitle,
      chocText: config.vChocText,
      teddyWait: config.vTeddyWait,
      teddyGo: config.vTeddyGo,
      teddyFound: config.vTeddyFound,
      teddyText: config.vTeddyText,
      promiseTitle: config.vPromiseTitle,
      promiseSub: config.vPromiseSub,
      promisePoints: config.vPromisePoints,
      hugIntro: config.vHugIntro,
      hugTitle: config.vHugTitle,
      hugDesc: config.vHugDesc,
      hugBtn: config.vHugBtn,
    };

    if (day === "Promise") return <Promise config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Hug") return <Hug config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Teddy") return <Teddy config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Propose") return <Propose config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Valentine") return <Valentine config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Choclate") return <Choclate config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Kiss") return <Kiss config={valentineConfig} photos={photos} recipientName={recipientName} />;
    if (day === "Rose") return <Rose config={valentineConfig} photos={photos} recipientName={recipientName} />;
    return null;
  };

  const dayComp = renderDayComponent();
  if (dayComp) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => { setDay(null); if (setForceDay) setForceDay(null); }}
          className="fixed top-6 left-6 z-[9999] px-4 py-2 bg-white/90 hover:bg-white text-pink-600 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md border border-pink-100 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          ◀ Back to Week Grid
        </button>
        {dayComp}
      </div>
    );
  }

  if (mood === "bad") {
    return <Happy />;
  }

  if (mood === "good") {
  if (letter === "open") {
    return (
      <div className={`h-screen flex flex-col relative bg-cover items-center justify-center ${currentTheme.bg}`}>
        <h1 className={`text-3xl font-bold fixed top-20 ${themeSlug === 'neon-passion' ? 'text-fuchsia-300' : 'text-white'}`}>{valentineGreeting}</h1>

        <div className={`flex flex-col rounded-2xl w-[800px] max-w-[90%] p-5 border-2 ${currentTheme.card}`}>
          <h2 className="text-2xl p-2 border-b border-rosePrimary/20 text-center font-bold font-[Great_Vibes]">
            Now Its time for surprise✨
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 p-8 sm:p-12 gap-4">
            {["Rose", "Propose", "Choclate", "Teddy", "Promise", "Hug", "Kiss", "Valentine"].map((d) => {
              const unlocked = isUnlocked(d);

              return (
                <button
                  key={d}
                  onClick={() => unlocked && setDay(d)}
                  disabled={!unlocked}
                  style={{ fontFamily: 'Lato' }}
                  className={`
                    border px-4 py-3 rounded-xl shadow-md font-bold
                    transition-all duration-300 relative
                    ${unlocked
                      ? `${currentTheme.btn} cursor-pointer`
                      : "bg-gray-300/40 text-gray-500/70 border-gray-300/20 cursor-not-allowed"
                    }
                  `}
                >
                  {/* LOCK ICON */}
                  {!unlocked && (
                    <span className="absolute right-2 top-1.5 text-[10px]">
                      🔒
                    </span>
                  )}
                  {d} Day
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col relative bg-cover items-center justify-center ${currentTheme.bg}`}>
      <h1 className={`text-3xl font-bold fixed top-20 ${themeSlug === 'neon-passion' ? 'text-fuchsia-300' : 'text-white'}`}>{valentineGreeting}</h1>

      <div className={`flex flex-col rounded-2xl w-[600px] max-w-[90%] p-5 border-2 ${currentTheme.card}`}>
        <div className="flex gap-10 flex-col items-center justify-center p-12">
          <h2 className={`text-2xl sm:text-3xl font-bold capitalize text-center ${currentTheme.heading}`}>
            Click on envelope to open surprise✨
          </h2>

          <button onClick={() => setletter("open")} className="focus:outline-none">
            <img src={envelop} alt="Envelope" className="w-[180px] transition-all duration-300 hover:scale-110 cursor-pointer drop-shadow-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

return (
  <div className={`h-screen flex flex-col relative bg-cover items-center justify-center ${currentTheme.bg}`}>
    <h1 className="text-1xl font-bold fixed top-20 bg-white/90 backdrop-blur border shadow-xl border-rosePrimary/20 px-5 pb-3 pt-2.5 rounded-full text-rosePrimary mb-10">
      Special Delivery <span className="inline-flex text-3xl text-red-400 ml-1.5 mr-1.5 font-sans leading-none align-middle animate-pulse">♥</span> {valentineGreeting}
    </h1>

    <div className={`flex flex-col rounded-2xl w-[800px] max-w-[95%] p-5 border border-white/10 backdrop-blur-md bg-white/10 ${themeSlug === 'neon-passion' ? 'text-fuchsia-100' : 'text-white'}`}>
      <h2 className="text-5xl sm:text-7xl text-center font-[Great_Vibes] animate-down leading-tight" style={{ fontFamily: 'Playfair Display' }}>
        Will You be my
        <span className={`block text-6xl sm:text-8xl font-black mt-3 ${currentTheme.heading}`}>{recipientName}'s Valentine?</span>
      </h2>

      <p className={`text-lg sm:text-xl px-4 sm:px-16 text-center mt-6 animate-down ${currentTheme.pText}`} style={{ fontFamily: 'Lato' }}>
        {valentineProposalText}
      </p>

      <div className="flex gap-6 items-center justify-center p-8 sm:p-12">
        <button
          onClick={() => setMood("good")}
          className={`px-8 text-xl py-3 cursor-pointer rounded-2xl shadow-xl flex items-center font-bold transition-all duration-300 ${currentTheme.btn}`}
          style={{ fontFamily: 'Montserrat' }}
        >
          Yes, I'd love to!
        </button>

        <button
          onClick={() => setMood("bad")}
          className="px-8 text-xl py-3 cursor-pointer animate-bounce bg-slate-900/60 hover:bg-slate-900 text-white rounded-2xl shadow-xl flex items-center transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ fontFamily: 'Montserrat' }}
        >
          No
        </button>
      </div>
    </div>
  </div>
);
}

export default LandingPage;