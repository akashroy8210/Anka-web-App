import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Mail, Lock, ExternalLink, Share2, Heart } from 'lucide-react';
import qrcode from 'qrcode-generator';
import jsQR from 'jsqr';

// Curated Premium Colors matching AnKa's high-end branding
const PREMIUM_COLORS = [
  { id: 'red', name: 'Romantic Red', hex: '#BE123C', icon: '❤️' },
  { id: 'black', name: 'Luxury Black', hex: '#111827', icon: '🖤' },
  { id: 'gold', name: 'Champagne Gold', hex: '#C5A059', icon: '✨' },
  { id: 'blue', name: 'Royal Blue', hex: '#1E3A8A', icon: '💙' },
  { id: 'green', name: 'Emerald Green', hex: '#064E3B', icon: '💚' }
];

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
  const [qrColor, setQrColor] = useState('#BE123C'); // Romantic Red by default

  const canvasRef = useRef(null);

  const liveLink = `${window.location.origin}/s/${instanceId}`;
  const controlLink = `${window.location.origin}/control/${instanceId}`;
  const customizerLink = `${window.location.origin}/customizer/${instanceId}`;

  const shortLiveLink = `anka.in/s/${instanceId}`;
  const shortControlLink = `anka.in/control/${instanceId}`;
  const shortCustomizerLink = `anka.in/customizer/${instanceId}`;

  // Helper: check if a cell is inside the 3 corner finder patterns (7x7 blocks)
  const isFinderPattern = (r, c, size) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= size - 7) return true;
    if (r >= size - 7 && c < 7) return true;
    return false;
  };

  // Helper: check if a cell is in the center overlay zone to clear for the logo
  const isCenterZone = (r, c, size) => {
    const center = size / 2;
    const offset = 2.8;
    return Math.abs(r - center) < offset && Math.abs(c - center) < offset;
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    // 1. Generate real QR code with Error Correction Level 'H'
    const qr = qrcode(0, 'H');
    qr.addData(liveLink);
    qr.make();

    const realModules = qr.getModuleCount();

    // Clear Canvas (Transparent/White)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2 - 10;

    // 2. Parametric Heart Path (Forms the outer border)
    const drawHeartPath = (targetCtx) => {
      const scale = size / 32;
      targetCtx.beginPath();
      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const px = cx + x * scale;
        const py = cy + y * scale;

        if (i === 0) targetCtx.moveTo(px, py);
        else targetCtx.lineTo(px, py);
      }
      targetCtx.closePath();
    };

    // Helper to draw a heart shape for finder centers & logo
    const drawHeart = (targetCtx, x, y, width, height, color) => {
      targetCtx.save();
      targetCtx.fillStyle = color;
      targetCtx.beginPath();
      const topCurveHeight = height * 0.3;
      targetCtx.moveTo(x, y + topCurveHeight);
      targetCtx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);
      targetCtx.bezierCurveTo(x - width / 2, y + (height + topCurveHeight) / 2, x, y + height, x, y + height);
      targetCtx.bezierCurveTo(x, y + height, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + topCurveHeight);
      targetCtx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.restore();
    };

    // 3. Grid Setup (Giant noise grid inside the heart shape)
    const totalGridSize = 65; // High module count to fill the outer heart
    const cellWidth = size / totalGridSize;
    const realQrOffset = Math.floor((totalGridSize - realModules) / 2);

    // Offscreen canvas for heart collision masking
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#000000';
    drawHeartPath(tempCtx);
    tempCtx.fill();

    // Pseudo-random deterministic generator so decorative noise stays consistent
    let seed = 12345;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // 4. Fill Outer Heart with Decorative Noise Modules
    ctx.fillStyle = qrColor || '#FF0000';

    for (let r = 0; r < totalGridSize; r++) {
      for (let c = 0; c < totalGridSize; c++) {
        const x = c * cellWidth;
        const y = r * cellWidth;

        // Check if coordinate is inside real central QR area
        const isInsideRealQr =
          r >= realQrOffset &&
          r < realQrOffset + realModules &&
          c >= realQrOffset &&
          c < realQrOffset + realModules;

        if (!isInsideRealQr) {
          // Draw decorative heart-filler noise modules
          if (tempCtx.isPointInPath(x + cellWidth / 2, y + cellWidth / 2)) {
            if (pseudoRandom() > 0.45) { // ~55% density noise
              ctx.fillRect(x, y, cellWidth * 0.9, cellWidth * 0.9);
            }
          }
        }
      }
    }

    // 5. Draw Complete Real QR Code in the Center (Ensures 100% Scan Rate)
    const realQrX = realQrOffset * cellWidth;
    const realQrY = realQrOffset * cellWidth;
    const realQrSize = realModules * cellWidth;

    // Clear background behind central QR so it stays crisp and legible
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(realQrX - cellWidth, realQrY - cellWidth, realQrSize + cellWidth * 2, realQrSize + cellWidth * 2);

    ctx.fillStyle = qrColor || '#FF0000';

    for (let r = 0; r < realModules; r++) {
      for (let c = 0; c < realModules; c++) {
        if (qr.isDark(r, c)) {
          if (isFinderPattern(r, c, realModules)) continue;
          if (isCenterZone(r, c, realModules)) continue;

          const x = realQrX + c * cellWidth;
          const y = realQrY + r * cellWidth;
          ctx.fillRect(x, y, cellWidth * 0.95, cellWidth * 0.95);
        }
      }
    }

    // 6. Draw Custom Heart Finder Patterns (Top-Left, Top-Right, Bottom-Left)
    const finderSize = cellWidth * 7;
    const drawCustomFinder = (fx, fy) => {
      ctx.fillStyle = qrColor || '#FF0000';

      // Outer Square Frame
      ctx.beginPath();
      ctx.rect(fx, fy, finderSize, finderSize);
      ctx.rect(fx + cellWidth, fy + cellWidth, finderSize - cellWidth * 2, finderSize - cellWidth * 2);
      ctx.fill('evenodd');

      // Inner Heart Eye (Replaces central 3x3 square)
      const eyeX = fx + cellWidth * 3.5;
      const eyeY = fy + cellWidth * 2;
      const eyeWidth = cellWidth * 3;
      const eyeHeight = cellWidth * 3;

      drawHeart(ctx, eyeX, eyeY, eyeWidth, eyeHeight, qrColor || '#FF0000');
    };

    const finderOffset = (realModules - 7) * cellWidth;
    drawCustomFinder(realQrX, realQrY);
    drawCustomFinder(realQrX + finderOffset, realQrY);
    drawCustomFinder(realQrX, realQrY + finderOffset);

    // 7. Draw Central White Badge & "AnKa" Text
    const textString = 'AnKa';

    // Calculate text container dimensions based on module cell size
    const badgeWidth = cellWidth * 8.5;
    const badgeHeight = cellWidth * 4.5;
    const badgeRadius = cellWidth * 1.2; // Rounded corners for a smooth look

    // Draw solid white background pill/badge so QR dots don't overlap the text
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(
      cx - badgeWidth / 2,
      cy - badgeHeight / 2,
      badgeWidth,
      badgeHeight,
      badgeRadius
    );
    ctx.fill();

    // Draw subtle border around the text badge matching the QR color
    ctx.strokeStyle = qrColor || '#FF0000';
    ctx.lineWidth = cellWidth * 0.4;
    ctx.stroke();

    // Render "AnKa" Text
    ctx.fillStyle = qrColor || '#FF0000';
    ctx.font = `bold ${Math.floor(cellWidth * 2.2)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textString, cx, cy);

    
  }, [liveLink, qrColor]);

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
        console.warn('Share failed:', err);
      }
    } else {
      handleCopy(liveLink, setCopiedLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-6 animate-fade-in-up text-slate-800 text-center">

      {/* Title Header */}
      <div className="space-y-1">
        <h4 className="font-heading font-black text-wineDeep text-xl">Surprise Ready! 🚀</h4>
        <p className="font-accent text-rosePrimary text-lg font-bold">"{selectedClosingMsg}"</p>
      </div>

      {/* QR Code Canvas Preview Container */}
      <div className="flex flex-col items-center space-y-3.5">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-rosePrimary/30 to-pink-500/30 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-white p-4.5 border border-slate-100 rounded-3xl inline-block shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-56 h-56 mx-auto rounded-2xl bg-white transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        
      </div>

      {/* Simplified QR Color Picker Swatches */}
      <div className="space-y-2 text-left bg-slate-50 border border-slate-100 p-4 rounded-2xl">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Choose QR Theme Color:</span>
        <div className="flex justify-between items-center gap-1.5 pt-1">
          {PREMIUM_COLORS.map((c) => {
            const isActive = qrColor === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setQrColor(c.hex)}
                className={`flex-1 py-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${isActive ? 'border-rosePrimary bg-white shadow-sm scale-[1.03]' : 'border-transparent bg-slate-200/50 hover:bg-slate-200/80 text-slate-500'}`}
                title={c.name}
              >
                <span className="text-xs">{c.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider">{c.name.split(' ')[1] || c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PDF Download Button */}
      {handleDownloadPDF && (
        <button
          type="button"
          onClick={() => {
            const canvas = canvasRef.current;
            const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
            handleDownloadPDF(qrColor, dataUrl);
          }}
          disabled={downloadingPDF}
          className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
        >
          <Mail className="w-4 h-4 fill-white" />
          <span>{downloadingPDF ? 'Downloading PDF...' : 'Download PDF Greeting Card'}</span>
        </button>
      )}

      {/* Links & sharing settings */}
      <div className="space-y-4 pt-2 border-t border-slate-100">

        {/* Recipient surprise link */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recipient Surprise Link:</span>
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-rosePrimary uppercase tracking-widest flex items-center gap-1 hover:underline"
            >
              <span>Preview</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs justify-between items-center font-mono">
            <span className="truncate text-slate-600 font-semibold">{shortLiveLink}</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleCopy(liveLink, setCopiedLink)}
                className="p-1 text-slate-400 hover:text-rosePrimary cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-1 text-slate-400 hover:text-rosePrimary cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Customizer settings link */}
        <div className="space-y-1.5 text-left border-t border-slate-50 pt-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Surprise Settings Link (Save this to edit later):</span>
          <div className="flex bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs justify-between items-center font-mono">
            <span className="truncate text-slate-600 font-semibold">{shortCustomizerLink}</span>
            <button
              type="button"
              onClick={() => handleCopy(customizerLink, setCopiedCustomizer)}
              className="p-1 text-slate-400 hover:text-rosePrimary cursor-pointer transition-colors"
            >
              {copiedCustomizer ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remote Room Controls */}
        {tierName.toLowerCase() === 'premium' ? (
          <div className="space-y-1.5 text-left border-t border-slate-50 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Control Room:</span>
              <a
                href={`/control/${instanceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-rosePrimary uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <span>Trigger Room</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="flex bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs justify-between items-center font-mono">
              <span className="truncate text-slate-600 font-semibold">{shortControlLink}</span>
              <button
                type="button"
                onClick={() => handleCopy(controlLink, setCopiedControl)}
                className="p-1 text-slate-400 hover:text-rosePrimary cursor-pointer transition-colors"
              >
                {copiedControl ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-left border-t border-slate-50 pt-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Control Room:</span>
            <div className="flex bg-slate-50/50 border border-slate-150 p-3 rounded-xl text-[11px] text-slate-500 gap-2 font-medium">
              <Lock className="w-4 h-4 text-rosePrimary shrink-0" />
              <span>Interactive remote elements are locked. Upgrade to premium to remote-unlock cards!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
