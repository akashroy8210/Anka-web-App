import React, { useEffect, useRef, useState } from 'react';

/**
 * RainOfHearts - Renders falling, swaying translucent hearts of pink, rose, and wine red.
 * Spawns a single wave starting above the viewport that rains down to the bottom
 * and terminates cleanly after traversing the screen.
 */
export default function RainOfHearts({ active }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
    if (active) {
      setIsRunning(true);
    }
  }, [active]);

  useEffect(() => {
    // Only run canvas loop when running is true
    if (!isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const hearts = [];
    const maxHearts = 60;
    const random = (min, max) => Math.random() * (max - min) + min;

    class HeartParticle {
      constructor() {
        this.x = random(0, canvas.width);
        // Start above the viewport to fall from the top
        this.y = random(-400, -30);
        this.size = random(10, 24);
        
        // Fast speed so they traverse the screen in ~1.5 - 2 seconds
        this.speed = random(canvas.height / 140, canvas.height / 100) + random(2, 4);
        this.sway = random(0.6, 1.8);
        this.swaySpeed = random(0.015, 0.035);
        this.angle = random(0, Math.PI * 2);
        
        const shades = [
          'rgba(225, 29, 72, 0.65)',  // rosePrimary
          'rgba(244, 63, 94, 0.65)',   // lighter rose
          'rgba(190, 18, 60, 0.65)',   // deeper rose
          'rgba(251, 113, 133, 0.65)', // soft pink
          'rgba(136, 19, 55, 0.65)'    // wineDeep
        ];
        this.color = shades[Math.floor(random(0, shades.length))];
      }

      update() {
        this.y += this.speed;
        this.angle += this.swaySpeed;
        this.x += Math.sin(this.angle) * this.sway;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        
        ctx.moveTo(0, -this.size / 4);
        ctx.bezierCurveTo(
          -this.size / 2, -this.size * 0.7,
          -this.size, -this.size * 0.3,
          -this.size, this.size / 4
        );
        ctx.bezierCurveTo(
          -this.size, this.size * 0.6,
          -this.size * 0.3, this.size,
          0, this.size * 1.3
        );
        ctx.bezierCurveTo(
          this.size * 0.3, this.size,
          this.size, this.size * 0.6,
          this.size, this.size / 4
        );
        ctx.bezierCurveTo(
          this.size, -this.size * 0.3,
          this.size / 2, -this.size * 0.7,
          0, -this.size / 4
        );

        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize all hearts above screen
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(new HeartParticle());
    }

    const loop = () => {
      // Exit condition: all hearts have fallen off the bottom
      if (hearts.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let i = hearts.length;
      while (i--) {
        const h = hearts[i];
        h.update();
        if (h.y > canvas.height + 50 || h.x < -50 || h.x > canvas.width + 50) {
          // Remove from loop once they exit the bottom boundary
          hearts.splice(i, 1);
        } else {
          h.draw();
        }
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-45 transition-opacity duration-300 ${
        active || isRunning ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
