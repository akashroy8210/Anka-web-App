import React from 'react';
import { X } from 'lucide-react';
import ReusableUploader from '../shared/ReusableUploader';
import { getDemoConfig } from '../../registry/demoRegistry';

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
  demoDescription,
  setDemoDescription,
  isUploadingDemoImage,
  setIsUploadingDemoImage,
  isUploadingDemoGallery,
  setIsUploadingDemoGallery,
  handleCreateDemo,
  token,
  demoFeatures,
  setDemoFeatures
}) {
  if (activeCatDemoFormId === cat._id) {
    const config = getDemoConfig(cat.slug);

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

        {/* Dynamic Demo Config Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map(field => {
            const isStandardVideo = field.key === 'demoVideo';
            const isStandardLive = field.key === 'livePreview';
            const value = isStandardVideo 
              ? demoVideo 
              : (isStandardLive ? demoLiveUrl : (demoFeatures[field.key] || ''));
              
            const onChange = (e) => {
              if (isStandardVideo) {
                setDemoVideo(e.target.value);
              } else if (isStandardLive) {
                setDemoLiveUrl(e.target.value);
              } else {
                setDemoFeatures({ ...demoFeatures, [field.key]: e.target.value });
              }
            };

            return (
              <div key={field.key}>
                <label className="text-xs font-bold text-wineDeep uppercase block mb-1 flex items-center gap-1">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                </label>
                <input
                  type="url"
                  required={isStandardVideo || isStandardLive}
                  value={value}
                  onChange={onChange}
                  placeholder={`https://...`}
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
                />
              </div>
            );
          })}
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Short Description</label>
          <textarea
            value={demoDescription || ''}
            onChange={(e) => setDemoDescription(e.target.value)}
            placeholder="e.g. A dreamy night-sky theme filled with stars, romance and magical memories."
            rows={2}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 resize-none font-sans"
          />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-455 uppercase font-light">
              Or upload image:
            </span>
            <ReusableUploader
              accept="image/*"
              label="Upload Image"
              useAdminApi={true}
              onUploadSuccess={(url) => setDemoImage(url)}
              className="w-full sm:w-auto shrink-0"
            />
          </div>
        </div>

        {/* Theme Multiple Images Slideshow Tour */}
        <div className="border-t pt-3 space-y-2">
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-455 uppercase font-light">
                Upload screenshots:
              </span>
              {demoImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDemoImages([]);
                    alert('Cleared all screenshots.');
                  }}
                  className="px-2 py-1.5 bg-red-50 text-red-605 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            <ReusableUploader
              accept="image/*"
              multiple={true}
              label="Upload Gallery"
              useAdminApi={true}
              onUploadSuccess={(url) => setDemoImages(prev => [...prev, url])}
            />
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
          className="w-full py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer text-center"
        >
          Add Design Vibe
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActiveCatDemoFormId(cat._id)}
      className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1"
    >
      <span>+ Add Design Theme Vibe</span>
    </button>
  );
}
