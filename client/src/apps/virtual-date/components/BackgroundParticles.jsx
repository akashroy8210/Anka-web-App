import React, { useEffect, useRef } from "react";

export default function BackgroundParticles({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let shootingStar = null;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        if (theme === "dark") {
          // Twinkling Star Specs
          this.size = Math.random() * 2 + 0.8;
          this.speedX = (Math.random() - 0.5) * 0.06;
          this.speedY = (Math.random() - 0.5) * 0.06;
          this.alpha = Math.random() * 0.65 + 0.2;
          this.pulseSpeed = 0.003 + Math.random() * 0.008;
          this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
          
          // Star colors: #FFE7B3, #FFD89C, #FFF3D4, #FFFFFF
          const starColors = ["#FFE7B3", "#FFD89C", "#FFF3D4", "#FFFFFF"];
          this.color = starColors[Math.floor(Math.random() * starColors.length)];
        } else {
          // Light Mode Petals & Bubbles
          this.size = Math.random() * 6 + 2;
          this.speedY = -(0.15 + Math.random() * 0.45); // Float upwards
          this.speedX = (Math.random() - 0.5) * 0.25; // Gentle drifting
          this.alpha = 0.15 + Math.random() * 0.35;
          this.type = Math.random() > 0.45 ? "bubble" : "petal";
          this.rotation = Math.random() * Math.PI * 2;
          this.rotationSpeed = (Math.random() - 0.5) * 0.02;
          this.color = this.type === "bubble" ? "rgba(255, 255, 255, 0.4)" : "#FBCFE8";
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (theme === "dark") {
          // Twinkle pulse
          this.alpha += this.pulseSpeed * this.pulseDirection;
          if (this.alpha > 0.9) {
            this.alpha = 0.9;
            this.pulseDirection = -1;
          } else if (this.alpha < 0.15) {
            this.alpha = 0.15;
            this.pulseDirection = 1;
          }
          
          // boundary wrapping
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
          if (this.y < 0) this.y = canvas.height;
          if (this.y > canvas.height) this.y = 0;
        } else {
          // Light mode wrap (float up resets to bottom)
          if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
          }
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (theme === "dark") {
          // Twinkling stars
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          if (this.type === "bubble") {
            ctx.strokeStyle = "rgba(232, 180, 188, 0.3)";
            ctx.lineWidth = 0.75;
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            // Cherry Blossom Petal
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = "rgba(248, 200, 220, 0.75)"; // soft light-pink #F8C8DC
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            this.rotation += this.rotationSpeed;
          }
        }
        
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const density = theme === "dark" ? 0.055 : 0.03;
      const count = Math.min(150, Math.floor(canvas.width * canvas.height * 0.0001 * density));
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
      }
    };

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * canvas.width * 0.4,
        y: Math.random() * canvas.height * 0.25,
        dx: 3.5 + Math.random() * 3,
        dy: 1.8 + Math.random() * 1.5,
        length: 70 + Math.random() * 50,
        opacity: 0.95,
        speed: 0.015
      };
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dynamic nebulas / ambient glows in dark mode
      if (theme === "dark") {
        ctx.save();
        // Left ambient nebula
        const gradL = ctx.createRadialGradient(
          canvas.width * 0.2, canvas.height * 0.3, 10,
          canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.3
        );
        gradL.addColorStop(0, "rgba(18, 14, 46, 0.25)");
        gradL.addColorStop(0.5, "rgba(27, 20, 63, 0.12)");
        gradL.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradL;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Right ambient nebula
        const gradR = ctx.createRadialGradient(
          canvas.width * 0.75, canvas.height * 0.6, 20,
          canvas.width * 0.75, canvas.height * 0.6, canvas.width * 0.35
        );
        gradR.addColorStop(0, "rgba(212, 165, 255, 0.04)"); // lavender bleed
        gradR.addColorStop(0.5, "rgba(248, 200, 220, 0.02)"); // pink bleed
        gradR.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Handle Shooting Stars in dark mode
      if (theme === "dark") {
        if (!shootingStar && Math.random() < 0.0006) {
          triggerShootingStar();
        }

        if (shootingStar) {
          ctx.save();
          // Draw trail
          const gradStar = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y,
            shootingStar.x - shootingStar.length, shootingStar.y - shootingStar.length * 0.5
          );
          gradStar.addColorStop(0, `rgba(255, 243, 212, ${shootingStar.opacity})`); // #FFF3D4 shooting star glow
          gradStar.addColorStop(0.7, `rgba(214, 216, 245, ${shootingStar.opacity * 0.3})`);
          gradStar.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.strokeStyle = gradStar;
          ctx.lineWidth = 1.75;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.length,
            shootingStar.y - shootingStar.length * 0.5
          );
          ctx.stroke();

          // Draw head glow
          ctx.fillStyle = "#FFF3D4";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#FFF3D4";
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Update position
          shootingStar.x += shootingStar.dx;
          shootingStar.y += shootingStar.dy;
          shootingStar.opacity -= shootingStar.speed;

          if (
            shootingStar.opacity <= 0 ||
            shootingStar.x > canvas.width ||
            shootingStar.y > canvas.height
          ) {
            shootingStar = null;
          }
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
