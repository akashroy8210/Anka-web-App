import React, { useEffect, useRef } from 'react';

export default function LivingBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let stars = [];
    let customParticles = [];
    let shootingStars = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      // 1. Initialize Star Field
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        let starColor = 'rgba(229, 224, 250, ';
        if (theme === 'royal-gold' || theme === 'golden' || theme === 'wedding-golden' || theme === 'newyear-golden') {
          starColor = 'rgba(251, 191, 36, '; // Gold
        } else if (theme === 'pastel-dream' || theme === 'pastel' || theme === 'friend-pastel' || theme === 'friendship-pastel') {
          starColor = 'rgba(192, 132, 252, '; // Lavender/violet
        } else if (theme === 'retro-vintage' || theme === 'friend-vintage') {
          starColor = 'rgba(245, 158, 11, '; // Amber
        }

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: 0.01 + Math.random() * 0.015,
          color: starColor
        });
      }

      // 2. Initialize Thematic Particles
      customParticles = [];
      const numParticles = 18;
      for (let i = 0; i < numParticles; i++) {
        customParticles.push(createParticle(true));
      }
    };

    const createParticle = (randomY = false) => {
      // Different types of particles per theme:
      // - neon-confetti: colored confetti rectangles that sway and rotate
      // - royal-gold: golden glitters/diamonds
      // - pastel-dream: floating soft balloons or bubbles
      // - retro-vintage: floating warm dust specks or vintage grain
      let type = 'heart';
      let color = 'rgba(217, 70, 239, '; // neon pink base
      let size = Math.random() * 8 + 6;

      if (theme === 'neon-confetti' || theme === 'neon' || theme === 'friend-neon' || theme === 'newyear-neon') {
        type = 'confetti';
        const colors = [
          'rgba(244, 63, 94, ', // rose
          'rgba(59, 130, 246, ', // blue
          'rgba(16, 185, 129, ', // green
          'rgba(245, 158, 11, ', // orange
          'rgba(168, 85, 247, '  // purple
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 6 + 4;
      } else if (theme === 'royal-gold' || theme === 'golden' || theme === 'wedding-golden' || theme === 'newyear-golden' || theme === 'sparkling') {
        type = 'sparkle';
        color = 'rgba(251, 191, 36, '; // gold
        size = Math.random() * 5 + 4;
      } else if (theme === 'pastel-dream' || theme === 'pastel' || theme === 'friend-pastel' || theme === 'friendship-pastel' || theme === 'pastel-polaroid') {
        type = 'bubble';
        const colors = [
          'rgba(244, 180, 26, ', 
          'rgba(244, 63, 94, ', 
          'rgba(192, 132, 252, '
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 12 + 6;
      } else if (theme === 'retro-vintage' || theme === 'friend-vintage' || theme === 'meme') {
        type = 'dust';
        color = 'rgba(180, 83, 9, '; // sepia/brown-orange
        size = Math.random() * 3 + 2;
      }

      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size,
        type,
        color,
        speedY: 0.3 + Math.random() * 0.5,
        swaySpeed: 0.01 + Math.random() * 0.015,
        swayRange: 10 + Math.random() * 20,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.45,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      };
    };

    const drawHeartShape = (context, x, y, size) => {
      context.moveTo(x, y + size / 4);
      context.quadraticCurveTo(x, y, x + size / 2, y);
      context.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      context.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, size + y);
      context.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      context.quadraticCurveTo(x, y, x, y + size / 4);
    };

    const drawSparkleShape = (context, x, y, size) => {
      context.moveTo(x, y - size);
      context.quadraticCurveTo(x, y, x + size, y);
      context.quadraticCurveTo(x, y, x, y + size);
      context.quadraticCurveTo(x, y, x - size, y);
      context.quadraticCurveTo(x, y, x, y - size);
    };

    const spawnShootingStar = () => {
      if (Math.random() < 0.001 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * (canvas.width * 0.6),
          y: -20,
          dx: 3 + Math.random() * 4,
          dy: 3 + Math.random() * 4,
          length: 60 + Math.random() * 50,
          life: 1.0,
          decay: 0.015 + Math.random() * 0.01
        });
      }
    };

    const render = () => {
      // 1. Draw Backdrop Fill
      let bg = '#0B0813'; // Default dark purple
      if (theme === 'royal-gold') {
        bg = '#0b0a07'; // Golden black
      } else if (theme === 'pastel-dream') {
        bg = '#130d22'; // Soft lavender navy
      } else if (theme === 'retro-vintage') {
        bg = '#0f0e0c'; // Warm typewriter dark coffee
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Stars
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) {
          s.speed = -s.speed;
        }
        ctx.fillStyle = `${s.color}${Math.max(0, Math.min(s.alpha, 0.75))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Thematic Particles
      customParticles.forEach((p, idx) => {
        p.y -= p.speedY;
        p.swayOffset += p.swaySpeed;
        p.rotation += p.rotationSpeed;
        const currentX = p.x + Math.sin(p.swayOffset) * p.swayRange;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        
        ctx.beginPath();
        if (p.type === 'confetti') {
          // Draw rotated confetti rectangle
          ctx.save();
          ctx.translate(currentX, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
          ctx.restore();
        } else if (p.type === 'sparkle') {
          // Draw diamond sparkle star
          ctx.save();
          ctx.translate(currentX, p.y);
          ctx.rotate(p.rotation);
          ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
          ctx.shadowBlur = 8;
          drawSparkleShape(ctx, 0, 0, p.size);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'bubble') {
          // Draw transparent glowing bubbles
          ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          // Draw slow moving dust particles
          ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Default: heart shape
          ctx.shadowColor = 'rgba(217, 70, 239, 0.3)';
          ctx.shadowBlur = 6;
          drawHeartShape(ctx, currentX, p.y, p.size);
          ctx.fill();
        }

        ctx.shadowBlur = 0;

        if (p.y < -30) {
          customParticles[idx] = createParticle(false);
        }
      });

      // 4. Draw Shooting Stars
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

        const gradientColor = theme === 'royal-gold' ? '251, 191, 36' : '229, 224, 250';
        const gradient = ctx.createLinearGradient(
          ss.x, ss.y, 
          ss.x - ss.dx * ss.length * 0.1, 
          ss.y - ss.dy * ss.length * 0.1
        );
        gradient.addColorStop(0, `rgba(${gradientColor}, ${ss.life})`);
        gradient.addColorStop(1, `rgba(${gradientColor}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.dx * 10, ss.y - ss.dy * 10);
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 w-full h-full animate-fade-in"
    />
  );
}
