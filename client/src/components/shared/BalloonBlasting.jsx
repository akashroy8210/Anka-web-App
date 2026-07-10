import React, { useEffect, useRef, useState } from 'react';

/**
 * BalloonBlasting - Spawns floating 3D-shaded balloons that blast/pop with colorful
 * particles randomly. Spawns balloons on the left and right sides to keep distance
 * from the center cake column. Fades out naturally when deactivated without freezes.
 */
export default function BalloonBlasting({ active, duration = 0 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  // Use a ref to track active state dynamically inside the canvas loop
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
    if (active) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [active]);

  useEffect(() => {
    // Only initialize loop when isRunning is true
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

    const balloons = [];
    const particles = [];
    const colors = ['#e11d48', '#fb7185', '#be123c', '#fbbf24', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

    const random = (min, max) => Math.random() * (max - min) + min;

    class Balloon {
      constructor() {
        // Spawn strictly to the left or right to keep distance from the center cake column
        const spawnOnLeft = Math.random() < 0.5;
        this.x = spawnOnLeft
          ? random(40, canvas.width * 0.35)
          : random(canvas.width * 0.65, canvas.width - 40);
          
        this.y = canvas.height + 100;
        this.radiusX = random(22, 32);
        this.radiusY = this.radiusX * 1.25;
        this.speed = random(3.5, 6.5);
        this.color = colors[Math.floor(random(0, colors.length))];
        this.sway = random(0.6, 2.2);
        this.swaySpeed = random(0.012, 0.028);
        this.angle = random(0, Math.PI * 2);
        this.popped = false;
        
        // Random top target area to pop automatically
        this.popTargetY = random(canvas.height * 0.08, canvas.height * 0.42);
      }

      update() {
        this.y -= this.speed;
        this.angle += this.swaySpeed;
        this.x += Math.sin(this.angle) * this.sway;

        if (this.y <= this.popTargetY && !this.popped) {
          this.pop();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x - this.radiusX * 0.28,
          this.y - this.radiusY * 0.28,
          this.radiusX * 0.08,
          this.x,
          this.y,
          this.radiusX
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, this.darkenColor(this.color));

        ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radiusY);
        ctx.lineTo(this.x - 6, this.y + this.radiusY + 8);
        ctx.lineTo(this.x + 6, this.y + this.radiusY + 8);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radiusY + 8);
        ctx.bezierCurveTo(
          this.x - 8, this.y + this.radiusY + 28,
          this.x + 8, this.y + this.radiusY + 58,
          this.x, this.y + this.radiusY + 88
        );
        ctx.strokeStyle = 'rgba(140, 140, 140, 0.35)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
      }

      pop() {
        this.popped = true;
        const burstCount = 18;
        for (let i = 0; i < burstCount; i++) {
          particles.push(new PopParticle(this.x, this.y, this.color));
        }
      }

      darkenColor(hex) {
        let R = parseInt(hex.substring(1, 3), 16);
        let G = parseInt(hex.substring(3, 5), 16);
        let B = parseInt(hex.substring(5, 7), 16);
        R = Math.max(0, R - 40);
        G = Math.max(0, G - 40);
        B = Math.max(0, B - 40);
        return `rgb(${R}, ${G}, ${B})`;
      }
    }

    class PopParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = random(2.2, 5.5);
        this.angle = random(0, Math.PI * 2);
        this.speed = random(2.5, 9);
        this.friction = 0.94;
        this.gravity = 0.18;
        this.alpha = 1;
        this.decay = random(0.02, 0.038);
      }

      update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.restore();
      }
    }

    const loop = () => {
      // Check if time-limit or deactivation requested
      const timeElapsed = Date.now() - startTimeRef.current;
      const shouldStopSpawning = !activeRef.current || (duration > 0 && timeElapsed > duration * 1000);

      // Clean exit condition: requested stop AND no active particles/balloons left on canvas
      if (shouldStopSpawning && balloons.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(loop);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawns balloons only if spawning is still active
      if (!shouldStopSpawning) {
        if (Math.random() < 0.05 && balloons.length < 20) {
          balloons.push(new Balloon());
        }
      }

      let i = balloons.length;
      while (i--) {
        const b = balloons[i];
        b.update();
        if (b.popped || b.y < -150) {
          balloons.splice(i, 1);
        } else {
          b.draw();
        }
      }

      let j = particles.length;
      while (j--) {
        const p = particles[j];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(j, 1);
        } else {
          p.draw();
        }
      }
    };

    const handleCanvasClick = (e) => {
      if (!activeRef.current) return;
      const clickX = e.clientX;
      const clickY = e.clientY;

      balloons.forEach((b) => {
        const dist = Math.hypot(clickX - b.x, clickY - b.y);
        if (dist <= b.radiusX * 1.6) {
          b.pop();
        }
      });
    };
    window.addEventListener('click', handleCanvasClick);

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]); // ONLY restart canvas loop if isRunning changes!

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-50 transition-opacity duration-500 ${
        active || isRunning ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
