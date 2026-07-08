import React, { useEffect, useRef } from 'react';

export default function LivingBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let stars = [];
    let hearts = [];
    let shootingStars = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: 0.01 + Math.random() * 0.015
        });
      }

      hearts = [];
      const numHearts = 15;
      for (let i = 0; i < numHearts; i++) {
        hearts.push(createHeart(true));
      }
    };

    const createHeart = (randomY = false) => {
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size: Math.random() * 8 + 6,
        speedY: 0.4 + Math.random() * 0.6,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayRange: 15 + Math.random() * 15,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.5
      };
    };

    const drawHeartShape = (context, x, y, size) => {
      context.beginPath();
      const d = size;
      context.moveTo(x, y + d / 4);
      context.quadraticCurveTo(x, y, x + d / 2, y);
      context.quadraticCurveTo(x + d, y, x + d, y + d / 3);
      context.quadraticCurveTo(x + d, y + (d * 2) / 3, x + d / 2, y + d);
      context.quadraticCurveTo(x, y + (d * 2) / 3, x, y + d / 3);
      context.quadraticCurveTo(x, y, x, y + d / 4);
      context.closePath();
    };

    const spawnShootingStar = () => {
      if (Math.random() < 0.0008 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * (canvas.width * 0.6),
          y: -20,
          dx: 4 + Math.random() * 5,
          dy: 4 + Math.random() * 5,
          length: 80 + Math.random() * 70,
          life: 1.0,
          decay: 0.012 + Math.random() * 0.008
        });
      }
    };

    const render = () => {
      ctx.fillStyle = '#0B0813'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) {
          s.speed = -s.speed;
        }
        ctx.fillStyle = `rgba(229, 224, 250, ${Math.max(0, Math.min(s.alpha, 0.85))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      hearts.forEach((h, idx) => {
        h.y -= h.speedY;
        h.swayOffset += h.swaySpeed;
        const currentX = h.x + Math.sin(h.swayOffset) * h.swayRange;

        ctx.fillStyle = `rgba(217, 70, 239, ${h.alpha})`; 
        ctx.shadowColor = 'rgba(217, 70, 239, 0.4)';
        ctx.shadowBlur = 10;
        
        drawHeartShape(ctx, currentX, h.y, h.size);
        ctx.fill();
        
        ctx.shadowBlur = 0;

        if (h.y < -20) {
          hearts[idx] = createHeart(false);
        }
      });

      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life -= ss.decay;

        if (ss.life <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          ss.x, ss.y, 
          ss.x - ss.dx * ss.length * 0.1, 
          ss.y - ss.dy * ss.length * 0.1
        );
        gradient.addColorStop(0, `rgba(229, 224, 250, ${ss.life})`);
        gradient.addColorStop(1, 'rgba(229, 224, 250, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.dx * 12, ss.y - ss.dy * 12);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 w-full h-full"
    />
  );
}
