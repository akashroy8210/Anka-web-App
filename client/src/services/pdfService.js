/**
 * Service to handle client-side PDF generation containing surprise URLs and QR codes.
 * Premium Luxury Mysterious Edition.
 */
/**
 * Service to handle client-side PDF generation containing surprise URLs and QR codes.
 * World-Class Premium Luxury Mysterious Edition.
 *
 * Design Philosophy: Tiffany & Co. packaging x Apple Event Invitation x Editorial Magazine.
 */
export const generateSurprisePDF = async ({
  instanceId,
  closingMessage,
  recipientName,
  senderName,
  qrColor = 'f46fa5',
  qrBase64,
  bgImage
}) => {
  const loadJsPDF = () => {
    return new Promise((resolve, reject) => {
      if (window.jspdf) {
        resolve(window.jspdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve(window.jspdf || window.umd?.jspdf);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const jspdfModule = await loadJsPDF();
  const jsPDF = jspdfModule.jsPDF;

  // Live surprise target link & Main Homepage target link
  const liveLinkTarget = `${window.location.origin}/s/${instanceId}`;
  const homepageTarget = `${window.location.origin}`;

  const cleanColor = (qrColor || 'f46fa5').replace('#', '');

  const heroQrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&color=${cleanColor}&data=${encodeURIComponent(liveLinkTarget)}`;
  const miniQrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=M&color=${cleanColor}&data=${encodeURIComponent(homepageTarget)}`;

  // Clean unicode characters for standard PDF fonts
  const cleanPdfText = (text) => {
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
  };

  // 1. Helper to fetch image cleanly with CORS support
  const fetchImageBase64 = async (url) => {
    if (!url) return null;
    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (resp.ok) {
        const blob = await resp.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
    } catch (e) {
      // Ignore and fallback to direct Image loading
    }
    return null;
  };

  // 2. Premium Cinematic Background Renderer with Paper Grain, Bokeh & Vignette
  const createCinematicBgData = async (imgUrl) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1131; // Premium A4 aspect ratio
    const ctx = canvas.getContext('2d');

    // Canvas Base Color: Luxury Pastel Blush #FFF7FA
    ctx.fillStyle = '#FFF7FA';
    ctx.fillRect(0, 0, 800, 1131);

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          const img2 = new Image();
          img2.onload = () => resolve(img2);
          img2.onerror = () => resolve(null);
          img2.src = src;
        };
        img.src = src;
      });
    };

    let img = imgUrl ? await loadImage(imgUrl) : null;
    if (!img && typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
      const base64Data = await fetchImageBase64(imgUrl);
      if (base64Data) img = await loadImage(base64Data);
    }

    if (img) {
      // Draw User Background Image with Cinematic Heavy Blur & Desaturation
      ctx.save();
      if ('filter' in ctx) {
        ctx.filter = 'blur(8px) saturate(65%) brightness(102%)';
      }
      ctx.globalAlpha = 0.42;

      const scale = Math.max(800 / img.width, 1131 / img.height);
      const x = (800 - img.width * scale) / 2;
      const y = (1131 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();
    } else {
      // Generate Fallback Premium Pastel Gradient with Soft Light Spheres
      const gradient = ctx.createLinearGradient(0, 0, 800, 1131);
      gradient.addColorStop(0, '#FFF7FA');
      gradient.addColorStop(0.5, '#FFEAF3');
      gradient.addColorStop(1, '#FFD6E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1131);
    }

    // Overlay 1: Ambient Lighting & Floating Bokeh Particles
    ctx.save();
    const bokehCoords = [
      { x: 150, y: 200, r: 120, opacity: 0.15 },
      { x: 680, y: 350, r: 180, opacity: 0.12 },
      { x: 250, y: 850, r: 160, opacity: 0.18 },
      { x: 600, y: 950, r: 140, opacity: 0.14 }
    ];

    bokehCoords.forEach((b) => {
      const bGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      bGrad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity})`);
      bGrad.addColorStop(1, 'rgba(255, 214, 232, 0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Overlay 2: Soft White & Rose Lighting Bloom
    const bloomGrad = ctx.createRadialGradient(400, 480, 50, 400, 480, 500);
    bloomGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    bloomGrad.addColorStop(0.6, 'rgba(255, 247, 250, 0.2)');
    bloomGrad.addColorStop(1, 'rgba(244, 111, 165, 0.08)');
    ctx.fillStyle = bloomGrad;
    ctx.fillRect(0, 0, 800, 1131);

    // Overlay 3: Ultra-Soft Vignette Border
    const vignette = ctx.createRadialGradient(400, 565, 300, 400, 565, 750);
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vignette.addColorStop(0.7, 'rgba(255, 234, 243, 0.35)');
    vignette.addColorStop(1, 'rgba(74, 45, 62, 0.12)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 800, 1131);

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  // 3. Helper to render Hero QR Code Card Base64
  const getHeroQrBase64 = async (url, colorHex = 'f46fa5') => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        canvas.getContext('2d').drawImage(img, 0, 0, 600, 600);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  };

  // 4. Helper for Mini Simple QR Image
  const getSimpleQrBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 0, 0, 300, 300);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Process image resources concurrently
  const [cinematicBgData, heroQrData, miniQrData] = await Promise.all([
    createCinematicBgData(bgImage),
    qrBase64 || getHeroQrBase64(heroQrApiUrl, cleanColor),
    getSimpleQrBase64(miniQrApiUrl)
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ==========================================
  // 1. BACKGROUND CANVAS
  // ==========================================
  if (cinematicBgData) {
    doc.addImage(cinematicBgData, 'JPEG', 0, 0, 210, 297);
  } else {
    doc.setFillColor(255, 247, 250); // #FFF7FA
    doc.rect(0, 0, 210, 297, 'F');
  }

  let currentY = 32;

  // ==========================================
  // 2. LUXURY TOP CAPSULE BADGE
  // ==========================================
  const badgeWidth = 65 ;
  const badgeHeight = 8;
  const badgeX = (210 - badgeWidth) / 2;

  // Glassmorphism Capsule Pill Background
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 214, 232); // #FFD6E8 Accent Border
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, currentY, badgeWidth, badgeHeight, 4, 4, 'FD');

  // Accent Dot
  doc.setFillColor(244, 111, 165); // #F46FA5
  doc.circle(badgeX + 6, currentY + 4, 1.2, 'F');

  // Badge Text
  doc.setTextColor(74, 45, 62); // #4A2D3E
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('RESERVED FOR SOMEONE SPECIAL', badgeX + 11, currentY + 5.3);

  currentY += 24;

  // ==========================================
  // 3. EDITORIAL HEADING
  // ==========================================
  doc.setTextColor(74, 45, 62); // #4A2D3E
  doc.setFont('times', 'bold');
  doc.setFontSize(23);

  const headlineText = recipientName
    ? `Created Just For You, ${cleanPdfText(recipientName)}`
    : 'Reserved For One Special Person';

  const wrappedHeadline = doc.splitTextToSize(headlineText, 155);
  doc.text(wrappedHeadline, 105, currentY, { align: 'center' });
  currentY += (wrappedHeadline.length * 9.5) + 3;

  // ==========================================
  // 4. ELEGANT SUBTITLE
  // ==========================================
  doc.setTextColor(244, 111, 165); // #F46FA5 Accent Pink
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.text('Some gifts are too personal to explain. They must be experienced.', 105, currentY, { align: 'center' });

  currentY += 18;

  // ==========================================
  // 5. HERO QR CARD CONTAINER (Jewel Box)
  // ==========================================
  const cardSize = 118; // Spacious, perfectly proportioned
  const cardX = (210 - cardSize) / 2;
  const cardY = currentY;

  // Soft Ambient Pink Glow Layer Behind Card
  doc.setFillColor(255, 214, 232); // #FFD6E8 Soft Rose Glow
  doc.roundedRect(cardX - 3, cardY + 3, cardSize + 6, cardSize + 6, 12, 12, 'F');

  // Frosted Glass Main Card Container (#FFFFFF)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 234, 243); // Soft white/rose rim
  doc.setLineWidth(0.5);
  doc.roundedRect(cardX, cardY, cardSize, cardSize, 10, 10, 'FD');

  // Inner Subtle Border Frame Inside Card
  doc.setDrawColor(255, 247, 250);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX + 4, cardY + 4, cardSize - 8, cardSize - 8, 8, 8, 'D');

  // Decorative Corner Sparkles / Accents around Card
  doc.setDrawColor(244, 111, 165);
  doc.setLineWidth(0.4);
  // Top-Left Corner Accent
  doc.line(cardX - 5, cardY + 12, cardX - 5, cardY - 5);
  doc.line(cardX - 5, cardY - 5, cardX + 12, cardY - 5);
  // Bottom-Right Corner Accent
  doc.line(cardX + cardSize + 5, cardY + cardSize - 12, cardX + cardSize + 5, cardY + cardSize + 5);
  doc.line(cardX + cardSize + 5, cardY + cardSize + 5, cardX + cardSize - 12, cardY + cardSize + 5);

  // Render QR Code inside Frosted Glass Container
  const qrPadding = 12;
  const qrImageSize = cardSize - (qrPadding * 2);
  doc.addImage(heroQrData, 'PNG', cardX + qrPadding, cardY + qrPadding, qrImageSize, qrImageSize);

  currentY += cardSize + 16;

  // ==========================================
  // 6. EMOTIONAL INSTRUCTION
  // ==========================================
  doc.setTextColor(74, 45, 62); // #4A2D3E
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('When you\'re ready... Begin.', 105, currentY, { align: 'center' });

  currentY += 18;

  // ==========================================
  // 7. HANDWRITTEN CREATOR SIGNATURE BLOCK
  // ==========================================
  doc.setTextColor(244, 111, 165); // #F46FA5 Accent Pink
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Crafted especially for someone unforgettable.', 105, currentY, { align: 'center' });

  currentY += 6;

  const cleanSender = cleanPdfText(senderName) || 'Someone Special';
  doc.setTextColor(74, 45, 62); // #4A2D3E
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(15);
  doc.text(`— ${cleanSender}`, 105, currentY, { align: 'center' });

  // ==========================================
  // 8. BOTTOM-RIGHT BRAND SIGNATURE WIDGET
  // ==========================================
  if (miniQrData) {
    const miniCardWidth = 42;
    const miniCardHeight = 22;
    const miniCardX = 158;
    const miniCardY = 262;

    // Mini Floating Glass Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 214, 232);
    doc.setLineWidth(0.3);
    doc.roundedRect(miniCardX, miniCardY, miniCardWidth, miniCardHeight, 4, 4, 'FD');

    // Mini QR Code
    const miniQrSize = 16;
    doc.addImage(miniQrData, 'PNG', miniCardX + 3, miniCardY + 3, miniQrSize, miniQrSize);

    // Brand Label & Caption Stack
    doc.setTextColor(74, 45, 62);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('AnKa', miniCardX + 22, miniCardY + 9);

    doc.setTextColor(244, 111, 165);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.text('Create Your Own', miniCardX + 22, miniCardY + 13.5);
    doc.text('Surprise', miniCardX + 22, miniCardY + 16.5);
  }

  // Save PDF document
  const pdfFileName = recipientName 
    ? `Private_Invitation_${cleanPdfText(recipientName)}.pdf` 
    : `Private_Invitation_${instanceId}.pdf`;
    
  doc.save(pdfFileName);
};

