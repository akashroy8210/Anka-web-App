import React, { useState } from 'react';
import { Heart, User, Sparkles, MapPin, Calendar, Plus, Trash2, BookOpen, Star, Music, Check } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';
import { api } from '../../../services/api';

export default function ProposalCustomizer({
  proposalStarPhoto, setProposalStarPhoto,
  proposalStarName, setProposalStarName,
  proposalStarNickname, setProposalStarNickname,
  proposalStarIntro, setProposalStarIntro,
  proposalHobbies, setProposalHobbies,
  proposalFavFood, setProposalFavFood,
  proposalFavSongs, setProposalFavSongs,
  proposalFavPlace, setProposalFavPlace,
  proposalFavCafe, setProposalFavCafe,
  proposalFavMovie, setProposalFavMovie,
  proposalFavFlower, setProposalFavFlower,
  proposalFirstPhoto, setProposalFirstPhoto,
  proposalFirstDate, setProposalFirstDate,
  proposalFirstLocation, setProposalFirstLocation,
  proposalFirstTitle, setProposalFirstTitle,
  proposalFirstDesc, setProposalFirstDesc,
  proposalTimeline, setProposalTimeline,
  proposalReasons, setProposalReasons,
  proposalLetters, setProposalLetters,
  proposalSkyMemories, setProposalSkyMemories,
  proposalQuestion, setProposalQuestion,
  proposalYesBtn, setProposalYesBtn,
  proposalThinkBtn, setProposalThinkBtn,
  proposalThinkResponse, setProposalThinkResponse,
  proposalCelebrationMusic, setProposalCelebrationMusic,
  proposalCelebrateLetter, setProposalCelebrateLetter,
  proposalDreams, setProposalDreams,
  tierName, categoryTiers, handleUpgradeToPremium,
  recipientName
}) {
  const [activeTab, setActiveTab] = useState('profile');

  // Resolve DB limits dynamically
  const activeTier = (categoryTiers || []).find(t => t.name.toLowerCase() === (tierName || '').toLowerCase());
  const limits = activeTier?.limits || {};

  // Timeline entry state
  const [tPhoto, setTPhoto] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tDate, setTDate] = useState('');
  const [tLoc, setTLoc] = useState('');
  const [tQuestion, setTQuestion] = useState('');
  const [tAnswer, setTAnswer] = useState('');

  // Reasons entry state
  const [rPhoto, setRPhoto] = useState('');
  const [rTagline, setRTagline] = useState('');

  // Letters entry state
  const [lTitle, setLTitle] = useState('');
  const [lContent, setLContent] = useState('');

  // Sky Memory entry state
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');

  // Dreams entry state
  const [dCategory, setDCategory] = useState('Travel ✈️');
  const [dTitle, setDTitle] = useState('');
  const [dDesc, setDDesc] = useState('');

  const handleAddDream = (e) => {
    e.preventDefault();
    if (!dTitle.trim()) return;
    setProposalDreams([...(proposalDreams || []), {
      category: dCategory,
      title: dTitle.trim(),
      description: dDesc.trim()
    }]);
    setDTitle('');
    setDDesc('');
  };

  const handleAddTimeline = (e) => {
    e.preventDefault();
    if (!tTitle.trim()) return;

    if (tQuestion.trim() && !tAnswer.trim()) {
      alert('Please specify the Lock Answer if a Lock Question is set!');
      return;
    }

    const maxTimeline = limits.timelineLimit || 3;
    if (proposalTimeline.length >= maxTimeline) {
      alert(`Upgrade Required\n\nYou've reached the timeline limit (${maxTimeline}) for the Basic plan. Upgrade to Premium to upload up to 10 memories and support video uploads!`);
      return;
    }

    setProposalTimeline([...proposalTimeline, {
      photo: tPhoto,
      title: tTitle.trim(),
      description: tDesc.trim(),
      date: tDate,
      location: tLoc.trim(),
      question: tQuestion,
      answer: tAnswer
    }]);
    setTPhoto('');
    setTTitle('');
    setTDesc('');
    setTDate('');
    setTLoc('');
    setTQuestion('');
    setTAnswer('');
  };

  const handleAddReason = (e) => {
    e.preventDefault();
    if (!rTagline.trim()) return;

    const maxReasons = limits.reasonsLimit || 6;
    if (proposalReasons.length >= maxReasons) {
      alert(`Upgrade Required\n\nYou've reached the reasons limit (${maxReasons}) for the Basic plan. Upgrade to Premium to add unlimited reasons and upload images!`);
      return;
    }

    setProposalReasons([...proposalReasons, {
      photo: rPhoto,
      tagline: rTagline.trim()
    }]);
    setRPhoto('');
    setRTagline('');
  };

  const handleAddLetter = (e) => {
    e.preventDefault();
    if (!lContent.trim()) return;
    setProposalLetters([...proposalLetters, {
      title: lTitle.trim() || `Letter #${proposalLetters.length + 1}`,
      content: lContent.trim()
    }]);
    setLTitle('');
    setLContent('');
  };

  const handleAddSkyMemory = (e) => {
    e.preventDefault();
    if (!sTitle.trim()) return;

    const maxStars = limits.starsLimit || 5;
    if (proposalSkyMemories.length >= maxStars) {
      alert(`Upgrade Required\n\nYou've reached the Memory Stars limit (${maxStars}) for the Basic plan. Upgrade to Premium to add unlimited stars!`);
      return;
    }

    setProposalSkyMemories([...proposalSkyMemories, {
      title: sTitle.trim(),
      description: sDesc.trim()
    }]);
    setSTitle('');
    setSDesc('');
  };

  const tabClass = (tab) => `px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
    activeTab === tab 
      ? 'bg-rosePrimary text-white shadow-sm' 
      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
  }`;

  return (
    <div className="space-y-6 text-left">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-rosePrimary/5">
        <button type="button" onClick={() => setActiveTab('profile')} className={tabClass('profile')}>Profile</button>
        <button type="button" onClick={() => setActiveTab('favorites')} className={tabClass('favorites')}>Favorites</button>
        <button type="button" onClick={() => setActiveTab('firsttime')} className={tabClass('firsttime')}>First Meet</button>
        <button type="button" onClick={() => setActiveTab('timeline')} className={tabClass('timeline')}>Timeline</button>
        <button type="button" onClick={() => setActiveTab('reasons')} className={tabClass('reasons')}>Reasons</button>
        <button type="button" onClick={() => setActiveTab('letters')} className={tabClass('letters')}>Letters</button>
        <button type="button" onClick={() => setActiveTab('skymemories')} className={tabClass('skymemories')}>Memory Sky</button>
        <button type="button" onClick={() => setActiveTab('proposal')} className={tabClass('proposal')}>Proposal</button>
        <button type="button" onClick={() => setActiveTab('dreams')} className={tabClass('dreams')}>Future Dreams</button>
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>Profile settings</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  value={proposalStarName}
                  onChange={(e) => setProposalStarName(e.target.value)}
                  placeholder="e.g. Ananya Sen"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  value={proposalStarNickname}
                  onChange={(e) => setProposalStarNickname(e.target.value)}
                  placeholder="e.g. Anu"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Star Introduction</label>
                <textarea
                  value={proposalStarIntro}
                  onChange={(e) => setProposalStarIntro(e.target.value)}
                  placeholder="Introduce the star of your story..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 leading-relaxed"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Star Profile Photo</label>
              <ReusableUploader
                accept="image/*"
                multiple={false}
                useAdminApi={false}
                label="Upload Star Profile Image"
                onUploadSuccess={(url) => setProposalStarPhoto(url)}
              />
              {proposalStarPhoto && (
                <div className="mt-3 relative w-32 h-32 rounded-2xl overflow-hidden border border-rosePrimary/10 group">
                  <img src={proposalStarPhoto} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={async () => {
                      if (proposalStarPhoto) {
                        try {
                          await api.deleteFileByUrl(proposalStarPhoto);
                        } catch (err) {
                          console.warn('Could not delete image from Cloudinary', err);
                        }
                      }
                      setProposalStarPhoto('');
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (() => {
        const filledFavsCount = [
          proposalHobbies, proposalFavFood, proposalFavSongs,
          proposalFavPlace, proposalFavCafe, proposalFavMovie, proposalFavFlower
        ].filter(val => !!val?.trim()).length;
        const maxFavorites = limits.favoritesLimit || 6;

        const renderFav = (label, value, onChange, placeholder, isFullWidth = false) => {
          const isLocked = !value?.trim() && filledFavsCount >= maxFavorites;
          return (
            <div className={isFullWidth ? "md:col-span-2" : ""}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
              {isLocked ? (
                <div className="relative overflow-hidden rounded-xl border border-dashed border-rosePrimary/20 bg-slate-50/50 p-2.5 px-3 flex items-center justify-between min-h-[42px]">
                  <span className="text-[10px] text-slate-450 italic flex items-center gap-1">🔒 Locked (Basic limit: {maxFavorites} Favorites)</span>
                  <button
                    type="button"
                    onClick={handleUpgradeToPremium}
                    className="text-[9px] bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white px-2 py-1 rounded-lg font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Upgrade
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              )}
            </div>
          );
        };

        return (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span>Everything That Makes Them Unique</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">
              Fill only the fields you want. Blank fields will be dynamically skipped.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFav("❤️ Hobbies", proposalHobbies, setProposalHobbies, "e.g. Painting, Reading novels...")}
              {renderFav("🍕 Favourite Dessert", proposalFavFood, setProposalFavFood, "e.g. Neapolitan Pizza...")}
              {renderFav("🎵 Favourite Songs", proposalFavSongs, setProposalFavSongs, "e.g. Perfect by Ed Sheeran...")}
              {renderFav("📍 Favourite Place", proposalFavPlace, setProposalFavPlace, "e.g. Marine Drive, Mumbai...")}
              {renderFav("☕ Favourite Cafe", proposalFavCafe, setProposalFavCafe, "e.g. Blue Tokai Coffee...")}
              {renderFav("🎬 Favourite Movie", proposalFavMovie, setProposalFavMovie, "e.g. About Time...")}
              {renderFav("🌸 Favourite Flower", proposalFavFlower, setProposalFavFlower, "e.g. Red TulTulips...", true)}
            </div>
          </div>
        );
      })()}

      {/* Tab: First Time */}
      {activeTab === 'firsttime' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>The First Time I Saw You</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Configure the first memory. If the photo is left blank, this entire transition section is hidden dynamically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Memory Title</label>
                <input type="text" value={proposalFirstTitle} onChange={(e) => setProposalFirstTitle(e.target.value)} placeholder="e.g. First Sight at Cafe" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1"><Calendar className="w-3 h-3 text-rosePrimary" /> Date (Optional)</label>
                  <input type="text" value={proposalFirstDate} onChange={(e) => setProposalFirstDate(e.target.value)} placeholder="e.g. Oct 12, 2024" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-rosePrimary" /> Location (Optional)</label>
                  <input type="text" value={proposalFirstLocation} onChange={(e) => setProposalFirstLocation(e.target.value)} placeholder="e.g. Delhi University" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Memory Description</label>
                <textarea
                  value={proposalFirstDesc}
                  onChange={(e) => setProposalFirstDesc(e.target.value)}
                  placeholder="Describe your first impression..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 leading-relaxed"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">First Photo (Together / Star)</label>
              <ReusableUploader
                accept="image/*"
                multiple={false}
                useAdminApi={false}
                label="Upload First Sight Photo"
                onUploadSuccess={(url) => setProposalFirstPhoto(url)}
              />
              {proposalFirstPhoto && (
                <div className="mt-3 relative w-32 h-32 rounded-2xl overflow-hidden border border-rosePrimary/10 group">
                  <img src={proposalFirstPhoto} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={async () => {
                      if (proposalFirstPhoto) {
                        try {
                          await api.deleteFileByUrl(proposalFirstPhoto);
                        } catch (err) {
                          console.warn('Could not delete image from Cloudinary', err);
                        }
                      }
                      setProposalFirstPhoto('');
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Our Journey Together Timeline</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Create an unlimited interactive path of milestones. Blank fields within a timeline item will be skipped.
          </p>
          
          <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Timeline Milestone</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input type="text" value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="Milestone Title (e.g. First Date)" required className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={tDate} onChange={(e) => setTDate(e.target.value)} placeholder="Date (e.g. 15th Jan)" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
                <input type="text" value={tLoc} onChange={(e) => setTLoc(e.target.value)} placeholder="Location" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input type="text" value={tQuestion} onChange={(e) => setTQuestion(e.target.value)} placeholder="Lock Question (Optional)" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
              </div>
              <div>
                <input type="text" value={tAnswer} onChange={(e) => setTAnswer(e.target.value)} placeholder="Lock Answer (Required if question set)" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <textarea value={tDesc} onChange={(e) => setTDesc(e.target.value)} placeholder="Describe this milestone..." rows="2" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ReusableUploader
                  accept={limits.timelineLimit > 3 ? "image/*,video/*" : "image/*"}
                  multiple={false}
                  useAdminApi={false}
                  label="Upload Milestone Image/Video"
                  onUploadSuccess={(url) => setTPhoto(url)}
                />
              </div>
              {tPhoto && <img src={tPhoto} className="w-10 h-10 object-cover rounded-lg border shrink-0" />}
              <button type="button" onClick={handleAddTimeline} className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer shrink-0 transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
          </div>

          {/* List existing */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {proposalTimeline.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-white border rounded-2xl items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {item.photo && <img src={item.photo} className="w-10 h-10 object-cover rounded-lg border" />}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 font-light truncate max-w-xs">{item.description}</p>
                    <span className="text-[9px] font-mono text-rosePrimary">{item.date} {item.location && `| ${item.location}`}</span>
                    {item.question && (
                      <p className="text-[9px] text-rosePrimary font-bold truncate mt-1">
                        🔒 Q: {item.question} (A: {item.answer})
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const itemToRemove = proposalTimeline[idx];
                    if (itemToRemove && itemToRemove.photo) {
                      try {
                        await api.deleteFileByUrl(itemToRemove.photo);
                      } catch (err) {
                        console.warn('Could not delete image from Cloudinary', err);
                      }
                    }
                    setProposalTimeline(proposalTimeline.filter((_, i) => i !== idx));
                  }}
                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {proposalTimeline.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No timeline items added. Hide section.</p>
            )}
          </div>
        </div>
      )}



      {/* Tab: Reasons */}
      {activeTab === 'reasons' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Reasons Why I Love You</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Add cards showing a photo and tagline outlining why they are special (e.g. Your Smile).
          </p>

          <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Reason Card</span>
            <input type="text" value={rTagline} onChange={(e) => setRTagline(e.target.value)} placeholder="Tagline (e.g. Your Kindness ❤️)" required className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {(!limits.reasonsLimit || limits.reasonsLimit <= 6) ? (
                  <div className="flex items-center justify-between p-3 border border-dashed rounded-xl bg-slate-50 text-[10px] text-slate-400 italic">
                    <span>🔒 Photo upload requires Premium (Basic is text-only)</span>
                    <button 
                      type="button" 
                      onClick={handleUpgradeToPremium} 
                      className="bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white font-bold text-[9px] px-2 py-1 rounded-lg uppercase tracking-wide cursor-pointer transition-all"
                    >
                      Upgrade
                    </button>
                  </div>
                ) : (
                  <ReusableUploader
                    accept="image/*"
                    multiple={false}
                    useAdminApi={false}
                    label="Upload Reason Photo"
                    onUploadSuccess={(url) => setRPhoto(url)}
                  />
                )}
              </div>
              {rPhoto && <img src={rPhoto} className="w-10 h-10 object-cover rounded-lg border shrink-0" />}
              <button type="button" onClick={handleAddReason} className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer shrink-0 transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {proposalReasons.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-white border rounded-2xl items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {item.photo && <img src={item.photo} className="w-10 h-10 object-cover rounded-lg border" />}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{item.tagline}</h5>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const itemToRemove = proposalReasons[idx];
                    if (itemToRemove && itemToRemove.photo) {
                      try {
                        await api.deleteFileByUrl(itemToRemove.photo);
                      } catch (err) {
                        console.warn('Could not delete image from Cloudinary', err);
                      }
                    }
                    setProposalReasons(proposalReasons.filter((_, i) => i !== idx));
                  }}
                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {proposalReasons.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No reasons configured.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Letters */}
      {activeTab === 'letters' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Letters Never Sent</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Write emotional letters that load with typewriter animations inside a virtual envelope.
          </p>

          <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Letter</span>
            <input type="text" value={lTitle} onChange={(e) => setLTitle(e.target.value)} placeholder="Letter Title (e.g. The first time we fought)" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
            <textarea value={lContent} onChange={(e) => setLContent(e.target.value)} placeholder="Write your letter content..." required rows="4" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 leading-relaxed font-serif" />
            <div className="flex justify-end">
              <button type="button" onClick={handleAddLetter} className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Letter</button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {proposalLetters.map((item, idx) => (
              <div key={idx} className="p-3 bg-white border rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 font-light truncate max-w-xs">{item.content}</p>
                </div>
                <button type="button" onClick={() => setProposalLetters(proposalLetters.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {proposalLetters.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No letters configured.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Memory Sky */}
      {activeTab === 'skymemories' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 animate-spin" />
            <span>Memory Sky Stars</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Clicking a star in the magical sky opens a memory dialog card and returns to position.
          </p>

          <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Star Memory</span>
            <input type="text" value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="Star Memory Title" required className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
            <textarea value={sDesc} onChange={(e) => setSDesc(e.target.value)} placeholder="Memory Description..." required rows="2" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            <div className="flex justify-end">
              <button type="button" onClick={handleAddSkyMemory} className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Star</button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {proposalSkyMemories.map((item, idx) => (
              <div key={idx} className="p-3 bg-white border rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 font-light truncate max-w-xs">{item.description}</p>
                </div>
                <button type="button" onClick={() => setProposalSkyMemories(proposalSkyMemories.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {proposalSkyMemories.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No sky stars configured.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Proposal & Celebration */}
      {activeTab === 'proposal' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rosePrimary animate-pulse" />
            <span>Proposal settings</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Proposal Question</label>
                <input type="text" value={proposalQuestion} onChange={(e) => setProposalQuestion(e.target.value)} placeholder="Will You Be Mine Forever?" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">YES Button Text</label>
                  <input type="text" value={proposalYesBtn} onChange={(e) => setProposalYesBtn(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Think Button Text</label>
                  <input type="text" value={proposalThinkBtn} onChange={(e) => setProposalThinkBtn(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl bg-white" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Let Me Think Button Response Message</label>
                <input type="text" value={proposalThinkResponse} onChange={(e) => setProposalThinkResponse(e.target.value)} placeholder="e.g. Take all the time you need, my heart is always yours... 🤍" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1"><Music className="w-3.5 h-3.5 text-rosePrimary" /> Celebration Music URL (Optional)</label>
                <input type="text" value={proposalCelebrationMusic} onChange={(e) => setProposalCelebrationMusic(e.target.value)} placeholder="Paste MP3 file link..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Final Post-Yes Celebration Letter</label>
                <textarea
                  value={proposalCelebrateLetter}
                  onChange={(e) => setProposalCelebrateLetter(e.target.value)}
                  placeholder="This letter will unfold right after they click YES and celebration starts..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tab: Future Dreams */}
      {activeTab === 'dreams' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rosePrimary animate-pulse" />
            <span>Future Dreams Board</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Co-create a list of future plans, travel destinations, and shared goals to achieve together.
          </p>

          {!limits.hasFutureDreams ? (
            <div className="relative overflow-hidden rounded-[24px] border border-rosePrimary/10 p-6 text-center bg-slate-50/50 backdrop-blur-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-rosePrimary/10 flex items-center justify-center mx-auto text-rosePrimary">
                <Star className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h5 className="text-sm font-bold text-wineDeep">Future Dreams is a Premium Feature</h5>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                  Unlock an interactive milestone board for couples to map out their future goals, travels, and bucket list after they click "YES".
                </p>
              </div>
              <button
                type="button"
                onClick={handleUpgradeToPremium}
                className="px-6 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
              >
                Upgrade to Premium 👑
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Future Dream Goal</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                    <select
                      value={dCategory}
                      onChange={(e) => setDCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none text-slate-800"
                    >
                      <option value="Travel ✈️">Travel ✈️</option>
                      <option value="Adventure 🏔️">Adventure 🏔️</option>
                      <option value="Home 🏡">Home 🏡</option>
                      <option value="Career 💼">Career 💼</option>
                      <option value="Other 💖">Other 💖</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Dream Title</label>
                    <input
                      type="text"
                      value={dTitle}
                      onChange={(e) => setDTitle(e.target.value)}
                      placeholder="e.g. Visit Switzerland together"
                      required
                      className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Description</label>
                  <textarea
                    value={dDesc}
                    onChange={(e) => setDDesc(e.target.value)}
                    placeholder="Describe this beautiful dream..."
                    rows="2"
                    className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddDream}
                    className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Dream
                  </button>
                </div>
              </div>

              {/* List existing */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(proposalDreams || []).map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-white border rounded-2xl items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[9px] bg-rosePrimary/10 text-rosePrimary font-bold px-2 py-0.5 rounded-full">{item.category}</span>
                      <h5 className="text-xs font-bold text-slate-800 mt-1">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProposalDreams(proposalDreams.filter((_, i) => i !== idx))}
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!proposalDreams || proposalDreams.length === 0) && (
                  <p className="text-xs text-slate-400 font-light italic text-center py-4">No dreams configured. Couple can also add them live!</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
