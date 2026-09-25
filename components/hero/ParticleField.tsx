"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const CONNECT_DISTANCE = 160;
const MOUSE_CONNECT_DISTANCE = 240;

interface ParticleFieldProps {
  /** Number of particles. Lower for a sparser, more ambient feel. */
  particleCount?: number;
  /** Radius of each particle dot, in CSS px. */
  particleRadius?: number;
  className?: string;
}

/**
 * A mouse-reactive particle network, drawn with the plain 2D Canvas API — not WebGL.
 *
 * This replaces an earlier React Three Fiber / three.js hero scene that turned out to
 * have a real, hard-to-pin-down rendering bug: content that read as correct pixel data
 * via direct WebGL framebuffer readback in a real browser still never became visible on
 * screen, across multiple fix attempts (material choice, z-fighting, opacity, sizing).
 * Canvas 2D has none of WebGL's context-creation, driver, tone-mapping, or depth-buffer
 * complexity — what you draw is what appears, with a far smaller surface for this class
 * of bug.
 *
 * Cost control: the loop only runs while the canvas is on screen and the tab is visible
 * (IntersectionObserver + visibilitychange), and dots are drawn without canvas
 * shadowBlur, which was the single most expensive call on the page at 60fps.
 */
export default function ParticleField({
  particleCount = 100,
  particleRadius = 3,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read the brand colour from the token so the canvas can't drift from the palette.
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() ||
      "#00e5ff";
    const rgb = hexToRgb(accent);

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let animationId = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function drawFrame() {
      ctx!.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECT_DISTANCE) {
            const opacity = (1 - dist / CONNECT_DISTANCE) * 0.5;
            ctx!.strokeStyle = `rgba(${rgb}, ${opacity})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        const distToMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        if (distToMouse < MOUSE_CONNECT_DISTANCE) {
          const opacity = (1 - distToMouse / MOUSE_CONNECT_DISTANCE) * 0.9;
          ctx!.strokeStyle = `rgba(${rgb}, ${opacity})`;
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      ctx!.fillStyle = `rgb(${rgb})`;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      drawFrame();
      animationId = requestAnimationFrame(loop);
    }

    function syncRunning() {
      const shouldRun = !reducedMotion && visible && pageVisible;
      if (shouldRun && !running) {
        running = true;
        animationId = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(animationId);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function handleVisibility() {
      pageVisible = !document.hidden;
      syncRunning();
    }

    resize();
    initParticles();
    drawFrame(); // always paint one frame, so reduced-motion users still see the field
    syncRunning();

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncRunning();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reducedMotion, particleCount, particleRadius]);

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden />;
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return "0, 229, 255";
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
