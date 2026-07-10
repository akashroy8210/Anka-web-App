import React, { useEffect } from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';
import { updateSEO } from '../utils/seo';

export default function About() {
  useEffect(() => {
    updateSEO({
      title: "About Our Story & Mission | AnKa",
      description: "AnKa is dedicated to bridging human connection with premium interactive surprise websites and digital developer services for local businesses.",
      keywords: "about anka, digital surprises team, custom web developers, interactive design services, surprise website builders"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] via-[#FFF5F2] to-white pt-24 pb-16 relative">
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blushAccent/25 filter blur-3xl -z-10 animate-float-slow"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 border border-rosePrimary/15 text-rosePrimary text-xs font-extrabold uppercase tracking-widest">
              <span>About AnKa</span>
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-wineDeep tracking-tight">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-light max-w-xl mx-auto">
            Bridging human connection with high-performance digital experiences.
          </p>
        </div>

        {/* Narrative */}
        <div className="glass-card-rose rounded-3xl p-8 border border-rosePrimary/15 shadow-md shadow-rosePrimary/5 space-y-6 text-slate-655 leading-relaxed font-light text-base sm:text-lg bg-white/70">
          <h2 className="font-heading font-bold text-2xl text-wineDeep">Our Mission</h2>
          <p>
            AnKa was founded on a simple premise: gift-giving in the digital age should be deeply personal, interactive, and aesthetic. Instead of standard chat greetings or disposable cards, we build high-end interactive websites that tell a story.
          </p>
          <p>
            With AnKa, anyone can buy a gorgeous occasion-themed page, instantly access a private mini admin panel, and populate it with their own memories:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-sm sm:text-base font-normal">
            <li>
              <strong className="text-rosePrimary">Personalized Timelines:</strong> Highlight core milestones of how you met, funny stories, and growth points.
            </li>
            <li>
              <strong className="text-rosePrimary">Interactive Widgets:</strong> Add countdown timers to the big day, virtual gift box openings, and romantic proposal quizzes with runaway "No" buttons.
            </li>
            <li>
              <strong className="text-rosePrimary">Custom Jukebox:</strong> Set the vibe with playable background audio loops selected by you.
            </li>
          </ul>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          
          <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 text-center flex flex-col items-center shadow-sm">
            <div className="p-3.5 bg-rosePrimary/10 rounded-full text-rosePrimary mb-4 animate-pulse-glow">
              <Heart className="w-5 h-5 fill-rosePrimary" />
            </div>
            <h3 className="font-heading font-bold text-base text-wineDeep">Emotion Driven</h3>
            <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
              Every surprise page is designed to capture core memories and evoke joy for your recipient.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 text-center flex flex-col items-center shadow-sm">
            <div className="p-3.5 bg-rosePrimary/10 rounded-full text-rosePrimary mb-4 animate-pulse-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-wineDeep">Premium Design</h3>
            <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
              Clean-coded, lightweight layouts designed to render fast and look premium on any mobile screen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 text-center flex flex-col items-center shadow-sm">
            <div className="p-3.5 bg-rosePrimary/10 rounded-full text-rosePrimary mb-4 animate-pulse-glow">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-wineDeep">Absolute Privacy</h3>
            <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
              Your uploaded photographs, letters, and timelines are fully isolated and access-protected.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
