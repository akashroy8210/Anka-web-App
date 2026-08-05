import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Copy, Lock, Image as ImageIcon, Music, Calendar, Heart, ShieldCheck, FileText, Gift, Cake } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';
import { getTierPermissions } from '../../../utils/tierPermissions';

export default function BirthdayCustomizer({
  recipientName = '',
  setRecipientName = () => {},
  senderName = '',
  setSenderName = () => {},
  message = '',
  setMessage = () => {},
  letterPrompt = '',
  setLetterPrompt = () => {},
  handleGenerateAILetter = () => {},
  generatingLetter = false,
  photos = [],
  setPhotos = () => {},
  birthdaySong = '',
  setBirthdaySong = () => {},
  backgroundMusic = '',
  setBackgroundMusic = () => {},
  musicUrl = '',
  setMusicUrl = () => {},
  cakeFeedingImage = '',
  setCakeFeedingImage = () => {},
  finalMessage = '',
  setFinalMessage = () => {},
  memories = [],
  setMemories = () => {},
  newMemTitle = '',
  setNewMemTitle = () => {},
  newMemImage = '',
  setNewMemImage = () => {},
  newMemDesc = '',
  setNewMemDesc = () => {},
  generatingAI = false,
  setGeneratingAI = () => {},
  tierName,
  categoryTiers,
  specialDate,
  setSpecialDate,
  handleUpgradeToPremium,
  api
}) {
  const [newMemQuestion, setNewMemQuestion] = useState('');
  const [newMemAnswer, setNewMemAnswer] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const permissions = getTierPermissions(tierName, categoryTiers);
  const { isBasic, timelineLimit, photosLimit } = permissions;
  const maxPhotos = photosLimit || (isBasic ? 5 : 25);

  const handleAddPhoto = (urlToAdd, captionToAdd = '') => {
    if (!urlToAdd) return;
    if (photos.length >= maxPhotos) {
      alert(`Limit reached! Your current plan allows up to ${maxPhotos} photos.`);
      return;
    }
    const newObj = {
      url: urlToAdd,
      title: captionToAdd || `Polaroid #${photos.length + 1}`,
      caption: captionToAdd || '',
      description: ''
    };
    setPhotos([...photos, newObj]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleRemovePhoto = async (index) => {
    const photoToRemove = photos[index];
    if (photoToRemove && photoToRemove.url) {
      try {
        await api.deleteFileByUrl(photoToRemove.url);
      } catch (err) {
        console.warn('Could not delete file from Cloudinary', err);
      }
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleUpdateCaption = (index, newCaption) => {
    const updated = [...photos];
    updated[index] = {
      ...updated[index],
      title: newCaption,
      caption: newCaption
    };
    setPhotos(updated);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* CARD 1: RECIPIENT & SENDER DETAILS */}
      <div id="step-names" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
          <Heart className="w-4 h-4 text-rosePrimary" />
          <span>Card 1: Recipient & Sender Names 💖</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Recipient Name (Unka Naam) *
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Priye / Birthday Star"
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Sender Name (Aapka Naam) *
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Rohan"
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* CARD 2: HANDWRITTEN LETTER & AI GENERATOR */}
      <div id="step-letter" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
          <FileText className="w-4 h-4 text-rosePrimary" />
          <span>Card 2: Typewriter Birthday Letter & AI Writer ✍️</span>
        </h3>

        {/* AI Generator Banner */}
        <div className="bg-rose-50/60 border border-rosePrimary/20 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-rosePrimary uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-rosePrimary animate-pulse" />
              <span>AI Birthday Love Letter Writer</span>
            </span>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={letterPrompt}
              onChange={(e) => setLetterPrompt(e.target.value)}
              placeholder="e.g. Write a sweet birthday letter about our coffee dates & trip memories..."
              className="flex-grow px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
            <button
              type="button"
              onClick={handleGenerateAILetter}
              disabled={generatingLetter}
              className="px-5 py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {generatingLetter ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <span className="text-xs text-slate-400 block font-light leading-relaxed">
            Let AI compose a personalized, emotional handwritten birthday letter for your surprise.
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              1. Handwritten Typewriter Love Letter Message *
            </label>
            <textarea
              rows="6"
              required
              value={message}
              onChange={(e) => {
                if (setMessage) setMessage(e.target.value);
              }}
              placeholder="Apne dil ki baat yahan likhein. Aap unke birthday par kya sweet letter type karna chahte hain..."
              className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
            <span className="text-[11px] text-slate-400 font-light block mt-1">
              This letter will be animated line-by-line with a real typewriter effect on your surprise site.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              2. Closing "My Final Wish" Quote (Optional) 💖
            </label>
            <input
              type="text"
              value={finalMessage}
              onChange={(e) => {
                if (setFinalMessage) setFinalMessage(e.target.value);
              }}
              placeholder="e.g. No matter where life takes us, I promise to always cheer for your happiness..."
              className="w-full px-4 py-3 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
            <span className="text-[11px] text-slate-400 font-light block mt-1">
              Short closing wish displayed at the bottom of the surprise page below the polaroid gallery.
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: PHOTO ALBUM & POLAROIDS GALLERY MANAGER */}
      <div id="step-photos" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rosePrimary/10 pb-3 gap-2">
          <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-rosePrimary" />
            <span>Card 3: Photo Album & Polaroids Gallery Manager 📸</span>
          </h3>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rosePrimary bg-rose-50 px-3 py-1 rounded-full border border-rose-200 w-fit">
            {photos.length} / {maxPhotos} Photos Uploaded
          </span>
        </div>

        {/* Add New Photo / Polaroid Controls */}
        {photos.length < maxPhotos ? (
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              Add New Polaroid Photo
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Photo URL or Multi-File Upload
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                  <ReusableUploader
                    accept="image/*"
                    multiple={true}
                    useAdminApi={true}
                    label="Upload Photo(s)"
                    onUploadSuccess={(url) => setNewPhotoUrl(url)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Polaroid Caption / Title (Optional)
                </label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="e.g. Our favorite sunset..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                />
                <button
                  type="button"
                  onClick={() => handleAddPhoto(newPhotoUrl, newPhotoCaption)}
                  disabled={!newPhotoUrl}
                  className="w-full mt-2 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Polaroid Photo to Album</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
            <span className="text-xs font-bold text-rosePrimary uppercase tracking-wider block">
              Photo Limit Reached ({maxPhotos} Photos)
            </span>
            <p className="text-xs text-slate-600 font-light">
              Upgrade to Premium for expanded photo storage capacity.
            </p>
          </div>
        )}

        {/* Existing Photos Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
            {photos.map((photoObj, idx) => {
              const url = typeof photoObj === 'string' ? photoObj : photoObj?.url;
              const caption = typeof photoObj === 'string' ? '' : (photoObj?.caption || photoObj?.title || '');
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-2.5 space-y-2 shadow-xs relative group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={url} alt={`Polaroid ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full px-2 py-1 text-[11px] border border-slate-200 bg-slate-50/50 rounded-lg text-slate-800 text-center focus:outline-none focus:bg-white focus:ring-1 focus:ring-rosePrimary"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs italic font-light">
            No photos added to polaroid gallery yet. Upload photos above!
          </div>
        )}
      </div>

      {/* CARD 4: SPECIAL BIRTHDAY DATE & MIDNIGHT VAULT */}
      <div id="step-date" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Card 4: Special Birthday Date & Midnight Vault 📅</span>
        </h3>

        <div className="bg-amber-50/60 border border-amber-500/20 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
            Special Birthday Date (00:00 AM IST Unlock)
          </label>
          <input
            type="date"
            value={specialDate || ''}
            onChange={(e) => setSpecialDate(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-amber-300/40 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-mono"
          />
          <span className="text-[11px] text-amber-800/80 font-light block leading-relaxed">
            Set the recipient's birthday date. The surprise vault will stay locked until <strong>00:00 AM IST</strong> of this date and automatically unlock with a grand celebration!
          </span>
        </div>
      </div>

      {/* CARD 5: BIRTHDAY SONG & MP3 AUDIO */}
      <div id="step-music" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
          <Music className="w-4 h-4 text-rosePrimary" />
          <span>Card 5: Birthday Song & Background MP3 🎵</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Background Ambient Music */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Background Ambient Music (MP3 / Audio URL) 🎶
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={backgroundMusic || musicUrl}
                onChange={(e) => {
                  if (setBackgroundMusic) setBackgroundMusic(e.target.value);
                  if (setMusicUrl) setMusicUrl(e.target.value);
                }}
                placeholder="Paste ambient MP3 URL..."
                className="w-full px-4 py-3 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
              <ReusableUploader
                accept="audio/*"
                label="Upload Ambient MP3 🎵"
                useAdminApi={true}
                onUploadSuccess={(url) => {
                  if (setBackgroundMusic) setBackgroundMusic(url);
                  if (setMusicUrl) setMusicUrl(url);
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-light block leading-normal">
              Plays softly in the background during letter reading & memory timeline.
            </span>
          </div>

          {/* Candle Blowing & Cake Song */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Candle Blowing Celebration Song (MP3) 🎂
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={birthdaySong}
                onChange={(e) => setBirthdaySong(e.target.value)}
                placeholder="Paste celebration song URL..."
                className="w-full px-4 py-3 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
              <ReusableUploader
                accept="audio/*"
                label="Upload Celebration MP3 🎉"
                useAdminApi={true}
                onUploadSuccess={(url) => setBirthdaySong(url)}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-light block leading-normal">
              Plays during candle blowing, fireworks & cake cutting celebration.
            </span>
          </div>
        </div>
      </div>

      {/* CARD 6: INTERACTIVE CAKE & FEEDING SCENE */}
      <div id="step-cake" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
          <Cake className="w-4 h-4 text-rosePrimary" />
          <span>Card 6: Interactive Cake & Feeding Scene 🎂</span>
        </h3>

        <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl space-y-4">
          <span className="text-xs font-extrabold text-rosePrimary uppercase tracking-widest block">
            Cake Feeding Photo Selection
          </span>
            
          <div className="space-y-3.5">
            {/* Option 1: Direct Upload */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 bg-rose-500/10 text-rosePrimary text-[10px] font-black rounded-full flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Option A: Upload Combined Photo</span>
              </div>
              <p className="text-xs text-slate-500 font-light leading-normal">
                Directly upload a real photo of you two feeding cake to each other.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={cakeFeedingImage}
                  onChange={(e) => setCakeFeedingImage(e.target.value)}
                  placeholder="Paste cake feeding image URL..."
                  className="flex-grow px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                />
                <ReusableUploader
                  accept="image/*"
                  label="Upload Photo"
                  useAdminApi={true}
                  onUploadSuccess={(url) => setCakeFeedingImage(url)}
                />
              </div>
            </div>

            {/* Option 2: AI Generator Copy-Prompt */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 bg-rose-500/10 text-rosePrimary text-[10px] font-black rounded-full flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Option B: Generate with AI & Upload</span>
              </div>
              <p className="text-xs text-slate-500 font-light leading-normal">
                No real cake-feeding photo? Use your uploaded face references in an AI tool (like Midjourney, Fooocus, or Remaker) with our custom face-matching prompt. Copy the prompt below, generate it for free, and upload the result:
              </p>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 relative">
                <div className="text-[10px] font-mono text-slate-600 leading-relaxed pr-8 select-all">
                  Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const promptText = `Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.`;
                    navigator.clipboard.writeText(promptText);
                    alert('AI Image generation prompt copied to clipboard!');
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-500 hover:text-rosePrimary cursor-pointer"
                  title="Copy Prompt"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex space-x-2">
                <ReusableUploader
                  accept="image/*"
                  label="Upload AI Generated Photo"
                  useAdminApi={true}
                  onUploadSuccess={(url) => setCakeFeedingImage(url)}
                />
              </div>
            </div>
          </div>

          {cakeFeedingImage && (
            <div className="space-y-1.5 pt-2 border-t border-rosePrimary/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Feeding Photo Preview</span>
              <div className="w-48 aspect-[4/3] rounded-xl overflow-hidden border border-rosePrimary/20 bg-slate-100 relative group">
                <img src={cakeFeedingImage} alt="Cake Feeding preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    if (cakeFeedingImage) {
                      try {
                        await api.deleteFileByUrl(cakeFeedingImage);
                      } catch (err) {
                        console.warn('Could not delete image from Cloudinary', err);
                      }
                    }
                    setCakeFeedingImage('');
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 7: INTERACTIVE MEMORY TREE NODES */}
      <div id="step-memories" className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-4">
        {(() => {
          const maxMem = timelineLimit;
          return (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-rosePrimary/10 pb-3">
                <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-rosePrimary" />
                  <span>Card 7: Memory Tree Nodes ({memories.length} / {maxMem}) 🌳</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Max {maxMem} Memories</span>
              </div>

              {/* If limit is reached, show plan specific card */}
              {memories.length >= maxMem ? (
                <div className="p-4 bg-rosePrimary/5 border border-rosePrimary/10 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-black text-rosePrimary uppercase tracking-wider block">
                    {isBasic ? "Upgrade Required" : "Premium Limit Reached"}
                  </span>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {isBasic 
                      ? "You've reached the memory limit for the Birthday Basic plan. Upgrade to Birthday Premium to add more memories and unlock premium features. 💖"
                      : "You've uploaded the maximum number of memory nodes allowed in your current plan."
                    }
                  </p>
                </div>
              ) : (
                /* Add memory form */
                <div className="bg-rose-50/20 border border-rosePrimary/10 rounded-2xl p-4 space-y-3.5">
                  <span className="text-xs font-black text-rosePrimary uppercase tracking-widest block">Add New Memory Branch</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Memory Title (Optional)</label>
                      <input
                        type="text"
                        value={newMemTitle}
                        onChange={(e) => setNewMemTitle(e.target.value)}
                        placeholder="e.g. Our First Meeting (Defaults to Memory #N)"
                        className="w-full px-3.5 py-2.5 bg-white text-xs border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Upload Photo / Video from Phone *</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="url"
                          value={newMemImage}
                          onChange={(e) => setNewMemImage(e.target.value)}
                          placeholder="Paste image/video URL..."
                          className="w-full px-3.5 py-2.5 bg-white text-xs border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                        />
                        <ReusableUploader
                          accept="image/*,video/*"
                          label="Upload Photo/Video from Phone 📱"
                          useAdminApi={true}
                          onUploadSuccess={(url) => {
                            setNewMemImage(url);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lock Question (Optional)</label>
                      {isBasic ? (
                        <div className="relative overflow-hidden rounded-xl border border-dashed border-rosePrimary/20 bg-slate-50/50 p-2 px-3 flex items-center justify-between min-h-[38px]">
                          <span className="text-[10px] text-slate-400 italic flex items-center gap-1">🔒 Locked (Premium Only)</span>
                          <button
                            type="button"
                            onClick={handleUpgradeToPremium}
                            className="text-[9px] bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white px-2 py-1 rounded-md font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Upgrade
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={newMemQuestion}
                          onChange={(e) => setNewMemQuestion(e.target.value)}
                          placeholder="e.g. What is my favourite food?"
                          className="w-full px-3.5 py-2.5 bg-white text-xs border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lock Answer (Required if question set)</label>
                      {isBasic ? (
                        <div className="relative overflow-hidden rounded-xl border border-dashed border-rosePrimary/20 bg-slate-50/50 p-2 px-3 flex items-center justify-between min-h-[38px]">
                          <span className="text-[10px] text-slate-400 italic flex items-center gap-1">🔒 Locked</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={newMemAnswer}
                          onChange={(e) => setNewMemAnswer(e.target.value)}
                          placeholder="e.g. cake"
                          className="w-full px-3.5 py-2.5 bg-white text-xs border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Memory Description (Optional)</label>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newMemTitle) {
                            alert('Please enter a memory title first to generate an emotional AI description!');
                            return;
                          }
                          setGeneratingAI(true);
                          try {
                            const data = await api.generateAIMemoryDescription(newMemTitle, recipientName);
                            if (data.success) {
                              setNewMemDesc(data.description);
                            } else {
                              alert(data.message || 'AI generation failed.');
                            }
                          } catch (err) {
                            alert('Error generating AI description.');
                          } finally {
                            setGeneratingAI(false);
                          }
                        }}
                        disabled={generatingAI}
                        className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 text-[10px] font-bold uppercase rounded-lg border border-yellow-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-spin" />
                        <span>{generatingAI ? 'Generating...' : '✨ AI Generate Description'}</span>
                      </button>
                    </div>
                    <textarea
                      rows="2"
                      value={newMemDesc}
                      onChange={(e) => setNewMemDesc(e.target.value)}
                      placeholder="Write a custom description or click the AI button above..."
                      className="w-full px-3.5 py-2.5 bg-white text-xs border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (memories.length >= maxMem) {
                        alert(`Limit reached! Your plan allows up to ${maxMem} memory nodes.`);
                        return;
                      }
                      if (!newMemImage) {
                        alert('Please upload a photo/video or enter a URL before adding!');
                        return;
                      }
                      setMemories([...memories, { 
                        imageUrl: newMemImage, 
                        url: newMemImage,
                        title: newMemTitle || `Memory #${memories.length + 1}`, 
                        description: newMemDesc || 'A beautiful memory shared together on our journey.',
                        question: newMemQuestion,
                        answer: newMemAnswer
                      }]);
                      setNewMemTitle('');
                      setNewMemImage('');
                      setNewMemDesc('');
                      setNewMemQuestion('');
                      setNewMemAnswer('');
                    }}
                    className="w-full py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Memory Node to Tree</span>
                  </button>
                </div>
              )}

              {/* Memories Grid list */}
              {memories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memories.map((mem, idx) => {
                    const imgUrl = mem.imageUrl || mem.url || mem.image || '';
                    return (
                      <div key={idx} className="bg-white border border-rosePrimary/10 rounded-2xl p-3 shadow-sm flex items-center space-x-3.5 relative group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-rosePrimary/10 relative">
                          {imgUrl && (imgUrl.match(/\.(mp4|mov|avi|webm|m4v)(\?|$)/i) || imgUrl.includes('/video/upload/')) ? (
                            <video src={imgUrl} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={imgUrl} alt="Memory Thumbnail" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-1 left-1 z-10 bg-rosePrimary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            #{idx + 1}
                          </div>
                        </div>
                        <div className="text-left flex-grow overflow-hidden pr-6 space-y-1">
                          <input
                            type="text"
                            value={mem.title || ''}
                            onChange={(e) => {
                              const updated = [...memories];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setMemories(updated);
                            }}
                            placeholder="Memory title..."
                            className="font-heading font-extrabold text-xs text-wineDeep w-full border-b border-transparent hover:border-slate-200 focus:border-rosePrimary focus:outline-none bg-transparent"
                          />
                          <input
                            type="text"
                            value={mem.description || ''}
                            onChange={(e) => {
                              const updated = [...memories];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setMemories(updated);
                            }}
                            placeholder="Memory description..."
                            className="text-[10px] text-slate-500 w-full border-b border-transparent hover:border-slate-200 focus:border-rosePrimary focus:outline-none bg-transparent"
                          />
                          {mem.question && (
                            <p className="text-[9px] text-rosePrimary font-bold truncate">
                              🔒 Q: {mem.question} (A: {mem.answer})
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const memToRemove = memories[idx];
                            const urlToDelete = memToRemove?.imageUrl || memToRemove?.url || memToRemove?.image;
                            if (urlToDelete) {
                              try {
                                await api.deleteFileByUrl(urlToDelete);
                              } catch (err) {
                                console.warn('Could not delete image from Cloudinary', err);
                              }
                            }
                            setMemories(memories.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer border border-rosePrimary/10"
                          title="Delete Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 italic font-light">
                  No memory branches added to the tree yet. Upload photos/videos above!
                </p>
              )}
            </div>
          );
        })()}
      </div>

    </div>
  );
}
