"use client";

import { useEffect, useRef } from "react";

const HEART_COLORS = ["#e8234a", "#ff6b8a", "#ff9eb5", "#c0392b", "#e74c6f"];
const HEART_COUNT = 30;

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export default function HeartConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const hearts: Heart[] = Array.from({ length: HEART_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 8 + Math.random() * 16,
      speed: 1 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 1.5,
      opacity: 0.5 + Math.random() * 0.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    }));

    function drawHeart(ctx: CanvasRenderingContext2D, h: Heart) {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = h.color;
      ctx.beginPath();
      const s = h.size;
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
      ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const h of hearts) {
        h.y += h.speed;
        h.x += h.drift;
        h.rotation += h.rotationSpeed;
        if (h.y > canvas!.height + 30) {
          h.y = -30;
          h.x = Math.random() * canvas!.width;
        }
        drawHeart(ctx!, h);
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
