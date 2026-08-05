import React, { useState } from 'react';
import { 
  Heart, FileText, HelpCircle, 
  BookOpen, Lock, Plus, Trash2, 
  MoveUp, MoveDown, Search, Music, Mic, Volume2, Image as ImageIcon
} from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';
import GirlfriendPlaceholderService from '../services/girlfriendPlaceholderService';

const MAX_LETTER_CHARS = 1000;

export default function GirlfriendCustomizer(props) {
  const {
    girlfriendName = props.recipientName || '', setGirlfriendName = props.setRecipientName || (() => {}),
    boyfriendName = props.senderName || '', setBoyfriendName = props.setSenderName || (() => {}),
    selectedTheme = 'dark',
    letterText = props.message || '', setLetterText = props.setMessage || (() => {}),
    girlfriendPhoto = '', setGirlfriendPhoto = () => {},
    boyfriendPhoto = '', setBoyfriendPhoto = () => {},
    chapters = GirlfriendPlaceholderService.getPlaceholderChapters(), setChapters = () => {},
    questions = GirlfriendPlaceholderService.getPlaceholderQuestions(), setQuestions = () => {},
    reasons = GirlfriendPlaceholderService.getPlaceholderReasons(), setReasons = () => {},
    bgMusicUrl = props.musicUrl || '', setBgMusicUrl = props.setMusicUrl || (() => {}),
    voiceNoteUrl = '', setVoiceNoteUrl = () => {},
    api
  } = props;

  const [activeTab, setActiveTab] = useState('welcome');
  const [searchReasonQuery, setSearchReasonQuery] = useState('');

  const getThemeDisplayName = (t) => {
    const clean = String(t || '').toLowerCase();
    if (clean.includes('pastel')) return '🌸 Baby Pink & Pastel Edition';
    if (clean.includes('pink')) return '💖 Soft Pink Romantic Edition';
    if (clean.includes('dark')) return '🌙 Dark Luxury Edition';
    return '✨ Premium Luxury Edition';
  };

  const activeQuestions = (questions && questions.length > 0) 
    ? questions 
    : GirlfriendPlaceholderService.getPlaceholderQuestions();

  const activeReasons = (reasons && reasons.length > 0)
    ? reasons
    : GirlfriendPlaceholderService.getPlaceholderReasons();

  const handleAddChapter = () => {
    const newCh = {
      chapter: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}: Special Memory`,
      subtitle: `LOCATION | ${new Date().toLocaleDateString()}`,
      photoLeft1: girlfriendPhoto || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
      photoLeft2: boyfriendPhoto || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
      photoRight: girlfriendPhoto || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
      memoryText: "Write your special memory description here...",
      quote: "Every moment with you is precious ❤️",
      layoutStyle: "reference"
    };
    setChapters((prev) => [...prev, newCh]);
  };

  const handleUpdateChapter = (idx, fieldOrObj, val) => {
    setChapters((prevChapters) => {
      const updated = [...prevChapters];
      if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
        updated[idx] = { ...updated[idx], ...fieldOrObj };
      } else {
        updated[idx] = { ...updated[idx], [fieldOrObj]: val };
      }
      return updated;
    });
  };

  const handleDeleteChapter = (idx) => {
    if (chapters.length <= 1) {
      alert("At least 1 chapter is required in your memory book.");
      return;
    }
    setChapters((prev) => prev.filter((_, i) => i !== idx).map((ch, i) => ({ ...ch, chapter: i + 1 })));
  };

  const handleMoveChapter = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= chapters.length) return;
    setChapters((prev) => {
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[newIdx];
      updated[newIdx] = temp;
      return updated.map((ch, i) => ({ ...ch, chapter: i + 1 }));
    });
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      section: "Our Story",
      question: "New Custom Question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0
    };
    setQuestions([...activeQuestions, newQ]);
  };

  const handleUpdateQuestion = (idx, field, val) => {
    const updated = [...activeQuestions];
    updated[idx] = { ...updated[idx], [field]: val };
    setQuestions(updated);
  };

  const handleUpdateOption = (qIdx, optIdx, val) => {
    const updated = [...activeQuestions];
    const opts = [...(updated[qIdx].options || ["", "", "", ""])];
    opts[optIdx] = val;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    setQuestions(updated);
  };

  const handleDeleteQuestion = (idx) => {
    if (activeQuestions.length <= 1) {
      alert("At least 1 quiz question is required.");
      return;
    }
    const updated = activeQuestions.filter((_, i) => i !== idx);
    setQuestions(updated);
  };

  const handleAddReason = () => {
    const newReason = {
      id: Date.now(),
      number: activeReasons.length + 1,
      title: `Reason #${activeReasons.length + 1}: New Reason`,
      description: "Write why you love her so much...",
      icon: "❤️"
    };
    setReasons([...activeReasons, newReason]);
  };

  const handleUpdateReason = (idx, field, val) => {
    const updated = [...activeReasons];
    updated[idx] = { ...updated[idx], [field]: val };
    setReasons(updated);
  };

  const handleDeleteReason = (idx) => {
    if (activeReasons.length <= 1) {
      alert("At least 1 love reason is required.");
      return;
    }
    const updated = activeReasons.filter((_, i) => i !== idx).map((r, i) => ({ ...r, number: i + 1 }));
    setReasons(updated);
  };

  const filteredReasons = activeReasons.filter((r) => {
    if (!searchReasonQuery.trim()) return true;
    const q = searchReasonQuery.toLowerCase();
    return (
      (r.title || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      String(r.number || '').includes(q)
    );
  });

  const remainingLetterChars = MAX_LETTER_CHARS - letterText.length;

  return (
    <div className="bg-white border border-rose-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col space-y-4 p-4 md:p-6">
      
      {/* 1. TOP BRANDING HEADER */}
      <div className="p-4 md:p-5 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
              MINI CUSTOMIZER
            </span>
            <span className="text-xs font-bold text-slate-500">Girlfriend's Day Suite</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-900 gf-font-serif">
            Customize Content, Scrapbook & Audio
          </h3>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 shadow-2xs flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-rose-500" />
          <div className="text-left">
            <div className="text-[9px] uppercase font-bold text-slate-400">Purchased Theme</div>
            <div className="text-xs font-extrabold text-slate-800">{getThemeDisplayName(selectedTheme)}</div>
          </div>
        </div>
      </div>

      {/* 2. TOP HORIZONTAL NAVIGATION TAB BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
        {[
          { id: 'welcome', label: 'Welcome & Photos', icon: Heart },
          { id: 'quiz', label: `Love Quiz (${activeQuestions.length})`, icon: HelpCircle },
          { id: 'book', label: `Memory Scrapbook (${chapters.length})`, icon: BookOpen },
          { id: 'reasons', label: `365 Love Notes (${activeReasons.length})`, icon: Heart },
          { id: 'audio', label: 'Music & Voice Note 🎵', icon: Mic },
          { id: 'letter', label: 'Love Letter', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN EDITOR CONTENT AREA */}
      <div className="pt-2 space-y-6">
        
        {/* TAB 1: WELCOME & PHOTOS */}
        {activeTab === 'welcome' && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b pb-2">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Welcome Screen & Names ❤️</span>
              </h4>
              <p className="text-xs text-slate-500">Configure partner names and welcome couple photos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Girlfriend's Name ❤️</label>
                <input
                  type="text"
                  value={girlfriendName}
                  onChange={(e) => setGirlfriendName(e.target.value)}
                  placeholder="e.g. Sophia"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Boyfriend's Name (Your Name)</label>
                <input
                  type="text"
                  value={boyfriendName}
                  onChange={(e) => setBoyfriendName(e.target.value)}
                  placeholder="e.g. Alexander"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Girlfriend Photo 1</label>
                <ReusableUploader
                  value={girlfriendPhoto}
                  onChange={setGirlfriendPhoto}
                  onUploadSuccess={setGirlfriendPhoto}
                  api={api}
                  placeholder="Upload photo 1..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Boyfriend / Couple Photo 2</label>
                <ReusableUploader
                  value={boyfriendPhoto}
                  onChange={setBoyfriendPhoto}
                  onUploadSuccess={setBoyfriendPhoto}
                  api={api}
                  placeholder="Upload photo 2..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOVE QUIZ MANAGER */}
        {activeTab === 'quiz' && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b pb-2 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-500" />
                  <span>Love Quiz Manager ({activeQuestions.length} Questions)</span>
                </h4>
                <p className="text-xs text-slate-500">Edit default questions or add your own custom questions.</p>
              </div>

              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Question
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {activeQuestions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Q{qIdx + 1} • {q.section || 'General'}
                    </span>
                    <button
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Question Text</label>
                      <input
                        type="text"
                        value={q.question || ''}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Section Category</label>
                      <input
                        type="text"
                        value={q.section || ''}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'section', e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Option Choices (Select radio button for correct answer):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctIndex', optIdx)}
                            className="w-4 h-4 text-rose-500 focus:ring-rose-400 cursor-pointer"
                            title="Set as correct answer"
                          />
                          <input
                            type="text"
                            value={opt || ''}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className={`w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white ${
                              q.correctIndex === optIdx ? 'border-rose-400 font-semibold bg-rose-50/50' : ''
                            }`}
                            placeholder={`Option ${optIdx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEMORY SCRAPBOOK (PHOTO UPLOADER ONLY) */}
        {activeTab === 'book' && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b pb-2 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-500" />
                  <span>Coffee Table Memory Book Photo Album ({chapters.length} Chapters)</span>
                </h4>
                <p className="text-xs text-slate-500">Upload your photos for each chapter. The book pages are beautifully pre-designed with romantic Shayari, magazine love stories, and aesthetic stickers!</p>
              </div>

              <button
                onClick={handleAddChapter}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Chapter
              </button>
            </div>

            {/* Clear Photo Orientation Instructions */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <span className="font-extrabold flex items-center gap-1">
                💡 Photo Orientation Guide for Best Results:
              </span>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-800">
                <li><strong>Photo 1 & Photo 2:</strong> Upload <strong>Horizontal (Landscape 16:9)</strong> photos for wide magazine spreads.</li>
                <li><strong>Photo 3:</strong> Upload <strong>Vertical (Portrait 4:5)</strong> photo for framed scrapbook notes.</li>
              </ul>
            </div>

            <div className="space-y-6">
              {chapters.map((ch, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-rose-200/80 bg-rose-50/20 space-y-4 relative shadow-2xs">
                  
                  {/* Chapter Header Bar */}
                  <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Chapter {idx + 1} Photos
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveChapter(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-500 hover:bg-slate-200/70 rounded-lg disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveChapter(idx, 1)}
                        disabled={idx === chapters.length - 1}
                        className="p-1.5 text-slate-500 hover:bg-slate-200/70 rounded-lg disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg ml-2 cursor-pointer"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter Photo Uploaders */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-rose-500" />
                      <span>Upload Photos for Chapter {idx + 1}</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Photo 1 (Horizontal Landscape 🖼️)</label>
                        <ReusableUploader
                          value={ch.photo1 || ch.photoLeft1 || ''}
                          onChange={(val) => handleUpdateChapter(idx, { photo1: val, photoLeft1: val })}
                          onUploadSuccess={(url) => handleUpdateChapter(idx, { photo1: url, photoLeft1: url })}
                          api={api}
                          placeholder="Upload Landscape Photo 1..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Photo 2 (Horizontal Landscape 🖼️)</label>
                        <ReusableUploader
                          value={ch.photo2 || ch.photoLeft2 || ''}
                          onChange={(val) => handleUpdateChapter(idx, { photo2: val, photoLeft2: val })}
                          onUploadSuccess={(url) => handleUpdateChapter(idx, { photo2: url, photoLeft2: url })}
                          api={api}
                          placeholder="Upload Landscape Photo 2..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Photo 3 (Vertical Portrait 📸)</label>
                        <ReusableUploader
                          value={ch.photo3 || ch.photoRight || ''}
                          onChange={(val) => handleUpdateChapter(idx, { photo3: val, photoRight: val })}
                          onUploadSuccess={(url) => handleUpdateChapter(idx, { photo3: url, photoRight: url })}
                          api={api}
                          placeholder="Upload Portrait Photo 3..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 365 REASONS MANAGER */}
        {activeTab === 'reasons' && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>365 Reasons Why I Love You ({activeReasons.length} Cards)</span>
                </h4>
                <p className="text-xs text-slate-500">Edit stacked love note cards, search, or add custom reasons.</p>
              </div>

              <button
                onClick={handleAddReason}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Reason Card
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchReasonQuery}
                onChange={(e) => setSearchReasonQuery(e.target.value)}
                placeholder="Search reasons by keyword or number..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredReasons.map((r, rIdx) => {
                const originalIndex = activeReasons.findIndex((item) => item.id === r.id || item.number === r.number);
                const actualIdx = originalIndex !== -1 ? originalIndex : rIdx;

                return (
                  <div key={r.id || actualIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 relative">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold text-amber-900 font-mono">
                        REASON #{r.number || actualIdx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteReason(actualIdx)}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                        title="Delete Reason"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Reason Title</label>
                        <input
                          type="text"
                          value={r.title || ''}
                          onChange={(e) => handleUpdateReason(actualIdx, 'title', e.target.value)}
                          placeholder="e.g. Your contagious smile"
                          className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Icon Emoji</label>
                        <input
                          type="text"
                          value={r.icon || '❤️'}
                          onChange={(e) => handleUpdateReason(actualIdx, 'icon', e.target.value)}
                          className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-center text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Reason Description</label>
                      <textarea
                        rows={2}
                        value={r.description || ''}
                        onChange={(e) => handleUpdateReason(actualIdx, 'description', e.target.value)}
                        placeholder="Explain why you love her..."
                        className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-white leading-relaxed focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: BACKGROUND MUSIC TRACK */}
        {activeTab === 'audio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-2">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-500" />
                <span>Background Music Track 🎵</span>
              </h4>
              <p className="text-xs text-slate-500">Upload custom background music for the experience.</p>
            </div>

            <div className="p-4 md:p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Background Music Track (MP3 / Audio)
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Upload Background Music Audio File</label>
                <ReusableUploader
                  accept="audio/*"
                  value={bgMusicUrl}
                  onChange={setBgMusicUrl}
                  onUploadSuccess={setBgMusicUrl}
                  api={api}
                  placeholder="Upload background music (MP3/WAV)..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Or Paste Audio URL</label>
                <input
                  type="text"
                  value={bgMusicUrl}
                  onChange={(e) => setBgMusicUrl(e.target.value)}
                  placeholder="e.g. https://domain.com/romantic-song.mp3"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {bgMusicUrl && (
                <div className="pt-2 border-t border-rose-200/60">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">Live Audio Preview:</span>
                  <audio controls src={bgMusicUrl} className="w-full h-10 rounded-xl" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: LOVE LETTER */}
        {activeTab === 'letter' && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-b pb-2">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <span>Love Letter Editor</span>
              </h4>
              <p className="text-xs text-slate-500">Paper letter unfolding with handwritten typography.</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <label>Love Letter Paragraphs</label>
                <span className={remainingLetterChars < 50 ? 'text-rose-500 font-bold' : 'text-slate-400 font-mono'}>
                  {remainingLetterChars} characters remaining ({letterText.length} / {MAX_LETTER_CHARS})
                </span>
              </div>

              <textarea
                rows={7}
                maxLength={MAX_LETTER_CHARS}
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Write your heartfelt love letter here..."
                className="w-full p-4 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-400 leading-relaxed font-sans"
              />
              <p className="text-[10px] text-slate-400">Separate paragraphs with a blank line.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
