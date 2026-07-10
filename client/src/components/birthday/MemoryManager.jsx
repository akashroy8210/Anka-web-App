import React from 'react';
import { Sparkles } from 'lucide-react';
import { mediaService } from '../../services/media.service';

export default function MemoryManager({
  demoLinkTimeline,
  timelineTitle,
  setTimelineTitle,
  timelineDate,
  setTimelineDate,
  timelineDescription,
  setTimelineDescription,
  timelinePhoto,
  setTimelinePhoto,
  isUploadingDemoTimelinePhoto,
  setIsUploadingDemoTimelinePhoto,
  isGeneratingTimelineDesc,
  handleAddTimelineItem,
  handleRemoveTimelineItem,
  handleGenerateTimelineDesc
}) {
  return (
    <div className="border-t border-slate-100 pt-3 space-y-2">
      <h4 className="text-[10px] font-bold text-wineDeep uppercase tracking-wider flex items-center justify-between">
        <span>Configure Memories Timeline 📅</span>
        {isUploadingDemoTimelinePhoto && <span className="text-[8px] text-rosePrimary animate-pulse font-bold">Uploading photo...</span>}
      </h4>
      <div className="bg-slate-50 border p-3 rounded-2xl space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Title (e.g. First Date)"
            value={timelineTitle}
            onChange={(e) => setTimelineTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none text-slate-800"
          />
          <input
            type="date"
            value={timelineDate}
            onChange={(e) => setTimelineDate(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none text-slate-800"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold text-rosePrimary uppercase">Memory Note</span>
          <button
            type="button"
            onClick={handleGenerateTimelineDesc}
            disabled={isGeneratingTimelineDesc || !timelineTitle}
            className="px-1.5 py-0.5 bg-rose-50 border border-rosePrimary/20 text-rosePrimary rounded-md text-[8px] font-black uppercase flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingTimelineDesc ? (
              <div className="w-2 h-2 border border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-2 h-2" />
            )}
            <span>AI write ✨</span>
          </button>
        </div>
        <textarea
          placeholder="Describe this memory..."
          rows="1"
          value={timelineDescription}
          onChange={(e) => setTimelineDescription(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none text-slate-800"
        />
        <div className="flex items-center justify-between gap-2">
          <input
            type="file"
            accept="image/*"
            disabled={isUploadingDemoTimelinePhoto}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                setIsUploadingDemoTimelinePhoto(true);
                try {
                  const data = await mediaService.uploadFile(file);
                  if (data.success) {
                    setTimelinePhoto(data.url);
                  } else {
                    console.error('Timeline photo upload rejected by server:', data);
                  }
                } catch (err) {
                  console.error('Timeline photo upload network/catch error:', err);
                } finally {
                  setIsUploadingDemoTimelinePhoto(false);
                }
              }
            }}
            className="text-[9px] text-slate-500 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border file:text-[8px] file:bg-slate-100 file:cursor-pointer disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleAddTimelineItem}
            className="px-2.5 py-1 bg-wineDeep hover:bg-rosePrimary text-white text-[9px] font-black uppercase rounded-lg cursor-pointer shrink-0"
          >
            Add Node
          </button>
        </div>
      </div>
      {demoLinkTimeline.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto border p-1.5 rounded-xl bg-slate-50">
          {demoLinkTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border text-[10px] text-slate-700 shadow-sm">
              <span className="font-bold truncate max-w-[80px]">{item.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveTimelineItem(idx)}
                className="text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
