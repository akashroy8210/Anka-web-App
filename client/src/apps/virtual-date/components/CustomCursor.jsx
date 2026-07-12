import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor({ theme }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [trail, setTrail] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  
  const cursorRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Detect if touchscreen
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (isTouchDevice) return;

    // Mouse move tracking
    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      
      // Add a spark to the trail
      if (Math.random() > 0.4) {
        const sparks = theme === "dark" 
          ? ["✨", "⭐", "💜", "🌸"] 
          : ["🌸", "🫧", "💮", "✨"];
        const randomSpark = sparks[Math.floor(Math.random() * sparks.length)];

        setTrail((prev) => [
          ...prev.slice(-15), // keep last 15 elements
          {
            id: Math.random(),
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 8 + 6,
            rotation: Math.random() * 360,
            char: randomSpark,
            alpha: 1
          }
        ]);
      }
    };

    // Hover detection on buttons and links
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // Smooth movement logic (Lerp)
    let animationFrameId;
    const updateCursor = () => {
      const dx = targetRef.current.x - cursorRef.current.x;
      const dy = targetRef.current.y - cursorRef.current.y;
      
      cursorRef.current.x += dx * 0.15;
      cursorRef.current.y += dy * 0.15;
      
      setPosition({ x: cursorRef.current.x, y: cursorRef.current.y });
      
      // Update trail opacity
      setTrail((prev) =>
        prev
          .map((spark) => ({ ...spark, alpha: spark.alpha - 0.04 }))
          .filter((spark) => spark.alpha > 0)
      );

      animationFrameId = requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice, theme]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail particles */}
      {trail.map((spark) => (
        <span
          key={spark.id}
          className="fixed pointer-events-none z-50 select-none font-bold transition-transform duration-700 ease-out"
          style={{
            left: spark.x,
            top: spark.y,
            fontSize: `${spark.size}px`,
            opacity: spark.alpha,
            transform: `translate(-50%, -50%) rotate(${spark.rotation}deg)`,
            textShadow: theme === "dark" 
              ? "0 0 5px rgba(212, 165, 255, 0.5)" 
              : "0 0 4px rgba(232, 180, 188, 0.4)"
          }}
        >
          {spark.char}
        </span>
      ))}

      {/* Main cursor dot */}
      <div
        className={`fixed top-0 left-0 w-6 h-6 rounded-full border pointer-events-none z-50 select-none transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
          ${isHovered 
            ? "scale-150 bg-romantic-pink/20 border-romantic-pink" 
            : "border-romantic-pink/85 bg-romantic-pink/10 shadow-[0_2px_10px_var(--glow-shadow)]"
          }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <span className={`transition-transform duration-300 ${isHovered ? "scale-125" : "scale-75"}`}>
          ❤️
        </span>
      </div>
    </>
  );
}
