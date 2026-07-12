import React from 'react';
import { X } from 'lucide-react';
import ReusableUploader from '../shared/ReusableUploader';

export default function EditCategoryModal({
  cat,
  token,
  editCatName,
  setEditCatName,
  editCatSlug,
  setEditCatSlug,
  editCatDesc,
  setEditCatDesc,
  editCatImage,
  setEditCatImage,
  editCatImages,
  setEditCatImages,
  editBasicPrice,
  setEditBasicPrice,
  editBasicInclusions,
  setEditBasicInclusions,
  editPremiumPrice,
  setEditPremiumPrice,
  editPremiumInclusions,
  setEditPremiumInclusions,
  isUploadingEditCatImage,
  setIsUploadingEditCatImage,
  isUploadingEditCatGallery,
  setIsUploadingEditCatGallery,
  handleUpdateCategorySubmit,
  setEditingCategory
}) {
  return (
    <form 
      onSubmit={(e) => handleUpdateCategorySubmit(e, token)} 
      className="bg-white rounded-3xl p-6 border border-rosePrimary/20 shadow-md space-y-4"
    >
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h4 className="font-heading font-extrabold text-2xl text-wineDeep">Edit Occasion Details</h4>
        <button 
          type="button" 
          onClick={() => setEditingCategory(null)} 
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-black text-wineDeep uppercase tracking-wider block mb-1.5">Category Name</label>
          <input
            type="text"
            required
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
            className="w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
        <div>
          <label className="text-sm font-black text-wineDeep uppercase tracking-wider block mb-1.5">Slug</label>
          <input
            type="text"
            required
            value={editCatSlug}
            onChange={(e) => setEditCatSlug(e.target.value)}
            className="w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-black text-wineDeep uppercase tracking-wider block mb-1.5">Description</label>
        <textarea
          rows="3"
          value={editCatDesc}
          onChange={(e) => setEditCatDesc(e.target.value)}
          className="w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
        />
      </div>

      <div>
        <label className="text-sm font-black text-wineDeep uppercase tracking-wider block mb-1.5">Catalog Thumbnail Image URL</label>
        <input
          type="url"
          value={editCatImage}
          onChange={(e) => setEditCatImage(e.target.value)}
          className="w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-455 uppercase">
            Or upload thumbnail:
          </span>
          <ReusableUploader
            accept="image/*"
            label="Upload Thumbnail"
            useAdminApi={true}
            onUploadSuccess={(url) => setEditCatImage(url)}
            className="w-full sm:w-auto shrink-0"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Slideshow Images (Multiple)</label>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-450 uppercase font-light flex items-center">
            Upload multiple screenshots:
          </span>
          <div className="flex items-center gap-2 flex-grow max-w-[200px]">
            {editCatImages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setEditCatImages([]);
                  alert('Cleared all slideshow images.');
                }}
                className="px-2 py-2 bg-red-50 text-red-655 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <ReusableUploader
              accept="image/*"
              multiple={true}
              label="Upload Gallery"
              useAdminApi={true}
              onUploadSuccess={(url) => setEditCatImages(prev => [...prev, url])}
            />
          </div>
        </div>

        {editCatImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
            {editCatImages.map((img, i) => (
              <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setEditCatImages(editCatImages.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Tiers Configuration */}
      <div className="border-t border-slate-100 pt-4 space-y-4 text-left">
        <span className="text-sm font-extrabold text-wineDeep uppercase tracking-wider block">
          Configure Package Tiers 🏷️
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 border rounded-2xl">
          {/* Basic Tier */}
          <div className="space-y-3 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
            <h5 className="text-sm font-black text-rosePrimary uppercase tracking-wider">Basic Plan</h5>
            <div>
              <label className="text-xs font-bold text-wineDeep uppercase block mb-1.5">Price (₹)</label>
              <input
                type="number"
                required
                value={editBasicPrice}
                onChange={(e) => setEditBasicPrice(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-wineDeep uppercase block mb-1.5">Inclusions (comma separated)</label>
              <textarea
                rows="4"
                value={editBasicInclusions}
                onChange={(e) => setEditBasicInclusions(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-normal text-slate-800"
              />
            </div>
          </div>

          {/* Premium Tier */}
          <div className="space-y-3 md:pl-4">
            <h5 className="text-sm font-black text-rosePrimary uppercase tracking-wider">Premium Plan</h5>
            <div>
              <label className="text-xs font-bold text-wineDeep uppercase block mb-1.5">Price (₹)</label>
              <input
                type="number"
                required
                value={editPremiumPrice}
                onChange={(e) => setEditPremiumPrice(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-wineDeep uppercase block mb-1.5">Inclusions (comma separated)</label>
              <textarea
                rows="4"
                value={editPremiumInclusions}
                onChange={(e) => setEditPremiumInclusions(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-normal text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 pt-2 border-t">
        <button
          type="button"
          onClick={() => setEditingCategory(null)}
          className="w-1/2 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-655 text-sm font-bold uppercase rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase rounded-lg cursor-pointer"
        >
          Save Details
        </button>
      </div>
    </form>
  );
}
