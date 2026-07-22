import React from 'react';
import { Sparkles } from 'lucide-react';
import ReusableUploader from '../shared/ReusableUploader';

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
  timelineQuestion,
  setTimelineQuestion,
  timelineAnswer,
  setTimelineAnswer,
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
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Lock Question (Optional)"
            value={timelineQuestion}
            onChange={(e) => setTimelineQuestion(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none text-slate-800"
          />
          <input
            type="text"
            placeholder="Lock Answer (Req. if question set)"
            value={timelineAnswer}
            onChange={(e) => setTimelineAnswer(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none text-slate-800"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <ReusableUploader
            accept="image/*"
            label="Upload Photo"
            useAdminApi={true}
            onUploadSuccess={(url) => setTimelinePhoto(url)}
            className="flex-grow"
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
        <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto border p-1.5 rounded-xl bg-slate-50">
          {demoLinkTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border text-[10px] text-slate-700 shadow-sm">
              <div className="flex flex-col">
                <span className="font-bold truncate max-w-[150px]">{item.title}</span>
                {item.question && (
                  <span className="text-[8px] text-rosePrimary font-bold truncate max-w-[150px]">
                    🔒 Q: {item.question} (A: {item.answer})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTimelineItem(idx)}
                className="text-red-500 font-bold hover:text-red-700 ml-1 shrink-0"
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
