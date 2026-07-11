import React from 'react';
import { X } from 'lucide-react';
import { mediaService } from '../../services/media.service';

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
  isUploadingEditDemoImage,
  setIsUploadingEditDemoImage,
  isUploadingEditDemoGallery,
  setIsUploadingEditDemoGallery,
  handleUpdateDemoSubmit,
  setEditingDemo
}) {
  return (
    <form 
      onSubmit={(e) => handleUpdateDemoSubmit(e, token)} 
      className="bg-white border border-rosePrimary/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md md:col-span-2 animate-fade-in-up"
    >
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-sm font-bold text-wineDeep uppercase tracking-wider">Edit Design Vibe Details</span>
        <button 
          type="button" 
          onClick={() => setEditingDemo(null)} 
          className="p-1 hover:bg-slate-150 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Name</label>
        <input
          type="text"
          required
          value={editDemoName}
          onChange={(e) => setEditDemoName(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800"
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

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-450 uppercase flex items-center font-light">
          Or upload image:
          {isUploadingEditDemoImage && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading...</span>}
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={isUploadingEditDemoImage}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setIsUploadingEditDemoImage(true);
              try {
                const data = await mediaService.uploadFile(file);
                if (data.success) {
                  setEditDemoImage(data.url);
                  alert('Uploaded successfully!');
                } else {
                  alert(data.message || 'Upload failed.');
                }
              } catch (err) {
                alert('Error uploading file.');
              } finally {
                setIsUploadingEditDemoImage(false);
              }
            }
          }}
          className="text-xs text-slate-555 file:mr-1 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
        />
      </div>

      {/* Multiple Slideshow Screenshots Upload */}
      <div className="border-t pt-3 space-y-2">
        <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-450 uppercase font-light flex items-center">
            Upload multiple screenshots:
            {isUploadingEditDemoGallery && <span className="text-[9px] text-rosePrimary animate-pulse font-bold ml-2">Uploading gallery...</span>}
          </span>
          <div className="flex items-center gap-2">
            {editDemoImages.length > 0 && !isUploadingEditDemoGallery && (
              <button
                type="button"
                onClick={() => {
                  setEditDemoImages([]);
                  alert('Cleared all slideshow screenshots. Click Save to persist.');
                }}
                className="px-2 py-1 bg-red-50 text-red-605 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer animate-pulse"
              >
                Clear All
              </button>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploadingEditDemoGallery}
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setIsUploadingEditDemoGallery(true);
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
                  setIsUploadingEditDemoGallery(false);
                  if (urls.length > 0) {
                    setEditDemoImages(prev => [...prev, ...urls]);
                    alert(`Successfully uploaded ${urls.length} images!`);
                  } else {
                    alert('Failed to upload slideshow images.');
                  }
                }
              }}
              className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
            />
          </div>
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

      <div className="flex space-x-2 pt-2 border-t">
        <button
          type="button"
          onClick={() => setEditingDemo(null)}
          className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 py-2.5 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
}
