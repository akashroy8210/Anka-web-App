import React from 'react';
import { X } from 'lucide-react';
import { mediaService } from '../../services/media.service';

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
  editDeluxePrice,
  setEditDeluxePrice,
  editDeluxeInclusions,
  setEditDeluxeInclusions,
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
        <h4 className="font-heading font-extrabold text-xl text-wineDeep">Edit Occasion Details</h4>
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
          <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Name</label>
          <input
            type="text"
            required
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Slug</label>
          <input
            type="text"
            required
            value={editCatSlug}
            onChange={(e) => setEditCatSlug(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Description</label>
        <textarea
          rows="3"
          value={editCatDesc}
          onChange={(e) => setEditCatDesc(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Catalog Thumbnail Image URL</label>
        <input
          type="url"
          value={editCatImage}
          onChange={(e) => setEditCatImage(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-450 uppercase font-light flex items-center">
            Or upload thumbnail:
            {isUploadingEditCatImage && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading...</span>}
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploadingEditCatImage}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                setIsUploadingEditCatImage(true);
                try {
                  const data = await mediaService.uploadFile(file);
                  if (data.success) {
                    setEditCatImage(data.url);
                    alert('Thumbnail uploaded successfully!');
                  } else {
                    alert(data.message || 'Upload failed.');
                  }
                } catch (err) {
                  alert('Error uploading file.');
                } finally {
                  setIsUploadingEditCatImage(false);
                }
              }
            }}
            className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Slideshow Images (Multiple)</label>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-450 uppercase font-light flex items-center">
            Upload multiple screenshots:
            {isUploadingEditCatGallery && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading gallery...</span>}
          </span>
          <div className="flex items-center gap-2">
            {editCatImages.length > 0 && !isUploadingEditCatGallery && (
              <button
                type="button"
                onClick={() => {
                  setEditCatImages([]);
                  alert('Cleared all slideshow images.');
                }}
                className="px-2 py-1 bg-red-50 text-red-655 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploadingEditCatGallery}
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setIsUploadingEditCatGallery(true);
                  const urls = [];
                  for (let i = 0; i < files.length; i++) {
                    try {
                      const data = await mediaService.uploadFile(files[i]);
                      if (data.success) {
                        urls.push(data.url);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                  setIsUploadingEditCatGallery(false);
                  if (urls.length > 0) {
                    setEditCatImages(prev => [...prev, ...urls]);
                    alert(`Successfully uploaded ${urls.length} images!`);
                  } else {
                    alert('Failed to upload slideshow images.');
                  }
                }
              }}
              className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 border rounded-2xl">
          {/* Basic Tier */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3">
            <h5 className="text-xs font-black text-rosePrimary uppercase tracking-wider">Basic Plan</h5>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={editBasicPrice}
                onChange={(e) => setEditBasicPrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Inclusions (comma separated)</label>
              <textarea
                rows="3"
                value={editBasicInclusions}
                onChange={(e) => setEditBasicInclusions(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-normal text-slate-800"
              />
            </div>
          </div>

          {/* Premium Tier */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:px-3">
            <h5 className="text-xs font-black text-rosePrimary uppercase tracking-wider">Premium Plan</h5>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={editPremiumPrice}
                onChange={(e) => setEditPremiumPrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Inclusions (comma separated)</label>
              <textarea
                rows="3"
                value={editPremiumInclusions}
                onChange={(e) => setEditPremiumInclusions(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-normal text-slate-800"
              />
            </div>
          </div>

          {/* Deluxe Tier */}
          <div className="space-y-2 md:pl-3">
            <h5 className="text-xs font-black text-rosePrimary uppercase tracking-wider">Deluxe Plan</h5>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={editDeluxePrice}
                onChange={(e) => setEditDeluxePrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase block mb-1">Inclusions (comma separated)</label>
              <textarea
                rows="3"
                value={editDeluxeInclusions}
                onChange={(e) => setEditDeluxeInclusions(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white leading-normal text-slate-800"
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
