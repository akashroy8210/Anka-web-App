import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, QrCode, Mail, Lock, ExternalLink, RefreshCw, Share2, Heart, Sparkles, Download, Palette, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import qrcode from 'qrcode-generator';
import jsQR from 'jsqr';

// Curated Luxury Themes
const QR_THEMES = [
  {
    id: 'romantic_deep_red',
    name: 'Deep Red',
    category: 'Romantic',
    dark: '#8B0000',
    light: '#FFF5F5',
    heart: '#FF0000',
    eyeFrame: '#8B0000',
    eyeBall: '#FF1493'
  },
  {
    id: 'romantic_burgundy',
    name: 'Burgundy',
    category: 'Romantic',
    dark: '#800020',
    light: '#FAF0E6',
    heart: '#800020',
    eyeFrame: '#4A0E17',
    eyeBall: '#800020'
  },
  {
    id: 'romantic_rose_gold',
    name: 'Rose Gold',
    category: 'Romantic',
    dark: '#B76E79',
    light: '#FFF0F5',
    heart: '#E0B0FF',
    eyeFrame: '#800020',
    eyeBall: '#800020'
  },
  {
    id: 'luxury_gold',
    name: 'Matte Gold',
    category: 'Luxury',
    dark: '#B39256',
    light: '#FFFFFF',
    heart: '#C5A059',
    eyeFrame: '#7A6031',
    eyeBall: '#B39256'
  },
  {
    id: 'luxury_black_gold',
    name: 'Black & Gold',
    category: 'Luxury',
    dark: '#D4AF37',
    light: '#111111',
    heart: '#C5A059',
    eyeFrame: '#D4AF37',
    eyeBall: '#D4AF37'
  },
  {
    id: 'elegant_emerald',
    name: 'Emerald Green',
    category: 'Elegant',
    dark: '#097969',
    light: '#F4F9F6',
    heart: '#50C878',
    eyeFrame: '#046307',
    eyeBall: '#097969'
  },
  {
    id: 'elegant_midnight',
    name: 'Midnight Blue',
    category: 'Elegant',
    dark: '#191970',
    light: '#F4F6F9',
    heart: '#4169E1',
    eyeFrame: '#000080',
    eyeBall: '#191970'
  },
  {
    id: 'modern_black',
    name: 'Classic Black',
    category: 'Modern',
    dark: '#000000',
    light: '#FFFFFF',
    heart: '#333333',
    eyeFrame: '#000000',
    eyeBall: '#000000'
  },
  {
    id: 'soft_blush',
    name: 'Blush Pink',
    category: 'Soft',
    dark: '#DE5D83',
    light: '#FFF0F5',
    heart: '#FFB7C5',
    eyeFrame: '#C21E56',
    eyeBall: '#DE5D83'
  },
  {
    id: 'soft_peach',
    name: 'Coral Peach',
    category: 'Soft',
    dark: '#FF7F50',
    light: '#FFF5EE',
    heart: '#FFDAB9',
    eyeFrame: '#FF7F50',
    eyeBall: '#FF7F50'
  }
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
  const [activeTab, setActiveTab] = useState('links'); // 'links' | 'design'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedControl, setCopiedControl] = useState(false);
  const [copiedCustomizer, setCopiedCustomizer] = useState(false);

  // QR Studio Customizer States
  const [selectedTheme, setSelectedTheme] = useState(QR_THEMES[0]);
  const [darkColor, setDarkColor] = useState(QR_THEMES[0].dark);
  const [lightColor, setLightColor] = useState(QR_THEMES[0].light);
  const [heartColor, setHeartColor] = useState(QR_THEMES[0].heart);
  const [moduleStyle, setModuleStyle] = useState('rounded'); // 'rounded' | 'dot' | 'circle' | 'diamond' | 'pixel'
  const [eyeStyle, setEyeStyle] = useState('rounded'); // 'rounded' | 'circle' | 'gold_ring' | 'soft_square' | 'minimal' | 'dot_eye'
  const [logoType, setLogoType] = useState('text'); // 'text' | 'heart' | 'none'
  const [scanStatus, setScanStatus] = useState('checking'); // 'perfect' | 'warning' | 'unscannable'
  const [contrastRatio, setContrastRatio] = useState(4.5);

  const canvasRef = useRef(null);

  const liveLink = `${window.location.origin}/s/${instanceId}`;
  const controlLink = `${window.location.origin}/control/${instanceId}`;
  const customizerLink = `${window.location.origin}/customizer/${instanceId}`;
  
  const shortLiveLink = `anka.in/s/${instanceId}`;
  const shortControlLink = `anka.in/control/${instanceId}`;
  const shortCustomizerLink = `anka.in/customizer/${instanceId}`;

  // WCAG Contrast calculation
  const calculateContrast = (c1, c2) => {
    const getRGB = (hex) => {
      const color = hex.replace('#', '');
      const r = parseInt(color.substring(0, 2), 16) / 255;
      const g = parseInt(color.substring(2, 4), 16) / 255;
      const b = parseInt(color.substring(4, 6), 16) / 255;
      return [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    };
    try {
      const [r1, g1, b1] = getRGB(c1);
      const [r2, g2, b2] = getRGB(c2);
      const l1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
      const l2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    } catch {
      return 1.0;
    }
  };

  // Sync state variables when theme is changed
  const applyTheme = (theme) => {
    setSelectedTheme(theme);
    setDarkColor(theme.dark);
    setLightColor(theme.light);
    setHeartColor(theme.heart);
  };

  // Helper: check if a cell is inside the 7x7 finder patterns
  const isFinderPattern = (r, c, size) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= size - 7) return true;
    if (r >= size - 7 && c < 7) return true;
    return false;
  };

  // Helper: check if a cell is in the center overlay zone to clear for the logo
  const isCenterZone = (r, c, size) => {
    if (logoType === 'none') return false;
    const center = size / 2;
    const offset = logoType === 'text' ? 2.8 : 2.2;
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

    // Generate local QR Matrix
    const qr = qrcode(0, 'H'); // Level H error correction (30% recovery)
    qr.addData(liveLink);
    qr.make();

    const modulesCount = qr.getModuleCount();
    const padding = 45;
    const drawableWidth = size - padding * 2;
    const cellWidth = drawableWidth / modulesCount;

    // Clear background
    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    // Temp Canvas for point-in-polygon Heart Mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the perfect heart mask shape on temp context
    tempCtx.fillStyle = '#000000';
    tempCtx.beginPath();
    tempCtx.moveTo(size / 2, size * 0.23);
    tempCtx.bezierCurveTo(size * 0.05, size * -0.05, size * -0.15, size * 0.45, size / 2, size * 0.94);
    tempCtx.bezierCurveTo(size * 1.15, size * 0.45, size * 0.95, size * -0.05, size / 2, size * 0.23);
    tempCtx.closePath();
    tempCtx.fill();

    // Check contrast ratio
    const currentContrast = calculateContrast(darkColor, lightColor);
    setContrastRatio(currentContrast);

    // Draw modules
    for (let r = 0; r < modulesCount; r++) {
      for (let c = 0; c < modulesCount; c++) {
        if (qr.isDark(r, c)) {
          const cx = padding + c * cellWidth + cellWidth / 2;
          const cy = padding + r * cellWidth + cellWidth / 2;

          // Don't draw modules inside center logo clear zone
          if (isCenterZone(r, c, modulesCount)) continue;

          // If it's a finder pattern, skip drawing here (drawn separately at pixel level for premium styling)
          if (isFinderPattern(r, c, modulesCount)) continue;

          // Check if module center is inside heart mask boundary
          if (!tempCtx.isPointInPath(cx, cy)) continue;

          ctx.fillStyle = darkColor;

          const gap = cellWidth * 0.07;
          const drawW = cellWidth - gap * 2;
          const drawH = cellWidth - gap * 2;

          ctx.beginPath();
          if (moduleStyle === 'rounded') {
            ctx.roundRect(padding + c * cellWidth + gap, padding + r * cellWidth + gap, drawW, drawH, cellWidth * 0.3);
            ctx.fill();
          } else if (moduleStyle === 'dot' || moduleStyle === 'circle') {
            const rad = moduleStyle === 'dot' ? drawW * 0.43 : drawW * 0.5;
            ctx.arc(cx, cy, rad, 0, 2 * Math.PI);
            ctx.fill();
          } else if (moduleStyle === 'diamond') {
            ctx.moveTo(cx, padding + r * cellWidth + gap);
            ctx.lineTo(padding + (c + 1) * cellWidth - gap, cy);
            ctx.lineTo(cx, padding + (r + 1) * cellWidth - gap);
            ctx.lineTo(padding + c * cellWidth + gap, cy);
            ctx.closePath();
            ctx.fill();
          } else { // 'pixel'
            ctx.fillRect(padding + c * cellWidth, padding + r * cellWidth, cellWidth, cellWidth);
          }
        }
      }
    }

    // Draw custom styled Finder Patterns
    const finderSize = cellWidth * 7;
    const finderOffset = (modulesCount - 7) * cellWidth;
    
    const drawCustomFinder = (fx, fy) => {
      ctx.fillStyle = selectedTheme.eyeFrame || darkColor;
      
      if (eyeStyle === 'circle' || eyeStyle === 'gold_ring') {
        if (eyeStyle === 'gold_ring') {
          const goldGrad = ctx.createLinearGradient(fx, fy, fx + finderSize, fy + finderSize);
          goldGrad.addColorStop(0, '#BF953F');
          goldGrad.addColorStop(0.25, '#FCF6BA');
          goldGrad.addColorStop(0.5, '#B38728');
          goldGrad.addColorStop(0.75, '#FBF5B7');
          goldGrad.addColorStop(1, '#AA771C');
          ctx.strokeStyle = goldGrad;
        } else {
          ctx.strokeStyle = selectedTheme.eyeFrame || darkColor;
        }
        ctx.lineWidth = cellWidth;
        ctx.beginPath();
        ctx.arc(fx + finderSize / 2, fy + finderSize / 2, finderSize / 2 - cellWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = selectedTheme.eyeBall || darkColor;
        ctx.beginPath();
        ctx.arc(fx + finderSize / 2, fy + finderSize / 2, cellWidth * 1.5, 0, 2 * Math.PI);
        ctx.fill();
      } else if (eyeStyle === 'soft_square' || eyeStyle === 'rounded') {
        const rad = eyeStyle === 'rounded' ? cellWidth * 2.2 : cellWidth * 1.2;
        ctx.beginPath();
        ctx.roundRect(fx, fy, finderSize, finderSize, rad);
        ctx.roundRect(fx + cellWidth, fy + cellWidth, finderSize - cellWidth * 2, finderSize - cellWidth * 2, rad - cellWidth > 0 ? rad - cellWidth : 0);
        ctx.fill('evenodd');

        ctx.fillStyle = selectedTheme.eyeBall || darkColor;
        ctx.beginPath();
        ctx.roundRect(fx + cellWidth * 2, fy + cellWidth * 2, cellWidth * 3, cellWidth * 3, rad * 0.4);
        ctx.fill();
      } else if (eyeStyle === 'minimal') {
        ctx.strokeStyle = selectedTheme.eyeFrame || darkColor;
        ctx.lineWidth = cellWidth * 0.55;
        ctx.strokeRect(fx + cellWidth * 0.5, fy + cellWidth * 0.5, finderSize - cellWidth, finderSize - cellWidth);

        ctx.fillStyle = selectedTheme.eyeBall || darkColor;
        ctx.beginPath();
        ctx.arc(fx + finderSize / 2, fy + finderSize / 2, cellWidth * 0.85, 0, 2 * Math.PI);
        ctx.fill();
      } else { // 'dot_eye'
        // Draw dotted outer border frame
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < 7; c++) {
            if (r === 0 || r === 6 || c === 0 || c === 6) {
              ctx.beginPath();
              ctx.arc(fx + c * cellWidth + cellWidth / 2, fy + r * cellWidth + cellWidth / 2, cellWidth * 0.43, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
        ctx.fillStyle = selectedTheme.eyeBall || darkColor;
        ctx.beginPath();
        ctx.arc(fx + finderSize / 2, fy + finderSize / 2, cellWidth * 1.6, 0, 2 * Math.PI);
        ctx.fill();
      }
    };

    // Render 3 compliant corners
    drawCustomFinder(padding, padding);
    drawCustomFinder(padding + finderOffset, padding);
    drawCustomFinder(padding, padding + finderOffset);

    // Draw center logo/symbol clearing space
    if (logoType !== 'none') {
      const cx = size / 2;
      const cy = size / 2;
      const whiteRadius = cellWidth * (logoType === 'text' ? 2.8 : 2.2);

      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(cx, cy, whiteRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Render logo artwork
      if (logoType === 'text') {
        ctx.fillStyle = heartColor;
        ctx.font = `900 ${Math.floor(cellWidth * 1.65)}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AnKa', cx, cy);
      } else { // 'heart'
        ctx.fillStyle = heartColor;
        const hr = cellWidth * 0.85;
        ctx.beginPath();
        ctx.arc(cx - hr / 1.1, cy - hr / 2, hr, 0, Math.PI, true);
        ctx.arc(cx + hr / 1.1, cy - hr / 2, hr, 0, Math.PI, true);
        ctx.moveTo(cx - hr * 1.9, cy - hr / 2);
        ctx.lineTo(cx, cy + hr * 1.65);
        ctx.lineTo(cx + hr * 1.9, cy - hr / 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Dynamic Live Scan validation using jsQR
    try {
      const imgData = ctx.getImageData(0, 0, size, size);
      const decoded = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (decoded && decoded.data === liveLink) {
        setScanStatus('perfect');
      } else if (currentContrast < 3.5) {
        setScanStatus('unscannable');
      } else {
        setScanStatus('warning');
      }
    } catch (err) {
      console.warn('Live validation processing error:', err);
      setScanStatus('warning');
    }
  }, [liveLink, darkColor, lightColor, heartColor, moduleStyle, eyeStyle, logoType, selectedTheme]);

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
      alert('Link copied to clipboard!');
    }
  };

  // High Resolution Exports
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `AnKa-Premium-QR-${instanceId}.png`;
    link.href = url;
    link.click();
  };

  const exportSVG = () => {
    // Generate clean vector shape instructions and output a compliant SVG payload
    const qr = qrcode(0, 'H');
    qr.addData(liveLink);
    qr.make();
    const count = qr.getModuleCount();
    const cellSize = 10;
    const padding = 30;
    const totalSize = count * cellSize + padding * 2;

    let paths = '';
    // SVG heart shape mask path
    paths += `<path d="M ${totalSize/2} ${totalSize * 0.23} C ${totalSize * 0.05} ${totalSize * -0.05}, ${totalSize * -0.15} ${totalSize * 0.45}, ${totalSize/2} ${totalSize * 0.94} C ${totalSize * 1.15} ${totalSize * 0.45}, ${totalSize * 0.95} ${totalSize * -0.05}, ${totalSize/2} ${totalSize * 0.23} Z" fill="none" id="heart-clip"/>`;

    // Add actual vector boxes for all pixels inside the heart mask
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c) && !isFinderPattern(r, c, count) && !isCenterZone(r, c, count)) {
          const cx = padding + c * cellSize + cellSize / 2;
          const cy = padding + r * cellSize + cellSize / 2;
          paths += `<rect x="${padding + c * cellSize}" y="${padding + r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${darkColor}" />`;
        }
      }
    }
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}"><rect width="100%" height="100%" fill="${lightColor}"/>${paths}</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `AnKa-Premium-QR-${instanceId}.svg`;
    link.href = url;
    link.click();
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-rosePrimary/20 rounded-[36px] p-6 shadow-2xl space-y-6 animate-fade-in-up text-slate-800 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rosePrimary/5 rounded-full filter blur-xl pointer-events-none"></div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 pb-1 justify-between items-center">
        <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'links' ? 'bg-white shadow-sm text-rosePrimary' : 'text-slate-500 hover:text-rosePrimary'}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Surprise Links</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${activeTab === 'design' ? 'bg-white shadow-sm text-rosePrimary' : 'text-slate-500 hover:text-rosePrimary'}`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>QR Studio</span>
          </button>
        </div>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-rosePrimary transition-colors cursor-pointer"
            title="Regenerate Site Credentials"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {activeTab === 'links' ? (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h4 className="font-heading font-black text-wineDeep text-xl">Surprise Ready! 🚀</h4>
            <p className="font-accent text-rosePrimary text-lg font-bold">"{selectedClosingMsg}"</p>
          </div>

          {/* QR Scan Circle */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rosePrimary to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-4 border border-rosePrimary/10 rounded-3xl inline-block shadow-lg">
                <canvas
                  ref={canvasRef}
                  className="w-52 h-52 mx-auto rounded-2xl bg-white transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>
            
            {/* Live Scan Validation Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-bold">
              {scanStatus === 'perfect' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-700">Scannability validated: 100% Perfect! 🟢</span>
                </>
              )}
              {scanStatus === 'warning' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-amber-700">Complex layout (Slow Scan) ⚠️</span>
                </>
              )}
              {scanStatus === 'unscannable' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-rose-700">Unscannable: Low Contrast! 🔴</span>
                </>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            {handleDownloadPDF && (
              <button
                type="button"
                onClick={() => handleDownloadPDF(darkColor)}
                disabled={downloadingPDF || scanStatus === 'unscannable'}
                className="flex-1 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                <span>{downloadingPDF ? 'Downloading...' : 'Download PDF Card'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={exportPNG}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title="Save PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Links Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Recipient Link */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Surprise Link:</span>
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold text-rosePrimary uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  <span>Preview site</span>
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

            {/* Customizer settings copy link */}
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
      ) : (
        /* QR Designer panel */
        <div className="space-y-5 text-left">
          
          {/* Contrast Protection Alert */}
          {scanStatus === 'unscannable' && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start space-x-2 text-rose-700 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong className="font-bold">Unreadable Contrast! </strong>
                Lighter foreground colors make this QR unscannable. We highly recommend selecting a pre-configured theme.
              </div>
            </div>
          )}

          {/* Curated Theme Select Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Luxury Custom Themes:</span>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
              {QR_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => applyTheme(theme)}
                  className={`p-2 border rounded-xl flex items-center space-x-2 cursor-pointer transition-all duration-300 ${selectedTheme.id === theme.id ? 'border-rosePrimary bg-rose-50/20 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: theme.dark }}></div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-slate-700">{theme.name}</span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest">{theme.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Foreground:</span>
              <input
                type="color"
                value={darkColor}
                onChange={(e) => {
                  setDarkColor(e.target.value);
                  setSelectedTheme({ id: 'custom' });
                }}
                className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
              />
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Background:</span>
              <input
                type="color"
                value={lightColor}
                onChange={(e) => {
                  setLightColor(e.target.value);
                  setSelectedTheme({ id: 'custom' });
                }}
                className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
              />
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Heart/Text:</span>
              <input
                type="color"
                value={heartColor}
                onChange={(e) => setHeartColor(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
              />
            </div>
          </div>

          {/* Module Pattern Options */}
          <div className="space-y-2 border-t border-slate-50 pt-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Module Style:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'rounded', label: 'Rounded Square' },
                { id: 'dot', label: 'Soft Dot' },
                { id: 'circle', label: 'Smooth Circle' },
                { id: 'diamond', label: 'Rounded Diamond' },
                { id: 'pixel', label: 'Classic Pixel' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setModuleStyle(opt.id)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${moduleStyle === opt.id ? 'border-rosePrimary bg-rosePrimary text-white shadow-sm shadow-rosePrimary/25' : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Finder Eyes Options */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finder Pattern Eyes:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'rounded', label: 'Luxury' },
                { id: 'circle', label: 'Glass Ring' },
                { id: 'gold_ring', label: 'Gold Rim' },
                { id: 'soft_square', label: 'Soft Square' },
                { id: 'minimal', label: 'Minimalist' },
                { id: 'dot_eye', label: 'Premium Dot' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEyeStyle(opt.id)}
                  className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${eyeStyle === opt.id ? 'border-rosePrimary bg-rosePrimary/10 text-rosePrimary' : 'border-slate-100 bg-white text-slate-500'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logo overlay settings */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Center Overlay Artwork:</span>
            <div className="flex gap-2">
              {[
                { id: 'text', label: 'AnKa Text' },
                { id: 'heart', label: 'Heart Logo' },
                { id: 'none', label: 'No Artwork' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLogoType(opt.id)}
                  className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${logoType === opt.id ? 'border-rosePrimary bg-rosePrimary/15 text-rosePrimary font-black' : 'border-slate-100 bg-white text-slate-500'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export & Actions Row */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={exportPNG}
              disabled={scanStatus === 'unscannable'}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center disabled:opacity-50"
            >
              Export PNG (High-Res)
            </button>
            <button
              type="button"
              onClick={exportSVG}
              disabled={scanStatus === 'unscannable'}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center disabled:opacity-50"
            >
              Export SVG (Vector)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
