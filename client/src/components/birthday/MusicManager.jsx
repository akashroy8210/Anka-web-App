import React from 'react';
import { mediaService } from '../../services/media.service';

export default function MusicManager({
  demoLinkMusicUrl,
  setDemoLinkMusicUrl,
  demoLinkBirthdaySongUrl,
  setDemoLinkBirthdaySongUrl,
  isUploadingDemoBackgroundMusic,
  setIsUploadingDemoBackgroundMusic,
  isUploadingDemoBirthdaySong,
  setIsUploadingDemoBirthdaySong
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Background Music */}
      <div className="bg-slate-50 border rounded-2xl p-3 space-y-2">
        <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block flex items-center justify-between">
          <span>🎵 Background Music</span>
          {isUploadingDemoBackgroundMusic && <span className="text-[8px] text-rosePrimary animate-pulse font-bold">Uploading...</span>}
        </label>
        <input
          type="file"
          accept="audio/*"
          disabled={isUploadingDemoBackgroundMusic}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setIsUploadingDemoBackgroundMusic(true);
              try {
                const data = await mediaService.uploadFile(file);
                if (data.success) {
                  setDemoLinkMusicUrl(data.url);
                  alert('Background music uploaded successfully!');
                } else {
                  console.error('Background music upload rejected by server:', data);
                  alert(data.message || 'Error uploading background music.');
                }
              } catch (err) {
                console.error('Background music upload network/catch error:', err);
                alert('Error uploading background music. Check browser console for logs.');
              } finally {
                setIsUploadingDemoBackgroundMusic(false);
              }
            }
          }}
          className="text-[9px] text-slate-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border file:text-[9px] file:bg-white file:cursor-pointer w-full disabled:opacity-50"
        />
        <input
          type="text"
          value={demoLinkMusicUrl}
          onChange={(e) => setDemoLinkMusicUrl(e.target.value)}
          placeholder="Or paste URL..."
          className="w-full px-2.5 py-1.5 text-[10px] border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
        />
        {demoLinkMusicUrl && <p className="text-[9px] text-green-600 font-bold truncate">✓ {demoLinkMusicUrl.split('/').pop()}</p>}
      </div>

      {/* Birthday Song */}
      <div className="bg-slate-50 border rounded-2xl p-3 space-y-2">
        <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block flex items-center justify-between">
          <span>🎂 Birthday Song</span>
          {isUploadingDemoBirthdaySong && <span className="text-[8px] text-rosePrimary animate-pulse font-bold">Uploading...</span>}
        </label>
        <input
          type="file"
          accept="audio/*"
          disabled={isUploadingDemoBirthdaySong}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setIsUploadingDemoBirthdaySong(true);
              try {
                const data = await mediaService.uploadFile(file);
                if (data.success) {
                  setDemoLinkBirthdaySongUrl(data.url);
                  alert('Birthday song uploaded successfully!');
                } else {
                  console.error('Birthday song upload rejected by server:', data);
                  alert(data.message || 'Error uploading birthday song.');
                }
              } catch (err) {
                console.error('Birthday song upload network/catch error:', err);
                alert('Error uploading birthday song. Check browser console for logs.');
              } finally {
                setIsUploadingDemoBirthdaySong(false);
              }
            }
          }}
          className="text-[9px] text-slate-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border file:text-[9px] file:bg-white file:cursor-pointer w-full disabled:opacity-50"
        />
        <input
          type="text"
          value={demoLinkBirthdaySongUrl}
          onChange={(e) => setDemoLinkBirthdaySongUrl(e.target.value)}
          placeholder="Or paste URL..."
          className="w-full px-2.5 py-1.5 text-[10px] border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
        />
        {demoLinkBirthdaySongUrl && <p className="text-[9px] text-green-600 font-bold truncate">✓ {demoLinkBirthdaySongUrl.split('/').pop()}</p>}
      </div>
    </div>
  );
}
