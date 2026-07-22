import React from 'react';
import { Heart, Plus, Trash2, Sparkles, Mic } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';

export default function VirtualDateCustomizer({
  vWhisper1,
  setVWhisper1,
  vWhisper2,
  setVWhisper2,
  vWhisper3,
  setVWhisper3,
  vTimeline,
  setVTimeline,
  newVTimelineDate,
  setNewVTimelineDate,
  newVTimelineTitle,
  setNewVTimelineTitle,
  newVTimelineImage,
  setNewVTimelineImage,
  newVTimelineDesc,
  setNewVTimelineDesc,
  generatingVTimelineAI,
  setGeneratingVTimelineAI,
  vThingsILove,
  setVThingsILove,
  vFutureDreams,
  setVFutureDreams,
  vVoiceIntro,
  setVVoiceIntro,
  vVoiceUrl,
  setVVoiceUrl,
  isRecording,
  recordingSeconds,
  startRecording,
  stopRecording,
  previewAudioUrl,
  uploadingVoice,
  uploadRecordedVoice,
  recipientName,
  getDreamIcon,
  formatSeconds,
  tierName,
  categoryTiers,
  handleUpgradeToPremium,
  api
}) {
  const activeTier = (categoryTiers || []).find(t => t.name.toLowerCase() === (tierName || '').toLowerCase());
  const limits = activeTier?.limits || {};
  return (
    <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
      <h3 className="font-heading font-extrabold text-lg md:text-xl text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
        <Heart className="w-5 h-5 text-rosePrimary animate-pulse" />
        <span>Virtual Date Journey Specific Settings ❤️</span>
      </h3>

      {/* Starlit Whispers Section */}
      <div className="space-y-4">
        <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">💫 Custom Starlit Whispers</span>
        <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
          These romantic whispers will float across the night sky as your partner scrolls through your surprise journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #1</label>
            <input
              type="text"
              value={vWhisper1}
              onChange={(e) => setVWhisper1(e.target.value)}
              placeholder="e.g. I love you to the moon and back ❤️"
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #2</label>
            <input
              type="text"
              value={vWhisper2}
              onChange={(e) => setVWhisper2(e.target.value)}
              placeholder="e.g. You make every single day brighter ✨"
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Whisper #3</label>
            <input
              type="text"
              value={vWhisper3}
              onChange={(e) => setVWhisper3(e.target.value)}
              placeholder="e.g. Always here for you, bubu 💫"
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Timeline Memories Section */}
      <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block">📅 Relationship Timeline ({vTimeline.length} / {limits.timelineLimit || 3})</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Max {limits.timelineLimit || 3} memories</span>
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
          Build a dynamic relationship story timeline. Add memories with titles, descriptions, dates, and photos!
        </p>

        {/* Add memory form */}
        {vTimeline.length < (limits.timelineLimit || 3) ? (
          <div className="bg-rose-50/20 border border-rosePrimary/10 rounded-2xl p-5 space-y-4 text-left">
            <span className="text-xs font-black text-rosePrimary uppercase tracking-widest block">Add New Timeline Memory</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Date / Label</label>
                <input
                  type="text"
                  value={newVTimelineDate}
                  onChange={(e) => setNewVTimelineDate(e.target.value)}
                  placeholder="e.g. July 12 or Our First Meet"
                  className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Memory Title</label>
                <input
                  type="text"
                  value={newVTimelineTitle}
                  onChange={(e) => setNewVTimelineTitle(e.target.value)}
                  placeholder="e.g. Cozy Cafe Date"
                  className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Memory Photo/Video (Upload or URL)</label>
              
              <div className="grid grid-cols-1 gap-3">
                <ReusableUploader
                  accept={limits.timelineLimit > 3 ? "image/*,video/*" : "image/*"}
                  label="Upload Media File"
                  useAdminApi={true}
                  onUploadSuccess={(url) => setNewVTimelineImage(url)}
                />
                <input
                  type="url"
                  value={newVTimelineImage}
                  onChange={(e) => setNewVTimelineImage(e.target.value)}
                  placeholder="Or paste direct media URL link here..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase block">Memory Description</label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newVTimelineTitle) {
                      alert('Please enter a memory title first to generate an emotional description!');
                      return;
                    }
                    setGeneratingVTimelineAI(true);
                    try {
                      const data = await api.generateAIMemoryDescription(newVTimelineTitle, recipientName);
                      if (data.success) {
                        setNewVTimelineDesc(data.description);
                      } else {
                        alert(data.message || 'AI generation failed.');
                      }
                    } catch (err) {
                      alert('Error generating AI description.');
                    } finally {
                      setGeneratingVTimelineAI(false);
                    }
                  }}
                  disabled={generatingVTimelineAI}
                  className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 text-xs font-bold uppercase rounded-lg border border-yellow-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-spin-slow" />
                  <span>{generatingVTimelineAI ? 'Generating...' : '✨ AI Generate Description'}</span>
                </button>
              </div>
              <textarea
                rows="3"
                value={newVTimelineDesc}
                onChange={(e) => setNewVTimelineDesc(e.target.value)}
                placeholder="Write custom description or click the AI button above..."
                className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newVTimelineTitle || !newVTimelineImage || !newVTimelineDesc || !newVTimelineDate) {
                  alert('Please complete all Memory fields (Date, Title, Photo/Video, and Description) before adding!');
                  return;
                }
                const limit = limits.timelineLimit || 3;
                if (vTimeline.length >= limit) {
                  alert(`Upgrade Required\n\nYou've reached the timeline limit of ${limit} memories. Upgrade to Premium to upload up to 10 memories and support video uploads!`);
                  return;
                }
                setVTimeline([...vTimeline, { 
                  date: newVTimelineDate, 
                  title: newVTimelineTitle, 
                  imageUrl: newVTimelineImage, 
                  description: newVTimelineDesc 
                }]);
                setNewVTimelineDate('');
                setNewVTimelineTitle('');
                setNewVTimelineImage('');
                setNewVTimelineDesc('');
              }}
              className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory Node to Timeline</span>
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-rosePrimary/20 bg-slate-50 p-4 text-center space-y-2">
            <span className="text-xs text-slate-500 font-bold block">🔒 Timeline Limit Reached ({vTimeline.length} / {limits.timelineLimit || 3})</span>
            <p className="text-[10px] text-slate-400 font-light max-w-sm mx-auto">
              Upgrade to Premium plan to add up to 10 timeline memories and unlock video support!
            </p>
            <button
              type="button"
              onClick={handleUpgradeToPremium}
              className="px-4 py-1.5 bg-rosePrimary hover:bg-wineDeep text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer"
            >
              Upgrade to Premium
            </button>
          </div>
        )}

        {/* Memories Grid list */}
        {vTimeline.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {vTimeline.map((mem, idx) => (
              <div key={idx} className="bg-white border border-rosePrimary/10 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 relative group text-left">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-rosePrimary/10 relative">
                  <img src={mem.imageUrl} alt="Memory Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 z-10 bg-rosePrimary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex-grow overflow-hidden pr-8">
                  <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">{mem.date}</span>
                  <h5 className="font-heading font-extrabold text-sm text-wineDeep truncate mt-0.5">{mem.title}</h5>
                  <p className="text-xs text-slate-500 truncate mt-1">{mem.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVTimeline(vTimeline.filter((_, i) => i !== idx))}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer border border-rosePrimary/10"
                  title="Delete Node"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-sm text-slate-400 italic font-light bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No relationship timeline memories added yet. Add memories using the form above!
          </p>
        )}
      </div>

      {/* Things I Love Section */}
      <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
        <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">💖 Things I Love About You (12 Reasons)</span>
        <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
          Customize the 12 reasons why your partner is so special to you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vThingsILove.map((reason, idx) => {
            const isReasonLocked = idx >= (limits.reasonsLimit || 6);
            return isReasonLocked ? (
              <div key={reason.id || idx} className="p-5 rounded-2xl border border-dashed border-rosePrimary/20 bg-slate-50/50 flex flex-col justify-center items-center text-center space-y-2 min-h-[160px]">
                <span className="text-xs font-bold text-wineDeep">🔒 Reason #{idx + 1} Locked</span>
                <p className="text-[10px] text-slate-400 font-light max-w-[200px]">
                  Basic plan is limited to {limits.reasonsLimit || 6} reasons. Upgrade to Premium for all 12 reasons!
                </p>
                <button
                  type="button"
                  onClick={handleUpgradeToPremium}
                  className="text-[9px] bg-rosePrimary hover:bg-wineDeep text-white px-3 py-1 rounded-lg font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Upgrade
                </button>
              </div>
            ) : (
              <div key={reason.id || idx} className="p-4 bg-white border border-rosePrimary/10 rounded-2xl space-y-3 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-rose-500/5 pb-2">
                  <span className="text-[11px] font-bold text-wineDeep uppercase tracking-wider">Reason #{idx + 1}</span>
                  <span className="text-[10px] bg-rose-50 text-rosePrimary px-2 py-0.5 rounded-full font-bold">Item {reason.id}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Reason Title</label>
                  <input
                    type="text"
                    value={reason.title || ''}
                    onChange={(e) => {
                      const updated = [...vThingsILove];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setVThingsILove(updated);
                    }}
                    placeholder="e.g. Your beautiful smile"
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Reason Description</label>
                  <textarea
                    rows="2"
                    value={reason.desc || ''}
                    onChange={(e) => {
                      const updated = [...vThingsILove];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setVThingsILove(updated);
                    }}
                    placeholder="Type why you love this..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Future Dreams Section */}
      <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
        <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">🚀 Our Future Dreams</span>
        <p className="text-xs md:text-sm text-slate-500 font-light leading-normal">
          Customize the 6 dreams you want to build and achieve together. Emojis will automatically update based on the title keywords!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vFutureDreams.map((dream, idx) => {
            const iconPreview = getDreamIcon(dream.title);
            const isDreamLocked = idx >= (limits.dreamsLimit || 3);
            return isDreamLocked ? (
              <div key={dream.id || idx} className="p-5 rounded-2xl border border-dashed border-rosePrimary/20 bg-slate-50/50 flex flex-col justify-center items-center text-center space-y-2 min-h-[160px]">
                <span className="text-xs font-bold text-wineDeep">🔒 Dream #{idx + 1} Locked</span>
                <p className="text-[10px] text-slate-400 font-light max-w-[200px]">
                  Basic plan is limited to {limits.dreamsLimit || 3} dreams. Upgrade to Premium to customize all 6 dreams!
                </p>
                <button
                  type="button"
                  onClick={handleUpgradeToPremium}
                  className="text-[9px] bg-rosePrimary hover:bg-wineDeep text-white px-3 py-1 rounded-lg font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Upgrade
                </button>
              </div>
            ) : (
              <div key={dream.id || idx} className="p-4 bg-white border border-rosePrimary/10 rounded-2xl space-y-3 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-rose-500/5 pb-2">
                  <span className="text-[11px] font-bold text-wineDeep uppercase tracking-wider flex items-center gap-1.5">
                    <span>Dream #{idx + 1}</span>
                    <span className="text-sm">{iconPreview}</span>
                  </span>
                  <span className="text-[10px] bg-rose-50 text-rosePrimary px-2 py-0.5 rounded-full font-bold">Item {dream.id}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Dream Title</label>
                  <input
                    type="text"
                    value={dream.title || ''}
                    onChange={(e) => {
                      const updated = [...vFutureDreams];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setVFutureDreams(updated);
                    }}
                    placeholder="e.g. Travel to Paris"
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Dream Description</label>
                  <textarea
                    rows="2"
                    value={dream.desc || ''}
                    onChange={(e) => {
                      const updated = [...vFutureDreams];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setVFutureDreams(updated);
                    }}
                    placeholder="Describe this dream together..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Note Settings */}
      <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
        <span className="text-sm font-black text-rosePrimary uppercase tracking-widest block mb-1">🎙️ Voice Note Settings</span>
        
        {!limits.hasVoiceNotes ? (
          <div className="relative overflow-hidden rounded-[24px] border border-rosePrimary/15 p-8 text-center bg-slate-50/50 backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-rosePrimary/10 flex items-center justify-center mx-auto text-rosePrimary">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h5 className="text-sm font-bold text-wineDeep">Voice Notes is a Premium Feature</h5>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                Record your voice or upload audio files to let them listen to an intimate voice note during their virtual date experience.
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
          <>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Voice Note Intro Text</label>
              <textarea
                rows="3"
                value={vVoiceIntro}
                onChange={(e) => setVVoiceIntro(e.target.value)}
                placeholder="e.g. Put on your headphones, close your eyes, and play this..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
            </div>

            <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl space-y-4 text-left">
              <span className="text-xs font-bold text-wineDeep uppercase tracking-wider block">Voice Note Audio Source</span>
              
              {vVoiceUrl && (
                <div className="p-3 bg-green-50/80 border border-green-200/50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-green-700 uppercase block">Active Voice Note:</span>
                  <div className="flex items-center justify-between gap-2">
                    <audio src={vVoiceUrl} controls className="h-8 max-w-full" />
                    <button
                      type="button"
                      onClick={() => setVVoiceUrl('')}
                      className="p-1.5 bg-red-50 text-red-655 hover:bg-red-100 rounded-lg transition-colors cursor-pointer text-xs"
                      title="Remove Voice Note"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Record Audio */}
                <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Option A: Record Live Voice</span>
                    <p className="text-[11px] text-slate-400 font-light leading-normal">
                      Record a sweet message using your microphone right now.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {isRecording ? (
                      <div className="flex items-center justify-between bg-red-50 border border-red-200 p-2.5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                          <span className="text-xs font-bold text-red-600 font-mono font-sans">Recording: {formatSeconds(recordingSeconds)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          Stop
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-full py-2 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase rounded-lg shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Recording</span>
                      </button>
                    )}

                    {previewAudioUrl && !isRecording && (
                      <div className="space-y-2 bg-slate-50 p-2.5 border border-slate-100 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Preview Recording:</span>
                        <audio src={previewAudioUrl} controls className="w-full h-8" />
                        <button
                          type="button"
                          disabled={uploadingVoice}
                          onClick={uploadRecordedVoice}
                          className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {uploadingVoice ? 'Uploading...' : 'Save & Upload Recording'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Option B: Upload File or Paste Link */}
                <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Option B: Upload Audio or Paste URL</span>
                    <p className="text-[11px] text-slate-400 font-light leading-normal">
                      Select an audio file from your device, or paste a direct audio URL below.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="flex space-x-2">
                      <ReusableUploader
                        accept="audio/*"
                        label="Upload Audio (MP3/WAV)"
                        useAdminApi={true}
                        onUploadSuccess={(url) => setVVoiceUrl(url)}
                      />
                    </div>

                    <input
                      type="text"
                      value={vVoiceUrl}
                      onChange={(e) => setVVoiceUrl(e.target.value)}
                      placeholder="Or paste direct audio link here..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
