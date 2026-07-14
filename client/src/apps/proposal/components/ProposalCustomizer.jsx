import React, { useState } from 'react';
import { Heart, User, Sparkles, MapPin, Calendar, Plus, Trash2, BookOpen, Star, Music, Check } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';

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
  proposalMoments, setProposalMoments,
  proposalReasons, setProposalReasons,
  proposalLetters, setProposalLetters,
  proposalSkyMemories, setProposalSkyMemories,
  proposalQuestion, setProposalQuestion,
  proposalYesBtn, setProposalYesBtn,
  proposalThinkBtn, setProposalThinkBtn,
  proposalThinkResponse, setProposalThinkResponse,
  proposalCelebrationMusic, setProposalCelebrationMusic,
  proposalCelebrateLetter, setProposalCelebrateLetter,
  recipientName
}) {
  const [activeTab, setActiveTab] = useState('profile');

  // Timeline entry state
  const [tPhoto, setTPhoto] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tDate, setTDate] = useState('');
  const [tLoc, setTLoc] = useState('');

  // Moments entry state
  const [mPhoto, setMPhoto] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');

  // Reasons entry state
  const [rPhoto, setRPhoto] = useState('');
  const [rTagline, setRTagline] = useState('');

  // Letters entry state
  const [lTitle, setLTitle] = useState('');
  const [lContent, setLContent] = useState('');

  // Sky Memory entry state
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');

  const handleAddTimeline = (e) => {
    e.preventDefault();
    if (!tTitle.trim()) return;
    setProposalTimeline([...proposalTimeline, {
      photo: tPhoto,
      title: tTitle.trim(),
      description: tDesc.trim(),
      date: tDate,
      location: tLoc.trim()
    }]);
    setTPhoto('');
    setTTitle('');
    setTDesc('');
    setTDate('');
    setTLoc('');
  };

  const handleAddMoment = (e) => {
    e.preventDefault();
    if (!mTitle.trim()) return;
    setProposalMoments([...proposalMoments, {
      image: mPhoto,
      title: mTitle.trim(),
      description: mDesc.trim()
    }]);
    setMPhoto('');
    setMTitle('');
    setMDesc('');
  };

  const handleAddReason = (e) => {
    e.preventDefault();
    if (!rTagline.trim()) return;
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
        <button type="button" onClick={() => setActiveTab('moments')} className={tabClass('moments')}>Moments</button>
        <button type="button" onClick={() => setActiveTab('reasons')} className={tabClass('reasons')}>Reasons</button>
        <button type="button" onClick={() => setActiveTab('letters')} className={tabClass('letters')}>Letters</button>
        <button type="button" onClick={() => setActiveTab('skymemories')} className={tabClass('skymemories')}>Memory Sky</button>
        <button type="button" onClick={() => setActiveTab('proposal')} className={tabClass('proposal')}>Proposal</button>
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
                    onClick={() => setProposalStarPhoto('')}
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
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            <span>Everything That Makes Them Unique</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Fill only the fields you want. Blank fields will be dynamically skipped.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">❤️ Hobbies</label>
              <input type="text" value={proposalHobbies} onChange={(e) => setProposalHobbies(e.target.value)} placeholder="e.g. Painting, Reading novels..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">🍕 Favourite Food</label>
              <input type="text" value={proposalFavFood} onChange={(e) => setProposalFavFood(e.target.value)} placeholder="e.g. Neapolitan Pizza..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">🎵 Favourite Songs</label>
              <input type="text" value={proposalFavSongs} onChange={(e) => setProposalFavSongs(e.target.value)} placeholder="e.g. Perfect by Ed Sheeran..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">📍 Favourite Place</label>
              <input type="text" value={proposalFavPlace} onChange={(e) => setProposalFavPlace(e.target.value)} placeholder="e.g. Marine Drive, Mumbai..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">☕ Favourite Cafe</label>
              <input type="text" value={proposalFavCafe} onChange={(e) => setProposalFavCafe(e.target.value)} placeholder="e.g. Blue Tokai Coffee..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">🎬 Favourite Movie</label>
              <input type="text" value={proposalFavMovie} onChange={(e) => setProposalFavMovie(e.target.value)} placeholder="e.g. About Time..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">🌸 Favourite Flower</label>
              <input type="text" value={proposalFavFlower} onChange={(e) => setProposalFavFlower(e.target.value)} placeholder="e.g. Red Tulips..." className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            </div>
          </div>
        </div>
      )}

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
                  <button type="button" onClick={() => setProposalFirstPhoto('')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity cursor-pointer">Remove</button>
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
            <textarea value={tDesc} onChange={(e) => setTDesc(e.target.value)} placeholder="Describe this milestone..." rows="2" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ReusableUploader
                  accept="image/*"
                  multiple={false}
                  useAdminApi={false}
                  label="Upload Milestone Image"
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
                  </div>
                </div>
                <button type="button" onClick={() => setProposalTimeline(proposalTimeline.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {proposalTimeline.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No timeline items added. Hide section.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Moments */}
      {activeTab === 'moments' && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-rosePrimary tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 animate-pulse" />
            <span>Our Little Moments</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Record cozy moments (like late night calls, trips, or first fights).
          </p>

          <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Add Little Moment</span>
            <input type="text" value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="Moment Title (e.g. Late Night Calls)" required className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800" />
            <textarea value={mDesc} onChange={(e) => setMDesc(e.target.value)} placeholder="Describe this moment..." rows="2" className="w-full px-3 py-2 text-xs border bg-white rounded-xl focus:outline-none" />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ReusableUploader
                  accept="image/*"
                  multiple={false}
                  useAdminApi={false}
                  label="Upload Moment Image"
                  onUploadSuccess={(url) => setMPhoto(url)}
                />
              </div>
              {mPhoto && <img src={mPhoto} className="w-10 h-10 object-cover rounded-lg border shrink-0" />}
              <button type="button" onClick={handleAddMoment} className="px-4 py-2 bg-rosePrimary hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded-xl shadow-sm cursor-pointer shrink-0 transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {proposalMoments.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-white border rounded-2xl items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {item.image && <img src={item.image} className="w-10 h-10 object-cover rounded-lg border" />}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 font-light truncate max-w-xs">{item.description}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setProposalMoments(proposalMoments.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {proposalMoments.length === 0 && (
              <p className="text-xs text-slate-400 font-light italic text-center py-4">No moments configured.</p>
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
                <ReusableUploader
                  accept="image/*"
                  multiple={false}
                  useAdminApi={false}
                  label="Upload Reason Photo"
                  onUploadSuccess={(url) => setRPhoto(url)}
                />
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
                <button type="button" onClick={() => setProposalReasons(proposalReasons.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
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
    </div>
  );
}
