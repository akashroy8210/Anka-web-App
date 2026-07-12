import React, { useState } from 'react';
import { Calendar, Heart, Gift, Eye, Flame, Smile, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function ValentineCustomizer({
  valentineGreeting,
  setValentineGreeting,
  valentineProposalText,
  setValentineProposalText,
  vRoseTitle,
  setVRoseTitle,
  vRoseDesc1,
  setVRoseDesc1,
  vRoseDesc2,
  setVRoseDesc2,
  vChocTitle,
  setVChocTitle,
  vChocText,
  setVChocText,
  vTeddyWait,
  setVTeddyWait,
  vTeddyGo,
  setVTeddyGo,
  vTeddyFound,
  setVTeddyFound,
  vTeddyText,
  setVTeddyText,
  vPromiseTitle,
  setVPromiseTitle,
  vPromiseSub,
  setVPromiseSub,
  vPromisePoints,
  setVPromisePoints,
  vHugIntro,
  setVHugIntro,
  vHugTitle,
  setVHugTitle,
  vHugDesc,
  setVHugDesc,
  vHugBtn,
  setVHugBtn,
  unlockAllDays,
  setUnlockAllDays
}) {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionName) => {
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  const sections = [
    {
      id: 'general',
      label: 'Envelope & Climax proposal Settings 💌',
      icon: Heart,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Envelope Exterior Subheader text
            </label>
            <input
              type="text"
              value={valentineGreeting || ''}
              onChange={(e) => setValentineGreeting(e.target.value)}
              placeholder="e.g. For You Baby (-ve♥️)💕"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Proposal Climax Letter Description Text
            </label>
            <textarea
              rows={3}
              value={valentineProposalText || ''}
              onChange={(e) => setValentineProposalText(e.target.value)}
              placeholder="e.g. I've planned a day full of sweet moments, but it's missing the most important ingredient:"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    },
    {
      id: 'rose',
      label: '🌹 Rose Day Letter Override',
      icon: Gift,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Rose Day Title Heading
            </label>
            <input
              type="text"
              value={vRoseTitle || ''}
              onChange={(e) => setVRoseTitle(e.target.value)}
              placeholder="Happy Rose Day (-ve💕)"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Rose Day Card Instruction Paragraph
            </label>
            <textarea
              rows={2}
              value={vRoseDesc1 || ''}
              onChange={(e) => setVRoseDesc1(e.target.value)}
              placeholder="Ye sare rose aapke liye aapko jitna rose chahiye bas aap click karte raho milte raenge"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Revealed Rose Letter Message
            </label>
            <textarea
              rows={3}
              value={vRoseDesc2 || ''}
              onChange={(e) => setVRoseDesc2(e.target.value)}
              placeholder="I love You baby ye sare gulab tmhare liye babu. you are so important babu for me"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    },
    {
      id: 'chocolate',
      label: '🍫 Chocolate Day Letter Override',
      icon: Smile,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Chocolate Day Title Heading
            </label>
            <input
              type="text"
              value={vChocTitle || ''}
              onChange={(e) => setVChocTitle(e.target.value)}
              placeholder="Happy Chocolate Day 🍫"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Love Chocolate Letter Text Message
            </label>
            <textarea
              rows={4}
              value={vChocText || ''}
              onChange={(e) => setVChocText(e.target.value)}
              placeholder="i love you babu 💕 You know baby why i dont want chocolate..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    },
    {
      id: 'teddy',
      label: '🧸 Teddy Day Screen Override',
      icon: Eye,
      render: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Silhoutte Page Title
              </label>
              <input
                type="text"
                value={vTeddyWait || ''}
                onChange={(e) => setVTeddyWait(e.target.value)}
                placeholder="Someone is waiting…"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Approach Button Text
              </label>
              <input
                type="text"
                value={vTeddyGo || ''}
                onChange={(e) => setVTeddyGo(e.target.value)}
                placeholder="Go Closer →"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Revealed Teddy Message Title
            </label>
            <input
              type="text"
              value={vTeddyFound || ''}
              onChange={(e) => setVTeddyFound(e.target.value)}
              placeholder="You Found Me 🧸"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Revealed Teddy Letter Description Text
            </label>
            <textarea
              rows={3}
              value={vTeddyText || ''}
              onChange={(e) => setVTeddyText(e.target.value)}
              placeholder="Happy Teddy day bubu💕 i love you so much..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    },
    {
      id: 'promise',
      label: '🤝 Promise Day Scroll Override',
      icon: Flame,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Promise Scroll Header Title
            </label>
            <input
              type="text"
              value={vPromiseTitle || ''}
              onChange={(e) => setVPromiseTitle(e.target.value)}
              placeholder="My Promise"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Promise Subheading line
            </label>
            <input
              type="text"
              value={vPromiseSub || ''}
              onChange={(e) => setVPromiseSub(e.target.value)}
              placeholder="I promise to stand beside you in every chapter we write..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Scroll Love Promise Description Text
            </label>
            <textarea
              rows={4}
              value={vPromisePoints || ''}
              onChange={(e) => setVPromisePoints(e.target.value)}
              placeholder="I promise you babu hum gussa nahi karenge..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    },
    {
      id: 'hug',
      label: '🤗 Hug Day Card Override',
      icon: Sparkles,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Film Intro Flash Caption
            </label>
            <input
              type="text"
              value={vHugIntro || ''}
              onChange={(e) => setVHugIntro(e.target.value)}
              placeholder="For a moment that feels like a hug..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Hug Card Title
              </label>
              <input
                type="text"
                value={vHugTitle || ''}
                onChange={(e) => setVHugTitle(e.target.value)}
                placeholder="A Hug For You 🤍"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Interact Button Label
              </label>
              <input
                type="text"
                value={vHugBtn || ''}
                onChange={(e) => setVHugBtn(e.target.value)}
                placeholder="Feel the Hug 💞"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Hug Description Message Text
            </label>
            <textarea
              rows={3}
              value={vHugDesc || ''}
              onChange={(e) => setVHugDesc(e.target.value)}
              placeholder="Not every hug is made with arms. Some are made with presence..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 text-left">
      <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
        <Calendar className="w-4 h-4 text-rosePrimary animate-pulse" />
        <span>Valentine's Week surprise Customizer Settings 🌸</span>
      </h3>

      {/* Date Bypass Lock */}
      <div className="flex items-center space-x-3 bg-rose-50/20 border border-rosePrimary/10 p-4 rounded-2xl">
        <input
          type="checkbox"
          id="unlockAllDays"
          checked={!!unlockAllDays}
          onChange={(e) => setUnlockAllDays(e.target.checked)}
          className="w-4 h-4 text-rosePrimary focus:ring-rosePrimary border-slate-350 rounded cursor-pointer shrink-0"
        />
        <div className="text-left">
          <label htmlFor="unlockAllDays" className="text-xs font-bold text-slate-700 uppercase tracking-wide block cursor-pointer">
            Bypass Lock Date Constraint (Unlock All Days)
          </label>
          <span className="text-[9.5px] text-slate-500 font-light leading-normal block mt-0.5">
            Check this box to unlock all seven days immediately (Rose, Teddy, Promise, Kiss, Hug, chocolate) so the recipient can view them all at once without waiting for the exact dates in February!
          </span>
        </div>
      </div>

      {/* Section accordions */}
      <div className="space-y-4 pt-2">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = activeSection === sec.id;

          return (
            <div key={sec.id} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-rosePrimary shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">{sec.label}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-5 border-t border-slate-100 bg-white space-y-4 animate-fade-in-down">
                  {sec.render()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
