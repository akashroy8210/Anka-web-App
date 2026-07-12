import React from 'react';
import { Sparkles, Plus, Trash2, Copy } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';

export default function BirthdayCustomizer({
  guestNames,
  setGuestNames,
  birthdaySong,
  setBirthdaySong,
  cakeFeedingImage,
  setCakeFeedingImage,
  finalMessage,
  setFinalMessage,
  memories,
  setMemories,
  newMemTitle,
  setNewMemTitle,
  newMemImage,
  setNewMemImage,
  newMemDesc,
  setNewMemDesc,
  generatingAI,
  setGeneratingAI,
  recipientName,
  api
}) {
  return (
    <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
      <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
        <Sparkles className="w-4 h-4 text-rosePrimary animate-spin" />
        <span>Birthday Journey Settings 🎂</span>
      </h3>

      {/* Guest Names & Birthday Song */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Guest Names (Comma separated)
          </label>
          <input
            type="text"
            value={guestNames}
            onChange={(e) => setGuestNames(e.target.value)}
            placeholder="e.g. Rohan, Ananya, Priyesh, Muskan"
            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
          />
          <span className="text-[9px] text-slate-400 font-light mt-1 block">
            These names will pop up as cheers when recipient blows the candles.
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1">
            Birthday Song (MP3 / Audio URL)
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={birthdaySong}
              onChange={(e) => setBirthdaySong(e.target.value)}
              placeholder="Paste MP3 URL or upload local file..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
            />
            <ReusableUploader
              accept="audio/*"
              label="Upload MP3"
              useAdminApi={true}
              onUploadSuccess={(url) => setBirthdaySong(url)}
            />
          </div>
          <span className="text-[9px] text-slate-400 font-light mt-1 block">
            Custom audio file that plays during candle celebration (e.g. instrumentals or songs).
          </span>
        </div>
      </div>

      <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl space-y-4 text-left">
        <span className="text-[10px] font-black text-rosePrimary uppercase tracking-widest block mb-1">
          🎂 Cake Feeding Photo Selection
        </span>
          
        <div className="space-y-3.5">
          {/* Option 1: Direct Upload */}
          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 bg-rose-500/10 text-rosePrimary text-[9px] font-black rounded-full flex items-center justify-center">1</span>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Option A: Upload Combined Photo</span>
            </div>
            <p className="text-[10px] text-slate-400 font-light leading-normal">
              Directly upload a real photo of you two feeding cake to each other.
            </p>
            
            <div className="flex flex-col gap-2">
              <input
                type="url"
                value={cakeFeedingImage}
                onChange={(e) => setCakeFeedingImage(e.target.value)}
                placeholder="Paste cake feeding image URL..."
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
              />
              <ReusableUploader
                accept="image/*"
                label="Upload File"
                useAdminApi={true}
                onUploadSuccess={(url) => setCakeFeedingImage(url)}
              />
            </div>
          </div>

          {/* Option 2: External AI Generator Copy-Prompt */}
          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 bg-rose-500/10 text-rosePrimary text-[9px] font-black rounded-full flex items-center justify-center">2</span>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Option B: Generate with AI & Upload</span>
            </div>
            <p className="text-[10px] text-slate-400 font-light leading-normal">
              No real cake-feeding photo? Use your uploaded face references (Male & Female photos references) in an AI tool (like Midjourney, Fooocus, or Remaker) with our custom face-matching prompt. Copy the prompt below, generate it for free, and upload the result:
            </p>

            {/* Copy prompt block */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
              <div className="text-[9px] font-mono text-slate-650 leading-relaxed pr-8 select-all">
                Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.
              </div>
              <button
                type="button"
                onClick={() => {
                  const promptText = `Create an ultra-realistic, high-resolution portrait photograph of a young couple indoors during a warm birthday celebration. The girl is smiling naturally and feeding a detailed piece of birthday cake to the boy. Under 100% strict identity preservation: the girl's face must match the uploaded female reference photo, and the boy's face must match the uploaded male reference photo. Preserve face shapes, eyes, smile, hairstyles, and skin tones exactly. No face swap artifacts, photorealistic, cinematic lighting, highly detailed.`;
                  navigator.clipboard.writeText(promptText);
                  alert('AI Image generation prompt copied to clipboard!');
                }}
                className="absolute top-2 right-2 p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-500 hover:text-rosePrimary cursor-pointer"
                title="Copy Prompt"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* Upload for Option B (reuses cakeFeedingImage) */}
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
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Active Feeding Photo Preview</span>
            <div className="w-48 aspect-[4/3] rounded-lg overflow-hidden border border-rosePrimary/20 bg-slate-100 relative group">
              <img src={cakeFeedingImage} alt="Cake Feeding preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCakeFeedingImage('')}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Final Love Letter message */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Final Love Letter Message
        </label>
        <textarea
          rows="3"
          value={finalMessage}
          onChange={(e) => setFinalMessage(e.target.value)}
          placeholder="Type your final birthday promise/slogan here..."
          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
        />
      </div>

      {/* Memory Manager Section (up to 10 memories) */}
      <div className="border-t border-rosePrimary/10 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-heading font-bold text-sm text-wineDeep">Memory Tree Nodes ({memories.length} / 10)</h4>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Max 10 Memories</span>
        </div>

        {/* Add memory form (only if < 10) */}
        {memories.length < 10 && (
          <div className="bg-rose-50/20 border border-rosePrimary/10 rounded-2xl p-4 space-y-3.5 text-left">
            <span className="text-[10px] font-black text-rosePrimary uppercase tracking-widest block">Add New Memory Branch</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Memory Title</label>
                <input
                  type="text"
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  placeholder="e.g. Our First Meeting"
                  className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Memory Photo (Upload/URL)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    value={newMemImage}
                    onChange={(e) => setNewMemImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
                  />
                  <ReusableUploader
                    accept="image/*"
                    label="Upload"
                    useAdminApi={true}
                    onUploadSuccess={(url) => setNewMemImage(url)}
                  />
                </div>
              </div>
            </div>

            {/* AI generated description block */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-slate-500 uppercase block">Memory Description</label>
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
                  className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 text-[9px] font-bold uppercase rounded-lg border border-yellow-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-yellow-600 animate-spin" />
                  <span>{generatingAI ? 'Generating...' : '✨ AI Generate Description'}</span>
                </button>
              </div>
              <textarea
                rows="3"
                value={newMemDesc}
                onChange={(e) => setNewMemDesc(e.target.value)}
                placeholder="Write a custom description or click the AI button above to generate a beautiful handwritten emotional prompt..."
                className="w-full px-3.5 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rosePrimary focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newMemTitle || !newMemImage || !newMemDesc) {
                  alert('Please complete all Memory fields (Title, Image, and Description) before adding!');
                  return;
                }
                setMemories([...memories, { imageUrl: newMemImage, title: newMemTitle, description: newMemDesc }]);
                setNewMemTitle('');
                setNewMemImage('');
                setNewMemDesc('');
              }}
              className="w-full py-2 bg-rosePrimary hover:bg-wineDeep text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory Node to Tree</span>
            </button>
          </div>
        )}

        {/* Memories Grid list */}
        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories.map((mem, idx) => (
              <div key={idx} className="bg-white border border-rosePrimary/10 rounded-2xl p-3 shadow-sm flex items-center space-x-3.5 relative group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-rosePrimary/10 relative">
                  <img src={mem.imageUrl} alt="Memory Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 z-10 bg-rosePrimary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    #{idx + 1}
                  </div>
                </div>
                <div className="text-left flex-grow overflow-hidden pr-6">
                  <h5 className="font-heading font-extrabold text-sm text-wineDeep truncate">{mem.title}</h5>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{mem.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMemories(memories.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer border border-rosePrimary/10"
                  title="Delete Node"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-xs text-slate-400 italic font-light">
            No memory branches added to the tree. Add memories above!
          </p>
        )}
      </div>
    </div>
  );
}
