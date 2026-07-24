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
  editCatIsActive,
  setEditCatIsActive,
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
      className="bg-white border border-rosePrimary/20 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md text-left animate-fade-in-up"
    >
      <div className="flex justify-between items-center border-b pb-3">
        <span className="text-sm font-bold text-wineDeep uppercase tracking-wider">Edit Category Details: {cat.name}</span>
        <button 
          type="button" 
          onClick={() => setEditingCategory(null)} 
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Category Name</label>
          <input
            type="text"
            required
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Category Slug</label>
          <input
            type="text"
            required
            value={editCatSlug}
            onChange={(e) => setEditCatSlug(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Description</label>
        <textarea
          value={editCatDesc || ''}
          onChange={(e) => setEditCatDesc(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 resize-none font-sans"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Category Thumbnail Image URL</label>
        <input
          type="url"
          value={editCatImage}
          onChange={(e) => setEditCatImage(e.target.value)}
          className="w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-light">
            Or upload image:
          </span>
          <ReusableUploader
            accept="image/*"
            label="Upload Image"
            useAdminApi={true}
            onUploadSuccess={(url) => setEditCatImage(url)}
            className="w-full sm:w-auto shrink-0"
          />
        </div>
      </div>

      {/* Multiple Slideshow Screenshots Upload */}
      <div className="border-t pt-3 space-y-2">
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Category Slideshow Images (Multiple)</label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-light">
              Upload gallery screenshots:
            </span>
            {editCatImages.length > 0 && (
              <button
                type="button"
                onClick={() => setEditCatImages([])}
                className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
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
            onUploadSuccess={(url) => setEditCatImages(prev => [...prev, url])}
          />
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

      <div className="flex space-x-2 pt-3 border-t">
        <button
          type="button"
          onClick={() => setEditingCategory(null)}
          className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-md"
        >
          Save Details
        </button>
      </div>
    </form>
  );
}
