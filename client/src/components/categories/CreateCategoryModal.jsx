import React from 'react';
import { mediaService } from '../../services/media.service';

export default function CreateCategoryModal({
  token,
  catName,
  setCatName,
  catSlug,
  setCatSlug,
  catDesc,
  setCatDesc,
  catImage,
  setCatImage,
  catImages,
  setCatImages,
  isUploadingCatImage,
  setIsUploadingCatImage,
  isUploadingCatGallery,
  setIsUploadingCatGallery,
  handleCreateCategory
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm h-fit">
      <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3 mb-4">Create Surprise Category</h3>
      
      <form onSubmit={(e) => handleCreateCategory(e, token)} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Occasion Name</label>
          <input
            type="text"
            required
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Birthday Surprise"
            className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Slug</label>
          <input
            type="text"
            required
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
            placeholder="e.g. birthday"
            className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Description</label>
          <textarea
            rows="3"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="Describe this surprise..."
            className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Catalog Thumbnail Image URL</label>
          <input
            type="url"
            value={catImage}
            onChange={(e) => setCatImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
              Or upload local thumbnail:
              {isUploadingCatImage && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading...</span>}
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingCatImage}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  setIsUploadingCatImage(true);
                  try {
                    const data = await mediaService.uploadFile(file);
                    if (data.success) {
                      setCatImage(data.url);
                      alert('Local thumbnail uploaded successfully!');
                    } else {
                      alert(data.message || 'Upload failed.');
                    }
                  } catch (err) {
                    alert('Error uploading file.');
                  } finally {
                    setIsUploadingCatImage(false);
                  }
                }
              }}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Slideshow Images (Multiple)</label>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
              Upload screenshots:
              {isUploadingCatGallery && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading...</span>}
            </span>
            <div className="flex items-center gap-2">
              {catImages.length > 0 && !isUploadingCatGallery && (
                <button
                  type="button"
                  onClick={() => {
                    setCatImages([]);
                    alert('Cleared all slideshow images.');
                  }}
                  className="px-2 py-1 bg-red-50 text-red-650 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isUploadingCatGallery}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setIsUploadingCatGallery(true);
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
                    setIsUploadingCatGallery(false);
                    if (urls.length > 0) setCatImages(prev => [...prev, ...urls]);
                  }
                }}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
          {catImages.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 p-1.5 bg-slate-50 border rounded-xl max-h-16 overflow-y-auto">
              {catImages.map((img, i) => (
                <div key={i} className="relative w-8 h-8 border rounded overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCatImages(catImages.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Create Category Occasion
        </button>
      </form>
    </div>
  );
}
