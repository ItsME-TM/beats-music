"use client";

import { useEffect, useRef } from "react";

const InteractiveWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let smoothedMouseY = mouseY;

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches[0]) {
            mouseX = e.touches[0].clientX - rect.left;
            mouseY = e.touches[0].clientY - rect.top;
        }
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Initial size
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth out the mouse interaction
      smoothedMouseY += (mouseY - smoothedMouseY) * 0.1;
      
      // Calculate Wave Parameters based on mouse/touch interaction!
      // Closer to center = higher amplitude
      // X position = changing frequency/speed
      
      const normalizedX = mouseX / width;
      const normalizedY = smoothedMouseY / height;
      
      const baseAmplitude = height * 0.15;
      const dynamicAmplitude = baseAmplitude + (1 - Math.abs(0.5 - normalizedY)) * (height * 0.2);
      
      const waveCount = 5;
      const speed = 0.02 + (normalizedX * 0.05);

      time += speed;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const hue = (time * 10 + i * 20) % 360; // Cycling colors
        // Adjust alpha based on user interaction activity or just steady pulsing
        ctx.strokeStyle = `hsla(${180 + (normalizedX * 100) + (i * 10)}, 80%, 60%, 0.5)`; 
        ctx.lineWidth = 3;

        for (let x = 0; x < width; x++) {
          // Complex wave function mixing multiple sines
          const frequency = 0.01 + (i * 0.005) + (normalizedX * 0.005);
          const y = height / 2 + 
                    Math.sin(x * frequency + time + i) * dynamicAmplitude * Math.sin(time * 0.5) +
                    Math.cos(x * 0.003 - time) * (dynamicAmplitude * 0.3);
          
          if (x === 0) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Add some "particles" reacting to the cursor
      // Simple glow at mouse pos
      const gradient = ctx.createRadialGradient(mouseX, smoothedMouseY, 0, mouseX, smoothedMouseY, 100);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.2)"); // Cyan glow
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,width,height);


      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-2xl cursor-pointer"
        style={{ touchAction: 'none' }} 
    />
  );
};

export default InteractiveWave;
