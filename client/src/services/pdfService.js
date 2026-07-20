/**
 * Service to handle client-side PDF generation containing surprise URLs and QR codes.
 */
export const generateSurprisePDF = async ({ instanceId, closingMessage, recipientName, senderName, qrColor = 'be123c' }) => {
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

  // Encode only the live surprise website URL inside the QR code
  const liveLinkTarget = `${window.location.origin}/s/${instanceId}`;
  const cleanColor = qrColor.replace('#', '');
  const colorfulQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=H&color=${cleanColor}&data=${encodeURIComponent(liveLinkTarget)}`;
  
  const getBase64 = async (url, colorHex = 'be123c') => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 500;
        tempCanvas.height = 500;
        const tempCtx = tempCanvas.getContext('2d');
        
        // 1. Draw solid heart shape mask
        tempCtx.fillStyle = '#000000';
        tempCtx.beginPath();
        tempCtx.moveTo(250, 125);
        tempCtx.bezierCurveTo(50, -25, -50, 250, 250, 475);
        tempCtx.bezierCurveTo(550, 250, 450, -25, 250, 125);
        tempCtx.closePath();
        tempCtx.fill();
        
        // 2. Draw QR code masked inside heart (centered and slightly scaled down to keep finder patterns inside)
        tempCtx.globalCompositeOperation = 'source-in';
        const qrSize = Math.floor(500 * 0.82); // 410px
        const qrOffset = (500 - qrSize) / 2;
        tempCtx.drawImage(img, qrOffset, qrOffset - 15, qrSize, qrSize);
        
        // 3. Reset composite operation and draw center white circle (slightly shifted to visual center)
        tempCtx.globalCompositeOperation = 'source-over';
        const centerRadius = 68;
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.beginPath();
        tempCtx.arc(250, 250 - 3, centerRadius, 0, 2 * Math.PI);
        tempCtx.fill();
        
        // 4. Draw AnKa logo text in center
        tempCtx.fillStyle = '#' + colorHex.replace('#', '');
        tempCtx.font = '900 38px sans-serif';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText('AnKa', 250, 250 - 2);
        
        // 5. Draw white background on main canvas and paint masked QR
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 500, 500);
        ctx.drawImage(tempCanvas, 0, 0);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const qrBase64 = await getBase64(colorfulQrUrl, qrColor);

  // Clean emojis and non-ASCII unicode characters from text for standard PDF fonts
  const cleanPdfText = (text) => {
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Dark theme background matching our premium website theme
  doc.setFillColor(8, 5, 15);
  doc.rect(0, 0, 210, 297, 'F');

  // Rose/gold double border
  doc.setDrawColor(225, 29, 72); // Rose
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 190, 277);
  
  doc.setDrawColor(244, 63, 94); // Light rose
  doc.setLineWidth(0.5);
  doc.rect(12, 12, 186, 273);

  let currentY = 40;

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('A Beautiful Surprise Awaits...', 105, currentY, { align: 'center' });
  currentY += 15;

  // Subheading / Emotional Message
  doc.setTextColor(244, 63, 94);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(13);
  const cleanMsg = `"${cleanPdfText(closingMessage)}"`;
  const wrappedMsg = doc.splitTextToSize(cleanMsg, 160);
  doc.text(wrappedMsg, 105, currentY, { align: 'center' });
  currentY += (wrappedMsg.length * 6) + 10;

  // Heart separator placeholder (Vector Heart Shape)
  doc.setFillColor(225, 29, 72);
  doc.ellipse(105 - 2.5, currentY, 3, 3, 'F');
  doc.ellipse(105 + 2.5, currentY, 3, 3, 'F');
  doc.triangle(105 - 5.4, currentY + 1.2, 105 + 5.4, currentY + 1.2, 105, currentY + 7.5, 'F');
  currentY += 12;

  // QR Frame card (white backdrop)
  const boxWidth = 90;
  const boxHeight = 90;
  const boxX = (210 - boxWidth) / 2;
  const boxY = currentY;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4, 'F');

  // Big Colorful QR Code
  doc.addImage(qrBase64, 'PNG', boxX + 3, boxY + 3, boxWidth - 6, boxHeight - 6);
  currentY += boxHeight + 10;

  // Instructions
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Scan the QR code above with your phone camera to begin', 105, currentY, { align: 'center' });
  currentY += 15;

  // Emotional Footer Message
  doc.setTextColor(244, 63, 94);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.text('Every moment with you is a gift, and I wanted to make this', 105, currentY, { align: 'center' });
  doc.text('special page just to show you how much I care...', 105, currentY + 6, { align: 'center' });
  currentY += 18;

  // Created for names
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const cleanRecipient = cleanPdfText(recipientName) || 'You';
  const cleanSender = cleanPdfText(senderName) || 'Someone Special';
  
  const recipientLine = `Made with Love for: ${cleanRecipient}`;
  const senderLine = `From: ${cleanSender}`;
  
  const wrappedRecip = doc.splitTextToSize(recipientLine, 160);
  const wrappedSend = doc.splitTextToSize(senderLine, 160);

  doc.text(wrappedRecip, 105, currentY, { align: 'center' });
  currentY += (wrappedRecip.length * 6) + 2;
  doc.text(wrappedSend, 105, currentY, { align: 'center' });

  doc.save(`Surprise_QR_Card_${instanceId}.pdf`);
};
