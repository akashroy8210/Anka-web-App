import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api as customerApi } from '../../services/api';
import { api as adminApi } from '../../services/api.service';

export default function ReusableUploader({
  accept = 'image/*',
  multiple = false,
  onUploadSuccess, // (url) => void (called for each successfully uploaded file)
  onUploadStart,   // () => void (called before starting batch)
  onUploadComplete,// (urls) => void (called after batch completes)
  onUploadError,   // (err) => void
  label = 'Choose File',
  className = '',
  disabled = false,
  useAdminApi = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const fileInputRef = useRef(null);
  const uniqueIdRef = useRef(Math.random().toString(36).substring(2, 9));
  const inputId = `reusable-uploader-input-${label.replace(/\s+/g, '-').toLowerCase()}-${uniqueIdRef.current}`;

  const api = useAdminApi ? adminApi : customerApi;

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setTotalFiles(fileList.length);
    setIsUploading(true);
    setErrorText('');
    setSuccessText('');
    setStatusText('');

    if (onUploadStart) onUploadStart();

    const uploadedUrls = [];

    if (!api || typeof api.uploadFile !== 'function') {
      const msg = `Upload helper not found. (api: ${typeof api}, uploadFile: ${api ? typeof api.uploadFile : 'undefined'})`;
      setErrorText(msg);
      setIsUploading(false);
      return;
    }

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setCurrentFileIndex(i + 1);
        setCurrentProgress(10);
        setStatusText(`Uploading file ${i + 1} of ${fileList.length}: ${file.name}`);

        // Client-side file size validation (20MB for audio/music/voice notes, 10MB for images, 50MB for video)
        const isAudio = file.type.startsWith('audio/') || ['.mp3', '.wav', '.m4a', '.ogg', '.aac'].some(ext => (file.name || '').toLowerCase().endsWith(ext));
        const isVideo = file.type.startsWith('video/') || ['.mp4', '.mov', '.avi', '.webm'].some(ext => (file.name || '').toLowerCase().endsWith(ext));
        const maxLimitBytes = isVideo ? 50 * 1024 * 1024 : isAudio ? 20 * 1024 * 1024 : 10 * 1024 * 1024;

        if (file.size > maxLimitBytes) {
          throw new Error(`File "${file.name}" exceeds limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is ${isVideo ? '50MB for videos' : isAudio ? '20MB for voice notes and music' : '10MB for images'}.`);
        }

        // High-Volume direct presigned Cloudinary upload (bypasses Node.js server RAM)
        let data = null;
        if (adminApi && typeof adminApi.uploadMediaDirect === 'function') {
          data = await adminApi.uploadMediaDirect(file);
        }

        // Fall back to standard server uploader if presign is unavailable
        if (!data || !data.success) {
          data = await api.uploadFile(file, (percent) => {
            setCurrentProgress(percent);
          });
        }

        if (data && data.success && data.url) {
          uploadedUrls.push(data.url);
          setCurrentProgress(100);
          if (onUploadSuccess) {
            onUploadSuccess(data.url);
          }
        } else {
          throw new Error(data?.message || `Failed to upload ${file.name}`);
        }
      }

      setSuccessText(`Successfully uploaded ${uploadedUrls.length} file(s)!`);
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.message || 'Upload failed.';
      setErrorText(errMsg);
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setIsUploading(false);
      setCurrentProgress(0);
      setCurrentFileIndex(0);
      setTotalFiles(0);
      setStatusText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`w-full flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled || isUploading}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id={inputId}
        />
        
        <label
          htmlFor={inputId}
          className={`flex-grow py-2 px-4 rounded-xl border border-dashed border-rosePrimary/30 hover:border-rosePrimary bg-rose-50/10 hover:bg-rose-50/20 text-rosePrimary font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-200 ${
            disabled || isUploading ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-rosePrimary" />
          ) : (
            <UploadCloud className="w-4 h-4 text-rosePrimary" />
          )}
          <span>{isUploading ? 'Uploading...' : label}</span>
        </label>
      </div>

      {/* Progress & Status Indicator */}
      {isUploading && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 animate-pulse">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
            <span className="truncate max-w-[200px]">{statusText}</span>
            <span>{currentProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rosePrimary h-full rounded-full transition-all duration-200"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success State */}
      {successText && (
        <div className="flex items-center space-x-1.5 text-green-600 text-[10px] font-bold bg-green-50/55 border border-green-200/50 rounded-xl px-2.5 py-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{successText}</span>
        </div>
      )}

      {/* Error State */}
      {errorText && (
        <div className="flex items-center space-x-1.5 text-red-600 text-[10px] font-bold bg-red-50/55 border border-red-200/50 rounded-xl px-2.5 py-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{errorText}</span>
        </div>
      )}
    </div>
  );
}
