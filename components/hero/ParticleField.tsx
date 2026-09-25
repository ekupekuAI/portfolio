"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PARTICLE_COUNT = 130;
const PARTICLE_RADIUS = 4.5;
const CONNECT_DISTANCE = 170;
const MOUSE_CONNECT_DISTANCE = 260;
const ACCENT_RGB = "0, 229, 255"; // #00E5FF, as rgb() components for rgba() strings

/**
 * A mouse-reactive particle network, drawn with the plain 2D Canvas API — not WebGL.
 *
 * This replaces an earlier React Three Fiber / three.js hero scene that turned out to
 * have a real, hard-to-pin-down rendering bug: content that read as correct pixel data
 * via direct WebGL framebuffer readback in a real browser still never became visible on
 * screen, across multiple fix attempts (material choice, z-fighting, opacity, sizing).
 * Canvas 2D has none of WebGL's context-creation, driver, tone-mapping, or depth-buffer
 * complexity — what you draw is what appears, with a far smaller surface for this class
 * of bug. Sized and animated entirely by hand (no dynamic import, no external sizing
 * library), so there's nothing else in the pipeline to go wrong.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let animationId = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECT_DISTANCE) {
            const opacity = (1 - dist / CONNECT_DISTANCE) * 0.7;
            ctx!.strokeStyle = `rgba(${ACCENT_RGB}, ${opacity})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        const distToMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        if (distToMouse < MOUSE_CONNECT_DISTANCE) {
          const opacity = 1 - distToMouse / MOUSE_CONNECT_DISTANCE;
          ctx!.strokeStyle = `rgba(${ACCENT_RGB}, ${opacity})`;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      for (const p of particles) {
        ctx!.shadowColor = `rgb(${ACCENT_RGB})`;
        ctx!.shadowBlur = 8;
        ctx!.fillStyle = `rgba(${ACCENT_RGB}, 1)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(draw);
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

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
