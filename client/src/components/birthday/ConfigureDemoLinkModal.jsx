import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import AITextGenerator from '../ai/AITextGenerator';
import MusicManager from './MusicManager';
import MemoryManager from './MemoryManager';
import ReusableUploader from '../shared/ReusableUploader';
import { OccasionRegistry, getOccasionKey } from '../../registry/occasionRegistry';

export default function ConfigureDemoLinkModal({
  token,
  setInstances,
  setCategories,
  modalOverlayRef,
  demoLinkHook
}) {
  const {
    isDemoLinkModalOpen,
    setIsDemoLinkModalOpen,
    demoLinkCategory,
    demoLinkDemo,
    demoLinkRecipientName,
    setDemoLinkRecipientName,
    demoLinkSenderName,
    setDemoLinkSenderName,
    demoLinkMessage,
    setDemoLinkMessage,
    demoLinkThemeColor,
    setDemoLinkThemeColor,
    demoLinkSongChoice,
    setDemoLinkSongChoice,
    demoLinkMusicUrl,
    setDemoLinkMusicUrl,
    demoLinkCustomSlug,
    setDemoLinkCustomSlug,
    demoLinkPhotos,
    setDemoLinkPhotos,
    demoLinkTimeline,
    setDemoLinkTimeline,
    demoLinkCreatedUrl,
    setDemoLinkCreatedUrl,
    isSubmittingDemoLink,
    timelineTitle,
    setTimelineTitle,
    timelineDate,
    setTimelineDate,
    timelineDescription,
    setTimelineDescription,
    timelinePhoto,
    setTimelinePhoto,
    aiMessagePrompt,
    setAiMessagePrompt,
    isGeneratingAiMessage,
    showAiPromptField,
    setShowAiPromptField,
    isGeneratingTimelineDesc,
    demoLinkBirthdaySongUrl,
    setDemoLinkBirthdaySongUrl,
    demoLinkMode,
    setDemoLinkMode,
    existingDemoLinkInstance,
    deleteOldInstanceId,
    isUploadingDemoBackgroundMusic,
    setIsUploadingDemoBackgroundMusic,
    isUploadingDemoBirthdaySong,
    setIsUploadingDemoBirthdaySong,
    isUploadingDemoPhotos,
    setIsUploadingDemoPhotos,
    isUploadingDemoTimelinePhoto,
    setIsUploadingDemoTimelinePhoto,
    handleAddTimelineItem,
    handleRemoveTimelineItem,
    handleCreateDemoLinkSubmit,
    handleGenerateAiMessage,
    handleGenerateTimelineDesc
  } = demoLinkHook;

  if (!isDemoLinkModalOpen) return null;

  return (
    <div ref={modalOverlayRef} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-[32px] w-full border border-rosePrimary/10 shadow-2xl flex flex-col my-auto max-h-[95vh] transition-all duration-300 ${(demoLinkCreatedUrl || demoLinkMode === 'choose') ? 'max-w-md' : 'max-w-2xl'}`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-rosePrimary/5 to-wineDeep/5 px-6 py-4 border-b border-rosePrimary/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-heading font-black text-lg text-wineDeep flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rosePrimary animate-pulse" />
              <span>{demoLinkMode === 'edit' ? 'Edit' : 'Create'} Configured Live Demo Page</span>
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Category: <span className="font-bold text-rosePrimary uppercase">{demoLinkCategory?.name}</span>
              {demoLinkDemo && <> | Theme: <span className="font-bold text-rosePrimary">{demoLinkDemo?.name}</span></>}
            </p>
          </div>
          <button type="button" onClick={() => setIsDemoLinkModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {demoLinkCreatedUrl ? (
          <div className="p-8 space-y-5 text-center">
            <div className="w-14 h-14 bg-green-50 text-green-500 border border-green-200 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-wineDeep">Demo Site Configured!</h4>
              <p className="text-xs text-slate-500 mt-1">Your live surprise demo page is active instantly.</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono select-all truncate">{demoLinkCreatedUrl}</span>
              <button onClick={() => { navigator.clipboard.writeText(demoLinkCreatedUrl); alert('Copied!'); }} className="px-3 py-1.5 bg-rosePrimary text-white text-[10px] font-bold uppercase rounded-xl shrink-0 cursor-pointer">Copy</button>
            </div>
            <div className="flex gap-3 justify-center">
              <a href={demoLinkCreatedUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border border-rosePrimary/20 text-rosePrimary text-[10px] font-bold uppercase rounded-xl hover:bg-rose-50 transition-colors">Visit Live Demo</a>
              <button onClick={() => { setDemoLinkCreatedUrl(''); setIsDemoLinkModalOpen(false); }} className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-200 cursor-pointer">Done</button>
            </div>
          </div>
        ) : demoLinkMode === 'choose' ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rosePrimary border border-rosePrimary/20 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-heading font-black text-lg text-wineDeep">Active Demo Link Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                A surprise page preview is already configured for the design theme <span className="font-bold text-rose-600">"{demoLinkDemo?.name}"</span>. How would you like to proceed?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
              <button
                onClick={() => setDemoLinkMode('edit')}
                className="w-full py-3 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-rose-600 hover:to-wineDark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Edit Existing Demo Link</span>
              </button>
              <button
                onClick={() => {
                  setDemoLinkMode('create');
                  setDemoLinkRecipientName('My Sweetheart');
                  setDemoLinkSenderName('With Love');
                  setDemoLinkMessage('Happy Surprise! You mean the world to me. Open this envelope to unlock memories, songs, and firework celebrations.');
                  setDemoLinkThemeColor('#E11D48');
                  setDemoLinkSongChoice('romantic');
                  setDemoLinkMusicUrl('');
                  setDemoLinkBirthdaySongUrl('');
                  setDemoLinkCustomSlug('');
                  setDemoLinkPhotos([]);
                  setDemoLinkTimeline([]);
                  setDemoLinkMode('create');
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Create New & Delete Old One</span>
              </button>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={() => setIsDemoLinkModalOpen(false)}
                className="px-6 py-2 border rounded-xl hover:bg-slate-50 text-slate-500 text-[10px] font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto">
            <form onSubmit={(e) => handleCreateDemoLinkSubmit(e, token, setInstances, setCategories, modalOverlayRef)} className="space-y-3 font-sans">

              {/* Row 1: URL + Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Custom URL Slug (Optional)</label>
                  <input type="text" value={demoLinkCustomSlug} onChange={(e) => setDemoLinkCustomSlug(e.target.value)} placeholder="e.g. anniversary-demo" className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={demoLinkThemeColor} onChange={(e) => setDemoLinkThemeColor(e.target.value)} className="w-8 h-8 p-0 border rounded-lg overflow-hidden cursor-pointer shrink-0" />
                    <input type="text" value={demoLinkThemeColor} onChange={(e) => setDemoLinkThemeColor(e.target.value)} className="flex-1 px-3 py-2 text-xs border rounded-xl font-mono uppercase bg-white focus:outline-none text-slate-800" />
                  </div>
                </div>
              </div>

              {/* Row 2: Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Recipient Name</label>
                  <input type="text" required value={demoLinkRecipientName} onChange={(e) => setDemoLinkRecipientName(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Sender Name</label>
                  <input type="text" required value={demoLinkSenderName} onChange={(e) => setDemoLinkSenderName(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800" />
                </div>
              </div>

              {/* Row 3: Message / AI text */}
              <AITextGenerator
                showAiPromptField={showAiPromptField}
                setShowAiPromptField={setShowAiPromptField}
                aiMessagePrompt={aiMessagePrompt}
                setAiMessagePrompt={setAiMessagePrompt}
                isGeneratingAiMessage={isGeneratingAiMessage}
                handleGenerateAiMessage={handleGenerateAiMessage}
              />
              <textarea rows="2" required value={demoLinkMessage} onChange={(e) => setDemoLinkMessage(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-relaxed text-slate-800" />

              {/* Dynamic Occasion-specific Customizer Form */}
              {(() => {
                const occasionKey = getOccasionKey(demoLinkCategory?.slug);
                const occasion = OccasionRegistry[occasionKey];
                if (occasion && occasion.customizer) {
                  return (
                    <div className="border-t border-slate-100 pt-3 space-y-4">
                      <span className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">
                        Configure layout-specific demo content
                      </span>
                      <React.Suspense fallback={<div className="text-[10px] text-slate-400 py-3 text-center italic">Loading customizer inputs...</div>}>
                        <occasion.customizer {...demoLinkHook} />
                      </React.Suspense>
                    </div>
                  );
                }

                // Fallback for general categories
                return (
                  <>
                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <MusicManager
                        demoLinkMusicUrl={demoLinkMusicUrl}
                        setDemoLinkMusicUrl={setDemoLinkMusicUrl}
                        demoLinkBirthdaySongUrl={demoLinkBirthdaySongUrl}
                        setDemoLinkBirthdaySongUrl={setDemoLinkBirthdaySongUrl}
                        isUploadingDemoBackgroundMusic={isUploadingDemoBackgroundMusic}
                        setIsUploadingDemoBackgroundMusic={setIsUploadingDemoBackgroundMusic}
                        isUploadingDemoBirthdaySong={isUploadingDemoBirthdaySong}
                        setIsUploadingDemoBirthdaySong={setIsUploadingDemoBirthdaySong}
                      />

                      <div>
                        <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">
                          Surprise Photos
                        </label>
                        <ReusableUploader
                          accept="image/*"
                          multiple={true}
                          useAdminApi={true}
                          label="Upload Surprise Photos"
                          onUploadSuccess={(url) => setDemoLinkPhotos(prev => [...prev, url])}
                        />
                        {demoLinkPhotos.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 p-1 bg-slate-50 border rounded-xl max-h-12 overflow-y-auto">
                            {demoLinkPhotos.map((img, i) => (
                              <div key={i} className="relative w-7 h-7 border rounded overflow-hidden group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setDemoLinkPhotos(demoLinkPhotos.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] cursor-pointer">×</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <MemoryManager
                      demoLinkTimeline={demoLinkTimeline}
                      timelineTitle={timelineTitle}
                      setTimelineTitle={setTimelineTitle}
                      timelineDate={timelineDate}
                      setTimelineDate={setTimelineDate}
                      timelineDescription={timelineDescription}
                      setTimelineDescription={setTimelineDescription}
                      timelinePhoto={timelinePhoto}
                      setTimelinePhoto={setTimelinePhoto}
                      isUploadingDemoTimelinePhoto={isUploadingDemoTimelinePhoto}
                      setIsUploadingDemoTimelinePhoto={setIsUploadingDemoTimelinePhoto}
                      isGeneratingTimelineDesc={isGeneratingTimelineDesc}
                      handleAddTimelineItem={handleAddTimelineItem}
                      handleRemoveTimelineItem={handleRemoveTimelineItem}
                      handleGenerateTimelineDesc={handleGenerateTimelineDesc}
                    />
                  </>
                );
              })()}

              {/* Buttons */}
              <div className="flex space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    if (existingDemoLinkInstance) {
                      setDemoLinkMode('choose');
                    } else {
                      setIsDemoLinkModalOpen(false);
                    }
                  }}
                  className="w-1/3 py-2.5 border hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded-xl cursor-pointer text-center"
                >
                  {existingDemoLinkInstance ? 'Back' : 'Cancel'}
                </button>
                
                <button
                  type="button"
                  onClick={(e) => handleCreateDemoLinkSubmit(e, token, setInstances, setCategories, modalOverlayRef, true)}
                  disabled={isSubmittingDemoLink}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl cursor-pointer text-center disabled:opacity-75"
                >
                  {isSubmittingDemoLink ? 'Saving...' : 'Save Draft'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingDemoLink}
                  className="w-1/3 py-2.5 bg-gradient-to-r from-rosePrimary to-wineDeep text-white text-xs font-bold uppercase rounded-xl shadow-md flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-70 text-center"
                >
                  {isSubmittingDemoLink ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div><span>Saving...</span></>
                  ) : demoLinkMode === 'edit' ? (
                    <span>Save Changes</span>
                  ) : (
                    <span>Generate Link</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
