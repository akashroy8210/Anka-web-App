export function playChime() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, context.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, context.currentTime + 0.15); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, context.currentTime + 0.3); // D6
    
    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    osc.start();
    osc.stop(context.currentTime + 0.8);
  } catch (e) {
    console.warn('Procedural chime sound blocked by browser autoplay rules.', e);
  }
}

export function formatRecipientName(name) {
  if (!name) return '';
  return name.trim().split(' ')[0];
}

export function getHeartCoordinates(index, total) {
  if (total <= 1) {
    return { x: 50, y: 48 };
  }
  // Map index to angle t from 0 to 2*PI
  const t = (index / total) * 2 * Math.PI - Math.PI / 2;
  // Parametric heart coordinates
  const heartX = 16 * Math.pow(Math.sin(t), 3);
  const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  
  // Scale and center to fit beautifully inside a responsive canvas grid
  const x = 50 + (heartX * 2.2);
  const y = 48 - (heartY * 2.2); // invert y for canvas coordinates
  return { x, y };
}
