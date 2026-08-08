import React, { useState } from 'react';
import ReusableUploader from '../../../components/shared/ReusableUploader';
import { ApologyThemeRegistry, resolveApologyTheme } from '../themes/themeRegistry';
import { DEFAULT_APOLOGY_DATA } from '../data';

export default function ApologyCustomizer(props) {
  const [activeTab, setActiveTab] = useState('opening');

  const themeSlug = props.selectedTheme || props.demoLinkThemeSlug || props.themeSlug || 'midnight-romance';
  const resolvedKey = resolveApologyTheme(themeSlug);
  const themeInfo = ApologyThemeRegistry[resolvedKey];

  // Scrapbook / Chapters State & Helpers dynamically fetched from DEFAULT_APOLOGY_DATA
  const defaultChapterTitles = (DEFAULT_APOLOGY_DATA.chapters || []).map((ch, idx) => 
    ch.title ? `Chapter ${idx + 1}: ${ch.title}` : `Chapter ${idx + 1}`
  );
  if (defaultChapterTitles.length === 0) {
    defaultChapterTitles.push(
      "Chapter 1: WHERE IT ALL BEGAN",
      "Chapter 2: THE SMILE I MISS MOST",
      "Chapter 3: OUR UNFORGETTABLE MOMENTS",
      "Chapter 4: MY PROMISE TO YOU"
    );
  }

  const rawChapters = props.chapters || props.scrapbook || props.memories || props.photos || [];

  const chaptersList = defaultChapterTitles.map((defTitle, idx) => {
    const ch = rawChapters[idx] || {};
    return {
      title: ch.title || defTitle,
      photo1: typeof ch === 'string' ? ch : (ch.photo1 || ch.image || ch.url || ch.imageUrl || ''),
      photo2: ch.photo2 || '',
      photo3: ch.photo3 || ''
    };
  });

  const handleUpdateChapterPhoto = (chapterIndex, photoKey, url) => {
    const updated = [...chaptersList];
    updated[chapterIndex] = {
      ...updated[chapterIndex],
      [photoKey]: url
    };
    if (props.setChapters) props.setChapters(updated);
    if (props.setScrapbook) props.setScrapbook(updated);
    if (props.setMemories) props.setMemories(updated);
    if (props.setPhotos) props.setPhotos(updated);
  };

  const handleDeleteChapterPhoto = (chapterIndex, photoKey) => {
    handleUpdateChapterPhoto(chapterIndex, photoKey, '');
  };

  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [isUserEdited, setIsUserEdited] = useState(false);

  const markUserEdited = () => {
    setIsUserEdited(true);
  };

  const handleFillDemoData = () => {
    setIsDemoLoaded(true);
    setIsUserEdited(false);

    if (props.setOpeningLine1) props.setOpeningLine1(DEFAULT_APOLOGY_DATA.openingLine1 || '');
    if (props.setOpeningLine2) props.setOpeningLine2(DEFAULT_APOLOGY_DATA.openingLine2 || '');
    if (props.setOpeningLine3) props.setOpeningLine3(DEFAULT_APOLOGY_DATA.openingLine3 || '');

    if (props.setWhatIDid) props.setWhatIDid(DEFAULT_APOLOGY_DATA.whatIDid || '');
    if (props.setWhatIShouldHaveDone) props.setWhatIShouldHaveDone(DEFAULT_APOLOGY_DATA.whatIShouldHaveDone || '');

    if (props.setExcuse1) props.setExcuse1(DEFAULT_APOLOGY_DATA.excuse1 || '');
    if (props.setExcuse2) props.setExcuse2(DEFAULT_APOLOGY_DATA.excuse2 || '');
    if (props.setExcuse3) props.setExcuse3(DEFAULT_APOLOGY_DATA.excuse3 || '');

    if (props.setHandwrittenNotes) props.setHandwrittenNotes(DEFAULT_APOLOGY_DATA.handwrittenNotes || []);
    if (props.setPromises) props.setPromises(DEFAULT_APOLOGY_DATA.promises || []);

    if (props.setChapters) props.setChapters(DEFAULT_APOLOGY_DATA.chapters || []);
    if (props.setScrapbook) props.setScrapbook(DEFAULT_APOLOGY_DATA.chapters || []);
    if (props.setMemories) props.setMemories(DEFAULT_APOLOGY_DATA.memories || []);
    if (props.setPhotos) props.setPhotos(DEFAULT_APOLOGY_DATA.memories || []);

    if (props.setVoiceTitle) props.setVoiceTitle(DEFAULT_APOLOGY_DATA.voiceTitle || "I wanted to say this properly 🎙️");
    if (props.setVoiceDescription) props.setVoiceDescription(DEFAULT_APOLOGY_DATA.voiceDescription || "Press play to listen to my voice note:");

    if (props.setVideoTitle) props.setVideoTitle(DEFAULT_APOLOGY_DATA.videoTitle || "Watch What I Couldn't Say 🎥");
    if (props.setVideoDescription) props.setVideoDescription(DEFAULT_APOLOGY_DATA.videoDescription || "A personal video recorded straight from my heart.");
    if (props.setVideoUrl) props.setVideoUrl(DEFAULT_APOLOGY_DATA.videoUrl || '');

    if (props.setFinalApologyLetter) props.setFinalApologyLetter(DEFAULT_APOLOGY_DATA.finalApologyLetter || '');
    if (props.setCreatorName) props.setCreatorName(DEFAULT_APOLOGY_DATA.creatorName || "With Love");
    if (props.setSenderName) props.setSenderName(DEFAULT_APOLOGY_DATA.creatorName || "With Love");
  };

  const handleClearDemoData = () => {
    if (isUserEdited) {
      alert("Demo data cannot be removed after custom input boxes have been modified.");
      return;
    }

    setIsDemoLoaded(false);
    setIsUserEdited(false);

    if (props.setOpeningLine1) props.setOpeningLine1('');
    if (props.setOpeningLine2) props.setOpeningLine2('');
    if (props.setOpeningLine3) props.setOpeningLine3('');

    if (props.setWhatIDid) props.setWhatIDid('');
    if (props.setWhatIShouldHaveDone) props.setWhatIShouldHaveDone('');

    if (props.setExcuse1) props.setExcuse1('');
    if (props.setExcuse2) props.setExcuse2('');
    if (props.setExcuse3) props.setExcuse3('');

    if (props.setHandwrittenNotes) props.setHandwrittenNotes([]);
    if (props.setPromises) props.setPromises([]);

    if (props.setChapters) props.setChapters([]);
    if (props.setScrapbook) props.setScrapbook([]);
    if (props.setMemories) props.setMemories([]);
    if (props.setPhotos) props.setPhotos([]);

    if (props.setCutenessReasons) props.setCutenessReasons([]);
    if (props.setMusicUrl) props.setMusicUrl('');

    if (props.setVoiceTitle) props.setVoiceTitle('');
    if (props.setVoiceDescription) props.setVoiceDescription('');
    if (props.setVoiceUrl) props.setVoiceUrl('');

    if (props.setVideoTitle) props.setVideoTitle('');
    if (props.setVideoDescription) props.setVideoDescription('');
    if (props.setVideoUrl) props.setVideoUrl('');

    if (props.setFinalApologyLetter) props.setFinalApologyLetter('');
    if (props.setCreatorName) props.setCreatorName('');
    if (props.setSenderName) props.setSenderName('');
  };

  return (
    <div className="space-y-4 text-slate-800 text-xs font-sans">
      {/* Purchased Theme & Use Demo Data Header */}
      <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-800 block">
            Purchased Theme Variant
          </span>
          <span className="text-xs font-bold text-slate-900">{themeInfo.name} ({themeInfo.badge})</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleFillDemoData}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>🪄 Load Demo Data</span>
          </button>
          <button
            type="button"
            onClick={handleClearDemoData}
            disabled={isUserEdited || !isDemoLoaded}
            title={
              isUserEdited
                ? "Cannot clear demo data after modifying input boxes"
                : !isDemoLoaded
                ? "No demo data loaded"
                : "Remove demo data from customizer"
            }
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 ${
              isUserEdited || !isDemoLoaded
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-slate-700 hover:bg-slate-800 text-white cursor-pointer'
            }`}
          >
            <span>🗑️ Clear Demo Data</span>
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-semibold">
            Theme Locked
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-slate-200 pb-2 overflow-x-auto">
        {['opening', 'mistake', 'excuses', 'notes', 'promises', 'scrapbook', 'cuteness', 'media', 'final'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'scrapbook' ? 'scrapbook 📖' : tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Opening */}
      {activeTab === 'opening' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Opening Line 1</label>
            <input type="text" value={props.openingLine1 || ''} onChange={e => { markUserEdited(); props.setOpeningLine1 && props.setOpeningLine1(e.target.value); }} placeholder="I know you're upset with me..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Opening Line 2</label>
            <input type="text" value={props.openingLine2 || ''} onChange={e => { markUserEdited(); props.setOpeningLine2 && props.setOpeningLine2(e.target.value); }} placeholder="And honestly..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Opening Line 3</label>
            <input type="text" value={props.openingLine3 || ''} onChange={e => { markUserEdited(); props.setOpeningLine3 && props.setOpeningLine3(e.target.value); }} placeholder="You have every right to be." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
        </div>
      )}

      {/* Tab 2: Mistake */}
      {activeTab === 'mistake' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">What I Did</label>
            <textarea rows={3} value={props.whatIDid || ''} onChange={e => { markUserEdited(); props.setWhatIDid && props.setWhatIDid(e.target.value); }} placeholder="I ignored your messages when you needed me..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">What I Should Have Done</label>
            <textarea rows={3} value={props.whatIShouldHaveDone || ''} onChange={e => { markUserEdited(); props.setWhatIShouldHaveDone && props.setWhatIShouldHaveDone(e.target.value); }} placeholder="I should have listened..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
        </div>
      )}

      {/* Tab 3: Excuses */}
      {activeTab === 'excuses' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Excuse Note 1</label>
            <input type="text" value={props.excuse1 || ''} onChange={e => { markUserEdited(); props.setExcuse1 && props.setExcuse1(e.target.value); }} placeholder="I could explain it..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Excuse Note 2</label>
            <input type="text" value={props.excuse2 || ''} onChange={e => { markUserEdited(); props.setExcuse2 && props.setExcuse2(e.target.value); }} placeholder="I could blame the situation..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Excuse Note 3</label>
            <input type="text" value={props.excuse3 || ''} onChange={e => { markUserEdited(); props.setExcuse3 && props.setExcuse3(e.target.value); }} placeholder="I could make excuses..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
        </div>
      )}

      {/* Tab 4: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Things I Should Have Said (Notes)</label>
          <p className="text-[10px] text-slate-500">Configure handwritten unfolding notes:</p>
          <textarea rows={4} value={(props.handwrittenNotes || []).join('\n')} onChange={e => { markUserEdited(); props.setHandwrittenNotes && props.setHandwrittenNotes(e.target.value.split('\n')); }} placeholder="One note per line..." className="w-full px-3 py-2 border rounded-xl bg-white font-mono text-[11px]" />
        </div>
      )}

      {/* Tab 5: Promises */}
      {activeTab === 'promises' && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Scratch Promises</label>
          <p className="text-[10px] text-slate-500">Enter promises (one per line) hidden under scratch cards:</p>
          <textarea rows={5} value={(props.promises || []).join('\n')} onChange={e => { markUserEdited(); props.setPromises && props.setPromises(e.target.value.split('\n')); }} placeholder="One promise per line..." className="w-full px-3 py-2 border rounded-xl bg-white font-mono text-[11px]" />
        </div>
      )}

      {/* Tab 6: Scrapbook Photo Upload Section (Configured by Page Requirements of 3D Memory Book) */}
      {activeTab === 'scrapbook' && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
              3D Memory Scrapbook Photos 📖
            </label>
            <p className="text-[10px] text-slate-500">Upload photos according to the requirements of each chapter spread in your 3D Memory Book:</p>
          </div>

          <div className="space-y-4">
            {chaptersList.map((ch, chIdx) => (
              <div key={chIdx} className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                <span className="text-[11px] font-bold uppercase text-rose-800 block border-b border-rose-200 pb-1">
                  {ch.title}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Photo 1: Left Page Hero Polaroid */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-700 uppercase block">Left Page Hero Polaroid 📷</label>
                    {ch.photo1 ? (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-300 bg-black/10 group">
                        <img src={ch.photo1} alt="Hero Polaroid" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteChapterPhoto(chIdx, 'photo1')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-md cursor-pointer"
                          >
                            Delete & Reupload 🗑️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ReusableUploader
                        accept="image/*"
                        multiple={false}
                        useAdminApi={true}
                        label="Upload Hero Photo"
                        onUploadSuccess={(url) => handleUpdateChapterPhoto(chIdx, 'photo1', url)}
                      />
                    )}
                  </div>

                  {/* Photo 2: Right Page Top Polaroid */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-700 uppercase block">Right Page Top Photo 📷</label>
                    {ch.photo2 ? (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-300 bg-black/10 group">
                        <img src={ch.photo2} alt="Top Polaroid" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteChapterPhoto(chIdx, 'photo2')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-md cursor-pointer"
                          >
                            Delete & Reupload 🗑️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ReusableUploader
                        accept="image/*"
                        multiple={false}
                        useAdminApi={true}
                        label="Upload Top Photo"
                        onUploadSuccess={(url) => handleUpdateChapterPhoto(chIdx, 'photo2', url)}
                      />
                    )}
                  </div>

                  {/* Photo 3: Right Page Bottom Polaroid */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-700 uppercase block">Right Page Bottom Photo 📷</label>
                    {ch.photo3 ? (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-300 bg-black/10 group">
                        <img src={ch.photo3} alt="Bottom Polaroid" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteChapterPhoto(chIdx, 'photo3')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-md cursor-pointer"
                          >
                            Delete & Reupload 🗑️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ReusableUploader
                        accept="image/*"
                        multiple={false}
                        useAdminApi={true}
                        label="Upload Bottom Photo"
                        onUploadSuccess={(url) => handleUpdateChapterPhoto(chIdx, 'photo3', url)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Cuteness Meter Privacy Note */}
      {activeTab === 'cuteness' && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
            Cuteness Measurement Privacy Settings
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            The Cuteness Meter allows the recipient to upload their photo during their live session.
          </p>
          <p className="text-[11px] text-rose-900 leading-relaxed font-bold bg-white/80 p-3 rounded-lg border border-rose-200">
            🔒 Privacy Guarantee: The recipient photo is stored ONLY in temporary browser session storage and is automatically deleted upon page refresh. It is NEVER stored in the database.
          </p>
        </div>
      )}

      {/* Tab 8: Media (Background Music, Voice & Video with Delete/Reupload) */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          {/* Background Music Section */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Background Music 🎵 (Romantic Track)
            </span>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Audio File (MP3 / WAV)</label>
              {(props.musicUrl || props.backgroundMusic) ? (
                <div className="p-2.5 rounded-lg border border-rose-300 bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">🎵</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{props.musicUrl || props.backgroundMusic}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (props.setMusicUrl) props.setMusicUrl('');
                      if (props.setBackgroundMusic) props.setBackgroundMusic('');
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    Delete & Reupload 🗑️
                  </button>
                </div>
              ) : (
                <ReusableUploader
                  accept="audio/*"
                  multiple={false}
                  useAdminApi={true}
                  label="Upload Background Music"
                  onUploadSuccess={(url) => {
                    if (props.setMusicUrl) props.setMusicUrl(url);
                    if (props.setBackgroundMusic) props.setBackgroundMusic(url);
                  }}
                />
              )}
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Or Direct Audio MP3 URL</label>
              <input
                type="text"
                value={props.musicUrl || props.backgroundMusic || ''}
                onChange={e => {
                  if (props.setMusicUrl) props.setMusicUrl(e.target.value);
                  if (props.setBackgroundMusic) props.setBackgroundMusic(e.target.value);
                }}
                placeholder="https://example.com/romantic-song.mp3"
                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Voice Recording Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              Voice Apology Recording (Premium)
            </span>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Voice Audio File</label>
              {props.voiceUrl ? (
                <div className="p-2.5 rounded-lg border border-slate-300 bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">🎙️</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{props.voiceUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => props.setVoiceUrl && props.setVoiceUrl('')}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    Delete & Reupload 🗑️
                  </button>
                </div>
              ) : (
                <ReusableUploader
                  accept="audio/*"
                  multiple={false}
                  useAdminApi={true}
                  label="Upload Voice Recording"
                  onUploadSuccess={(url) => props.setVoiceUrl && props.setVoiceUrl(url)}
                />
              )}
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Voice Section Title</label>
              <input
                type="text"
                value={props.voiceTitle || ''}
                onChange={e => props.setVoiceTitle && props.setVoiceTitle(e.target.value)}
                placeholder="e.g. I wanted to say this properly 🎙️"
                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Voice Section Description</label>
              <textarea
                rows={2}
                value={props.voiceDescription || ''}
                onChange={e => props.setVoiceDescription && props.setVoiceDescription(e.target.value)}
                placeholder="e.g. Press play to listen to my voice note..."
                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
              />
            </div>
          </div>

          {/* Video Message Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              Video Apology Message (Premium)
            </span>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Video File</label>
              {props.videoUrl ? (
                <div className="p-2.5 rounded-lg border border-slate-300 bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">🎥</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{props.videoUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => props.setVideoUrl && props.setVideoUrl('')}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    Delete & Reupload 🗑️
                  </button>
                </div>
              ) : (
                <ReusableUploader
                  accept="video/*"
                  multiple={false}
                  useAdminApi={true}
                  label="Upload Video Message"
                  onUploadSuccess={(url) => props.setVideoUrl && props.setVideoUrl(url)}
                />
              )}
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Video Section Title</label>
              <input
                type="text"
                value={props.videoTitle || ''}
                onChange={e => props.setVideoTitle && props.setVideoTitle(e.target.value)}
                placeholder="e.g. Watch What I Couldn't Say 🎥"
                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Video Section Description</label>
              <textarea
                rows={2}
                value={props.videoDescription || ''}
                onChange={e => props.setVideoDescription && props.setVideoDescription(e.target.value)}
                placeholder="e.g. A video recorded straight from my heart..."
                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Final */}
      {activeTab === 'final' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Final Apology Letter</label>
            <textarea rows={4} value={props.finalApologyLetter || ''} onChange={e => props.setFinalApologyLetter && props.setFinalApologyLetter(e.target.value)} placeholder="I'm not asking you to forget..." className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Creator Signature Name</label>
            <input type="text" value={props.creatorName || props.senderName || ''} onChange={e => props.setSenderName && props.setSenderName(e.target.value)} placeholder="Your Name" className="w-full px-3 py-2 border rounded-xl bg-white" />
          </div>
        </div>
      )}
    </div>
  );
}
