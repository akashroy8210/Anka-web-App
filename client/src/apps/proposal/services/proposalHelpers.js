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
