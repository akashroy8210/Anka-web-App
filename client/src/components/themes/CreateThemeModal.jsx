import React from 'react';
import { X, Plus } from 'lucide-react';
import ReusableUploader from '../shared/ReusableUploader';

export default function CreateThemeModal({
  cat,
  activeCatDemoFormId,
  setActiveCatDemoFormId,
  demoName,
  setDemoName,
  demoVideo,
  setDemoVideo,
  demoLiveUrl,
  setDemoLiveUrl,
  demoImage,
  setDemoImage,
  demoImages,
  setDemoImages,
  isUploadingDemoImage,
  setIsUploadingDemoImage,
  isUploadingDemoGallery,
  setIsUploadingDemoGallery,
  handleCreateDemo,
  token
}) {
  if (activeCatDemoFormId === cat._id) {
    return (
      <form
        onSubmit={(e) => handleCreateDemo(e, cat._id, token)}
        className="bg-creamBase/20 p-4 rounded-2xl border border-rosePrimary/10 space-y-4 text-left animate-fade-in-up"
      >
        <div className="flex justify-between items-center mb-2 border-b pb-2">
          <span className="text-xs font-bold text-wineDeep uppercase tracking-wider">Add Design Theme to {cat.name}</span>
          <button 
            type="button" 
            onClick={() => setActiveCatDemoFormId(null)}
            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Name</label>
          <input
            type="text"
            required
            value={demoName}
            onChange={(e) => setDemoName(e.target.value)}
            placeholder="e.g. Classic Pink Vibe"
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Video Tour Link</label>
            <input
              type="url"
              required
              value={demoVideo}
              onChange={(e) => setDemoVideo(e.target.value)}
              placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Live Preview URL</label>
            <input
              type="url"
              required
              value={demoLiveUrl}
              onChange={(e) => setDemoLiveUrl(e.target.value)}
              placeholder="https://surprisebabe.vercel.app/"
              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Thumbnail Image URL (Optional)</label>
          <input
            type="url"
            value={demoImage}
            onChange={(e) => setDemoImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-455 uppercase flex items-center font-light">
              Or upload local image:
            </span>
            <ReusableUploader
              accept="image/*"
              label="Upload Image"
              useAdminApi={true}
              onUploadSuccess={(url) => setDemoImage(url)}
              className="w-auto shrink-0"
            />
          </div>
        </div>

        {/* Multiple Slideshow Screenshots Upload */}
        <div className="border-t pt-3 space-y-2">
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center font-light">
              Upload multiple screenshots:
            </span>
            <div className="flex items-center gap-2 flex-grow max-w-[200px]">
              {demoImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDemoImages([]);
                    alert('Cleared all screenshots.');
                  }}
                  className="px-2 py-2 bg-red-50 text-red-655 border border-red-205 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <ReusableUploader
                accept="image/*"
                multiple={true}
                label="Upload Gallery"
                useAdminApi={true}
                onUploadSuccess={(url) => setDemoImages(prev => [...prev, url])}
              />
            </div>
          </div>

          {demoImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
              {demoImages.map((img, i) => (
                <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setDemoImages(demoImages.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          Save Design Vibe Theme
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setActiveCatDemoFormId(cat._id);
      }}
      className="px-4 py-2.5 border border-dashed border-rosePrimary/30 hover:border-rosePrimary hover:bg-rosePrimary/5 text-rosePrimary rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span>Add Design Theme Vibe</span>
    </button>
  );
}
