import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, QrCode, Mail, Lock, ExternalLink, RefreshCw, Share2, Heart } from 'lucide-react';

export default function DemoLinkGenerator({
  instanceId,
  categoryName,
  tierName = 'Basic',
  selectedClosingMsg = 'Your surprise site is live!',
  handleDownloadPDF,
  downloadingPDF = false,
  onRegenerate
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedControl, setCopiedControl] = useState(false);
  const [copiedCustomizer, setCopiedCustomizer] = useState(false);
  const [qrColor, setQrColor] = useState('#881337');
  const canvasRef = useRef(null);

  const liveLink = `${window.location.origin}/s/${instanceId}`;
  const controlLink = `${window.location.origin}/control/${instanceId}`;
  const customizerLink = `${window.location.origin}/customizer/${instanceId}`;
  
  const shortLiveLink = `anka.in/s/${instanceId}`;
  const shortControlLink = `anka.in/control/${instanceId}`;
  const shortCustomizerLink = `anka.in/customizer/${instanceId}`;

  const cleanColor = qrColor.replace('#', '');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&color=${cleanColor}&data=${encodeURIComponent(liveLink)}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 300;
      canvas.width = size;
      canvas.height = size;
      
      // Create temporary canvas for masking
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext('2d');
      
      // 1. Draw solid heart shape mask
      tempCtx.fillStyle = '#000000';
      tempCtx.beginPath();
      tempCtx.moveTo(size / 2, size * 0.25);
      tempCtx.bezierCurveTo(size * 0.1, size * -0.05, size * -0.1, size * 0.5, size / 2, size * 0.95);
      tempCtx.bezierCurveTo(size * 1.1, size * 0.5, size * 0.9, size * -0.05, size / 2, size * 0.25);
      tempCtx.closePath();
      tempCtx.fill();
      
      // 2. Draw QR code masked inside heart
      tempCtx.globalCompositeOperation = 'source-in';
      tempCtx.drawImage(img, 0, 0, size, size);
      
      // 3. Reset composite operation and draw center white circle
      tempCtx.globalCompositeOperation = 'source-over';
      const centerRadius = Math.floor(size * 0.135);
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.beginPath();
      tempCtx.arc(size / 2, size / 2 + 5, centerRadius, 0, 2 * Math.PI);
      tempCtx.fill();
      
      // 4. Draw AnKa logo text in center
      tempCtx.fillStyle = qrColor;
      tempCtx.font = '900 ' + Math.floor(size * 0.075) + 'px sans-serif';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillText('AnKa', size / 2, size / 2 + 6);
      
      // 5. Draw white background on main canvas and paint masked QR
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(tempCanvas, 0, 0);
    };
    img.src = qrCodeUrl;
  }, [qrCodeUrl, qrColor]);

  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surprise Site for ${categoryName}`,
          text: `Check out this interactive surprise page!`,
          url: liveLink,
        });
      } catch (err) {
        console.warn('Share cancelled or failed:', err);
      }
    } else {
      handleCopy(liveLink, setCopiedLink);
      alert('Link copied to clipboard for sharing!');
    }
  };

  return (
    <div className="bg-white border-2 border-rosePrimary rounded-[32px] p-6 shadow-xl text-center space-y-5 animate-fade-in-up text-slate-800">
      <div className="flex justify-between items-center border-b pb-2.5">
        <span className="text-[10px] font-black text-rosePrimary uppercase tracking-widest flex items-center space-x-1">
          <Heart className="w-3.5 h-3.5 fill-rosePrimary text-rosePrimary" />
          <span>Surprise Link Console</span>
        </span>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rosePrimary cursor-pointer transition-colors"
            title="Refresh Links"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-heading font-bold text-wineDeep text-lg">Surprise Taiyar Hai!</h4>
        <p className="font-accent text-rosePrimary text-xl">"{selectedClosingMsg}"</p>
      </div>

      {/* QR Code */}
      <div className="bg-rose-50/20 p-4 border border-rosePrimary/10 rounded-2xl inline-block">
        <canvas
          ref={canvasRef}
          className="w-40 h-40 mx-auto rounded-xl shadow-md border border-slate-100 bg-white"
        />
        <div className="text-[10px] text-rosePrimary font-mono mt-2">Scan QR to Open Surprise</div>
      </div>

      {/* Customize QR Code Color */}
      <div className="space-y-2 text-left bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select QR Code Theme Color:</span>
        <div className="flex space-x-2.5 items-center">
          {[
            { hex: '#881337', name: 'Rose Deep' },
            { hex: '#b5912a', name: 'Gold' },
            { hex: '#000000', name: 'Classic Black' },
            { hex: '#581c87', name: 'Royal Purple' },
            { hex: '#0f766e', name: 'Ocean Teal' }
          ].map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setQrColor(c.hex)}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-300 ${qrColor === c.hex ? 'border-rosePrimary scale-110 shadow-md ring-2 ring-rosePrimary/20' : 'border-slate-300 hover:scale-105'}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* PDF Download Button */}
      {handleDownloadPDF && (
        <button
          type="button"
          onClick={() => handleDownloadPDF(qrColor)}
          disabled={downloadingPDF}
          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
        >
          <Mail className="w-4 h-4" />
          <span>{downloadingPDF ? 'Downloading PDF...' : 'Download Premium QR Card (PDF)'}</span>
        </button>
      )}

      {/* Recipient Link */}
      <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Recipient Surprise Link:</span>
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold text-rosePrimary uppercase tracking-wider flex items-center gap-1.5 hover:underline"
          >
            <span>Preview live</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
          <span className="truncate text-slate-650 mr-2">{shortLiveLink}</span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleCopy(liveLink, setCopiedLink)}
              className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer"
              title="Copy"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Room Link */}
      {tierName.toLowerCase() === 'premium' ? (
        <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Your Live Control Room Link (To Trigger remote events):</span>
            <a
              href={`/control/${instanceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-rosePrimary uppercase tracking-wider flex items-center gap-1.5 hover:underline"
            >
              <span>Open Remote</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
            <span className="truncate text-slate-650 mr-2">{shortControlLink}</span>
            <button
              type="button"
              onClick={() => handleCopy(controlLink, setCopiedControl)}
              className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer"
              title="Copy"
            >
              {copiedControl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Your Live Control Room Link:</span>
          <div className="flex bg-slate-100/50 border border-slate-200/60 p-3 rounded-xl text-xs justify-between items-center text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rosePrimary/60 shrink-0" />
              <span className="text-[11px] leading-snug">
                Real-time live controls (confetti, heart rain, remote unlock) are locked on the <strong className="text-slate-650 font-bold">{tierName || 'Basic'}</strong> plan. Upgrade to Premium to unlock!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Editor Settings Link */}
      <div className="space-y-1.5 text-left border-t border-rosePrimary/5 pt-3">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Your Settings Editor Link (Save This):</span>
        <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs justify-between items-center font-mono">
          <span className="truncate text-slate-650 mr-2">{shortCustomizerLink}</span>
          <button
            type="button"
            onClick={() => handleCopy(customizerLink, setCopiedCustomizer)}
            className="p-1 text-slate-500 hover:text-rosePrimary cursor-pointer"
            title="Copy"
          >
            {copiedCustomizer ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
