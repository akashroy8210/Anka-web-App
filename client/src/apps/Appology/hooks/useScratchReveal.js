import { useRef, useEffect, useState } from 'react';

export function useScratchReveal(onCompleteThreshold = 0.25) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas internal coordinate system to match exact rendered bounding box
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 150);
    canvas.width = width;
    canvas.height = height;

    // Dynamically compute scratch surface gradient foil colors from active theme CSS variables
    const wrapper = canvas.closest('.apology-wrapper') || document.body;
    const computed = getComputedStyle(wrapper);
    const primaryAccent = computed.getPropertyValue('--ap-primary-accent').trim() || '#E8799E';
    const deepRose = computed.getPropertyValue('--ap-deep-rose').trim() || '#8A2045';
    const goldAccent = computed.getPropertyValue('--ap-gold-accent').trim() || '#FBBF24';

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, primaryAccent);
    grad.addColorStop(0.5, deepRose);
    grad.addColorStop(1, goldAccent);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic Sparkle dust overlay
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.75)' : goldAccent;
      const size = Math.random() * 3 + 1;
      ctx.fillRect(Math.random() * width, Math.random() * height, size, size);
    }

    // Scratch prompt badge border & text rendered on canvas surface
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.roundRect ? ctx.roundRect(width / 2 - 120, height / 2 - 20, 240, 40, 20) : ctx.fillRect(width / 2 - 120, height / 2 - 20, 240, 40);
    ctx.fill();

    ctx.font = 'bold 15px serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch to Reveal ✨', width / 2, height / 2);

    let isScratching = false;

    function getPos(e) {
      const currentRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - currentRect.left) * (canvas.width / currentRect.width),
        y: (clientY - currentRect.top) * (canvas.height / currentRect.height)
      };
    }

    function scratch(e) {
      if (!isScratching || isRevealed) return;
      const pos = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 42, 0, Math.PI * 2);
      ctx.fill();

      checkProgress();
    }

    function checkProgress() {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let clearPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
      }
      const percent = clearPixels / (pixels.length / 4);
      setScratchPercent(percent);

      if (percent >= onCompleteThreshold && !isRevealed) {
        setIsRevealed(true);
        ctx.clearRect(0, 0, width, height);
      }
    }

    function start(e) {
      isScratching = true;
      scratch(e);
    }

    function stop() {
      isScratching = false;
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);

    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', scratch, { passive: true });
    canvas.addEventListener('touchend', stop);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', stop);
    };
  }, [isRevealed, onCompleteThreshold]);

  const revealManually = () => {
    setIsRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return { canvasRef, isRevealed, scratchPercent, revealManually };
}
