"use client";

import { useEffect, useRef } from "react";

const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let time = 0;
    
    // Default to center if no interaction yet
    let mouseX = width / 2;
    let mouseY = height / 2;
    // Smoothed values
    let smoothedMouseY = mouseY;
    let smoothedMouseX = mouseX;

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Initial size
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth out the mouse interaction
      smoothedMouseY += (mouseY - smoothedMouseY) * 0.1;
      smoothedMouseX += (mouseX - smoothedMouseX) * 0.1;

      // Calculate parameters
      const normalizedX = smoothedMouseX / width;
      const normalizedY = smoothedMouseY / height;
      
      const baseAmplitude = height * 0.1;
      // Amplitude reacts to vertical position
      const dynamicAmplitude = baseAmplitude + (1 - Math.abs(0.5 - normalizedY)) * (height * 0.1);
      
      const waveCount = 5;
      const speed = 0.01 + (normalizedX * 0.02);

      time += speed;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        // hue cycling
        // const hue = (time * 10 + i * 20) % 360; 
        
        // Use brand colors (Cyan/Blue) with varying opacity
        ctx.strokeStyle = `hsla(${190 + (normalizedX * 60) + (i * 10)}, 70%, 50%, ${0.1 + (i * 0.05)})`;
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x+=5) { // Optimization: step by 5
          const frequency = 0.005 + (i * 0.002) + (normalizedX * 0.002);
          const y = height / 2 + 
                    Math.sin(x * frequency + time + i) * dynamicAmplitude +
                    Math.cos(x * 0.002 - time) * (dynamicAmplitude * 0.5);
          
          if (x === 0) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Moving Glow following cursor
      const gradient = ctx.createRadialGradient(smoothedMouseX, smoothedMouseY, 0, smoothedMouseX, smoothedMouseY, 200);
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.15)"); // Cyan glow
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,width,height);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ touchAction: 'none' }} 
    />
  );
};

export default InteractiveBackground;
