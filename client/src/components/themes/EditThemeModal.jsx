import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import ReusableUploader from '../shared/ReusableUploader';

export default function EditThemeModal({
  token,
  editDemoName,
  setEditDemoName,
  editDemoVideo,
  setEditDemoVideo,
  editDemoLiveUrl,
  setEditDemoLiveUrl,
  editDemoSlug,
  setEditDemoSlug,
  editDemoImage,
  setEditDemoImage,
  editDemoImages,
  setEditDemoImages,
  editDemoDescription,
  setEditDemoDescription,
  editDemoTiers = [],
  setEditDemoTiers,
  handleUpdateDemoSubmit,
  setEditingDemo
}) {
  const handleAddTier = () => {
    if (!setEditDemoTiers) return;
    setEditDemoTiers([
      ...editDemoTiers,
      {
        name: 'New Tier',
        price: 499,
        description: 'Custom Surprise Experience',
        features: ['Custom Photos & Music', 'Instant Access Link'],
        limits: { photosLimit: 6 }
      }
    ]);
  };

  const handleRemoveTier = (idx) => {
    if (!setEditDemoTiers) return;
    setEditDemoTiers(editDemoTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx, field, value) => {
    if (!setEditDemoTiers) return;
    const updated = [...editDemoTiers];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditDemoTiers(updated);
  };

  return (
    <form 
      onSubmit={(e) => handleUpdateDemoSubmit(e, token)} 
      className="bg-white border border-rosePrimary/20 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-md md:col-span-2 animate-fade-in-up"
    >
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-sm font-bold text-wineDeep uppercase tracking-wider">Edit Theme Details, Tiers & Features</span>
        <button 
          type="button" 
          onClick={() => setEditingDemo(null)} 
          className="p-1 hover:bg-slate-150 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Name</label>
        <input
          type="text"
          required
          value={editDemoName}
          onChange={(e) => setEditDemoName(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 font-bold"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Short Description</label>
        <textarea
          value={editDemoDescription || ''}
          onChange={(e) => setEditDemoDescription(e.target.value)}
          placeholder="e.g. A dreamy night-sky theme filled with stars, romance and magical memories."
          rows={2}
          className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 resize-none font-sans"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Video Tour Link</label>
          <input
            type="url"
            required
            value={editDemoVideo}
            onChange={(e) => setEditDemoVideo(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Live Demo URL</label>
          <input
            type="url"
            required
            value={editDemoLiveUrl}
            onChange={(e) => setEditDemoLiveUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slug</label>
          <input
            type="text"
            required
            value={editDemoSlug}
            onChange={(e) => setEditDemoSlug(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Thumbnail Image URL</label>
          <input
            type="url"
            value={editDemoImage}
            onChange={(e) => setEditDemoImage(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t pt-2">
        <span className="text-xs font-bold text-slate-500 uppercase font-light">
          Or upload image:
        </span>
        <ReusableUploader
          accept="image/*"
          label="Upload Image"
          useAdminApi={true}
          onUploadSuccess={(url) => setEditDemoImage(url)}
          className="w-full sm:w-auto shrink-0"
        />
      </div>

      {/* Pricing Tiers & Feature Section */}
      <div className="border-t pt-3 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-wineDeep uppercase tracking-wider block">Theme Pricing & Features</span>
          <button
            type="button"
            onClick={handleAddTier}
            className="px-2.5 py-1 bg-rose-50 text-rosePrimary border border-rosePrimary/30 hover:bg-rose-100 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Tier</span>
          </button>
        </div>

        {editDemoTiers.map((tier, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50/90 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={tier.name || ''}
                onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                placeholder="Tier Name (e.g. Basic, Premium)"
                className="w-1/2 px-2.5 py-1.5 text-xs border rounded-lg bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary"
              />
              <div className="flex items-center space-x-1.5 w-1/2">
                <span className="text-xs font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  value={tier.price || 0}
                  onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                  placeholder="Price in INR"
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rosePrimary font-mono"
                />
                {editDemoTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(idx)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer shrink-0"
                    title="Delete Tier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={tier.description || ''}
              onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
              placeholder="Short Description (e.g. Standard Surprise Experience)"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rosePrimary font-sans"
            />

            {/* Feature List Builder */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Features / Inclusions List</label>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...editDemoTiers];
                    updated[idx].features = [...(updated[idx].features || []), ''];
                    setEditDemoTiers(updated);
                  }}
                  className="text-[10px] font-bold text-rosePrimary hover:text-wineDeep uppercase cursor-pointer"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-1.5">
                {((tier.features && tier.features.length > 0 ? tier.features : (tier.inclusions || []))).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...editDemoTiers];
                        const currentList = [...(updated[idx].features && updated[idx].features.length > 0 ? updated[idx].features : (updated[idx].inclusions || []))];
                        currentList[fIdx] = e.target.value;
                        updated[idx].features = currentList;
                        updated[idx].inclusions = currentList;
                        setEditDemoTiers(updated);
                      }}
                      placeholder="Feature description bullet point..."
                      className="flex-grow px-2.5 py-1 text-xs border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-700 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editDemoTiers];
                        const currentList = [...(updated[idx].features && updated[idx].features.length > 0 ? updated[idx].features : (updated[idx].inclusions || []))];
                        const filtered = currentList.filter((_, i) => i !== fIdx);
                        updated[idx].features = filtered;
                        updated[idx].inclusions = filtered;
                        setEditDemoTiers(updated);
                      }}
                      className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multiple Slideshow Screenshots Upload */}
      <div className="border-t pt-3 space-y-2">
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-455 uppercase font-light">
              Upload multiple screenshots:
            </span>
            {editDemoImages.length > 0 && (
              <button
                type="button"
                onClick={() => setEditDemoImages([])}
                className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
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
            onUploadSuccess={(url) => setEditDemoImages(prev => [...prev, url])}
          />
        </div>

        {editDemoImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
            {editDemoImages.map((img, i) => (
              <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setEditDemoImages(editDemoImages.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-3 border-t">
        <button
          type="button"
          onClick={() => setEditingDemo(null)}
          className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 py-2.5 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-md"
        >
          Save Theme & Features
        </button>
      </div>
    </form>
  );
}
