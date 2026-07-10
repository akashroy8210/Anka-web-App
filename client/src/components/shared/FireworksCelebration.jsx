import React, { useEffect, useRef, useState } from 'react';

/**
 * FireworksCelebration - Canvas-based particle fireworks celebration overlay.
 * Launches fireworks from bottom corners targeting left and right top zones, keeping
 * the center cake column clear. Extinguishes naturally when deactivated without freezes.
 */
export default function FireworksCelebration({ active, duration = 0 }) {
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
    // Only initialize the loop if isRunning is true
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

    const particles = [];
    const fireworks = [];

    const random = (min, max) => Math.random() * (max - min) + min;

    class Firework {
      constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2.5;
        this.acceleration = 1.04;
        this.brightness = random(55, 75);
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.hypot(this.x + vx - this.sx, this.y + vy - this.sy);

        if (this.distanceTraveled >= this.distanceToTarget) {
          createParticles(this.tx, this.ty);
          fireworks.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1.5, 9);
        this.friction = 0.94;
        this.gravity = 0.8;
        this.hue = random(0, 360);
        this.brightness = random(60, 85);
        this.alpha = 1;
        this.decay = random(0.015, 0.028);
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    const createParticles = (x, y) => {
      let count = 35;
      while (count--) {
        particles.push(new Particle(x, y));
      }
    };

    let timerTick = 0;

    const loop = () => {
      const timeElapsed = Date.now() - startTimeRef.current;
      const shouldStopSpawning = !activeRef.current || (duration > 0 && timeElapsed > duration * 1000);

      // Clean exit condition: requested stop AND no active particles/fireworks left on canvas
      if (shouldStopSpawning && fireworks.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(loop);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      // Spawns fireworks only if spawning is still active
      if (!shouldStopSpawning) {
        if (timerTick >= 15) {
          // Launch from bottom corners (left or right) to keep center cake column clear
          const launchFromLeft = Math.random() < 0.5;
          const startX = launchFromLeft ? random(30, canvas.width * 0.2) : random(canvas.width * 0.8, canvas.width - 30);
          const startY = canvas.height;
          
          const targetY = random(canvas.height * 0.08, canvas.height * 0.38);
          // Target left or right top zones respectively to stay at a distance from center cake
          const targetX = launchFromLeft
            ? random(canvas.width * 0.05, canvas.width * 0.38)
            : random(canvas.width * 0.62, canvas.width * 0.95);
          
          fireworks.push(new Firework(startX, startY, targetX, targetY));
          timerTick = 0;
        } else {
          timerTick++;
        }
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
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
