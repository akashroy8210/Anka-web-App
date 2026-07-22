import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import PremiumButton from '../../../components/shared/PremiumButton';
import { api } from '../../../services/api.service';

export default function CelebrationSection() {
  const { config, triggerCelebration, instance, instanceId, isAdminPreview } = useProposal();

  const [dTitle, setDTitle] = useState('');
  const [dDesc, setDDesc] = useState('');
  const [dCategory, setDCategory] = useState('Travel ✈️');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dreams = config.proposalDreams || [];
  const isPremium = (instance?.tier || '').toLowerCase() === 'premium';

  const handleAddDreamLive = async (e) => {
    e.preventDefault();
    if (!dTitle.trim()) return;
    if (isAdminPreview) {
      alert("This is an admin preview. Saving is disabled.");
      return;
    }

    setIsSubmitting(true);
    const newDream = {
      category: dCategory,
      title: dTitle.trim(),
      description: dDesc.trim()
    };

    const updatedDreams = [...dreams, newDream];
    try {
      await api.submitRecipientResponse(instanceId, {
        proposalDreams: updatedDreams
      });
      setDTitle('');
      setDDesc('');
    } catch (err) {
      console.error("Failed to add dream:", err);
      alert("Failed to save the dream.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDreamLive = async (idxToDelete) => {
    if (isAdminPreview) return;
    const updatedDreams = dreams.filter((_, idx) => idx !== idxToDelete);
    try {
      await api.submitRecipientResponse(instanceId, {
        proposalDreams: updatedDreams
      });
    } catch (err) {
      console.error("Failed to delete dream:", err);
    }
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 md:space-y-8 select-none text-center">
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 w-full flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-inner">
          <Check className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-black text-rose-100 tracking-tight filter drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            Celebration Time!
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
            Our hearts are officially locked forever ❤️
          </p>
        </div>

        {config.proposalCelebrateLetter && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FCF9F2] text-slate-800 p-6 md:p-8 rounded-[32px] text-left border shadow-2xl font-serif max-w-md mx-auto leading-relaxed text-xs whitespace-pre-line border-[#EBE3D3] select-text selection:bg-rose-200"
          >
            {config.proposalCelebrateLetter}
          </motion.div>
        )}

        <PremiumButton
          variant="white"
          onClick={triggerCelebration}
          className="group !px-7 !py-2.5 hover:!bg-white/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
          <span>Celebrate Again</span>
        </PremiumButton>

        {/* Future Dreams Checklist (Premium feature unlocked after YES) */}
        {isPremium && (
          <div className="w-full mt-8 p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-6 text-left relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-heading font-black text-rose-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-450 animate-pulse" />
                <span>Our Future Dreams Checklist</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-light leading-relaxed">
                Add plans, travel destinations, or anything we dream of doing together!
              </p>
            </div>

            {/* List of dreams */}
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-1">
              {dreams.map((dream, idx) => (
                <div key={idx} className="relative group bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between hover:border-pink-500/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-200 border border-rose-500/20">{dream.category}</span>
                      {!isAdminPreview && (
                        <button
                          onClick={() => handleDeleteDreamLive(idx)}
                          className="opacity-0 group-hover:opacity-100 text-[9px] text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer uppercase font-black tracking-wider"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">{dream.title}</h4>
                    {dream.description && (
                      <p className="text-[10px] text-slate-400 font-light mt-1 leading-relaxed italic">
                        "{dream.description}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {dreams.length === 0 && (
                <div className="col-span-full py-8 text-center text-[10px] text-slate-500 italic font-light">
                  Our bucket list is empty. Write our first dream below! ✨
                </div>
              )}
            </div>

            {/* Add form */}
            <form onSubmit={handleAddDreamLive} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">Co-write a Dream</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="text-[9px] text-slate-450 font-bold block mb-1">Category</label>
                  <select
                    value={dCategory}
                    onChange={(e) => setDCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="Travel ✈️">Travel ✈️</option>
                    <option value="Adventure 🏔️">Adventure 🏔️</option>
                    <option value="Home 🏡">Home 🏡</option>
                    <option value="Career 💼">Career 💼</option>
                    <option value="Other 💖">Other 💖</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[9px] text-slate-450 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    value={dTitle}
                    onChange={(e) => setDTitle(e.target.value)}
                    placeholder="e.g. Visit Switzerland together"
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-slate-450 font-bold block mb-1">Our Thoughts / Notes</label>
                <textarea
                  value={dDesc}
                  onChange={(e) => setDDesc(e.target.value)}
                  placeholder="e.g. Strolling along Paris streets..."
                  rows="2"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-[10px] uppercase rounded-xl tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Dream"}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
