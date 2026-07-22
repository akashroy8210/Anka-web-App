import React from 'react';
import ReusableUploader from '../shared/ReusableUploader';

export default function MusicManager({
  demoLinkMusicUrl,
  setDemoLinkMusicUrl,
  demoLinkBirthdaySongUrl,
  setDemoLinkBirthdaySongUrl,
  isUploadingDemoBackgroundMusic,
  setIsUploadingDemoBackgroundMusic,
  isUploadingDemoBirthdaySong,
  setIsUploadingDemoBirthdaySong,
  categorySlug
}) {
  const isBirthday = categorySlug && categorySlug.toLowerCase().includes('birthday');

  return (
    <div className={`grid ${isBirthday ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
      {/* Background Music */}
      {!isBirthday && (
        <div className="bg-slate-50 border rounded-2xl p-3 space-y-2">
          <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block">🎵 Background Music</label>
          <ReusableUploader
            accept="audio/*"
            label="Upload MP3"
            useAdminApi={true}
            onUploadSuccess={(url) => setDemoLinkMusicUrl(url)}
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
      )}

      {/* Birthday Song */}
      <div className="bg-slate-50 border rounded-2xl p-3 space-y-2">
        <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block">🎂 Birthday Song</label>
        <ReusableUploader
          accept="audio/*"
          label="Upload MP3"
          useAdminApi={true}
          onUploadSuccess={(url) => setDemoLinkBirthdaySongUrl(url)}
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
