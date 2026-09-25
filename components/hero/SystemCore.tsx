"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const RING_LABELS = ["AI", "API", "DATA", "SECURITY", "SYSTEM"];
const SATELLITES = 28;
const FOCAL = 720;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function rotateY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
}
function rotateX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return "0, 229, 255";
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/**
 * The hero's system diagram: a core with five labelled nodes (AI, API, DATA,
 * SECURITY, SYSTEM) on a tilted ring, satellites on outer shells, all projected
 * from 3D with the plain 2D Canvas API. The ring turns slowly and the whole
 * system tilts toward the pointer. No WebGL, no dependency; paused off-screen and
 * when the tab is hidden; a single static frame under reduced motion.
 */
export default function SystemCore({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const accentRgb = hexToRgb(style.getPropertyValue("--color-accent").trim() || "#00e5ff");
    const textRgb = hexToRgb(style.getPropertyValue("--color-text-primary").trim() || "#f5f5f7");
    const mutedRgb = hexToRgb(style.getPropertyValue("--color-text-secondary").trim() || "#9a9aa5");
    const displayFont = (style.getPropertyValue("--font-display").trim() || "sans-serif").replace(/['"]/g, "");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let radius = 0;
    let angle = 0;
    const target = { x: 0, y: 0 };
    const tilt = { x: -0.42, y: 0 };
    let animationId = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;

    // Satellites: fixed points on two outer shells, each with its own orbital phase.
    const satellites = Array.from({ length: SATELLITES }, (_, i) => {
      const shell = i % 2 === 0 ? 1.45 : 1.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return { shell, theta, phi, speed: (0.15 + Math.random() * 0.25) * (i % 3 === 0 ? -1 : 1) };
    });

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      radius = Math.min(width, height) * 0.3;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(p: Vec3) {
      const scale = FOCAL / (FOCAL + p.z);
      return { x: width / 2 + p.x * scale, y: height / 2 + p.y * scale, scale, z: p.z };
    }

    function transform(p: Vec3): Vec3 {
      return rotateX(rotateY(p, angle + tilt.y), tilt.x);
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;

      // Ring path
      ctx!.beginPath();
      for (let i = 0; i <= 72; i++) {
        const t = (i / 72) * Math.PI * 2;
        const q = project(transform({ x: Math.cos(t) * radius, y: 0, z: Math.sin(t) * radius }));
        if (i === 0) ctx!.moveTo(q.x, q.y);
        else ctx!.lineTo(q.x, q.y);
      }
      ctx!.strokeStyle = `rgba(${mutedRgb}, 0.22)`;
      ctx!.stroke();

      // Outer shells as faint circles (they read as depth even flat)
      for (const shell of [1.45, 1.85]) {
        ctx!.beginPath();
        ctx!.arc(width / 2, height / 2, radius * shell, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${mutedRgb}, ${shell === 1.45 ? 0.1 : 0.06})`;
        ctx!.stroke();
      }

      // Ring nodes
      const nodes = RING_LABELS.map((label, i) => {
        const t = (i / RING_LABELS.length) * Math.PI * 2;
        const p = transform({ x: Math.cos(t) * radius, y: 0, z: Math.sin(t) * radius });
        return { label, ...project(p) };
      });
      const core = project({ x: 0, y: 0, z: 0 });

      // Spokes + ring edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const b = nodes[(i + 1) % nodes.length];
        const depthA = (a.scale - 0.7) / 0.6;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(core.x, core.y);
        ctx!.strokeStyle = `rgba(${accentRgb}, ${0.12 + depthA * 0.25})`;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = `rgba(${accentRgb}, ${0.08 + depthA * 0.2})`;
        ctx!.stroke();
      }

      // Satellites
      ctx!.fillStyle = `rgba(${accentRgb}, 0.7)`;
      for (const s of satellites) {
        const r = radius * s.shell;
        const p = transform({
          x: r * Math.sin(s.phi) * Math.cos(s.theta),
          y: r * Math.cos(s.phi) * 0.55,
          z: r * Math.sin(s.phi) * Math.sin(s.theta),
        });
        const q = project(p);
        const alpha = 0.25 + ((q.scale - 0.7) / 0.6) * 0.6;
        ctx!.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx!.beginPath();
        ctx!.arc(q.x, q.y, 1.4 * q.scale, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // Core
      ctx!.beginPath();
      ctx!.arc(core.x, core.y, 9, 0, Math.PI * 2);
      ctx!.fillStyle = `rgb(${accentRgb})`;
      ctx!.fill();
      for (const rr of [22, 38]) {
        ctx!.beginPath();
        ctx!.arc(core.x, core.y, rr, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${accentRgb}, ${rr === 22 ? 0.35 : 0.15})`;
        ctx!.stroke();
      }

      // Nodes + labels, back to front
      ctx!.font = `500 11px ${displayFont}, sans-serif`;
      ctx!.textBaseline = "middle";
      for (const n of [...nodes].sort((a, b) => b.z - a.z)) {
        const depth = (n.scale - 0.7) / 0.6; // 0 far .. 1 near
        const r = 3 + depth * 3;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgb(10, 10, 15)`;
        ctx!.fill();
        ctx!.strokeStyle = `rgba(${accentRgb}, ${0.5 + depth * 0.5})`;
        ctx!.stroke();
        ctx!.fillStyle = `rgba(${textRgb}, ${0.35 + depth * 0.65})`;
        const left = n.x < width / 2;
        ctx!.textAlign = left ? "right" : "left";
        const label = n.label.split("").join(" ");
        ctx!.fillText(label, n.x + (left ? -(r + 8) : r + 8), n.y);
      }
    }

    function loop() {
      angle += 0.0035;
      tilt.x += (-0.42 + target.y * 0.3 - tilt.x) * 0.05;
      tilt.y += (target.x * 0.35 - tilt.y) * 0.05;
      for (const s of satellites) s.theta += s.speed * 0.004;
      draw();
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

    function onPointerMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onVisibility() {
      pageVisible = !document.hidden;
      syncRunning();
    }

    resize();
    draw();
    syncRunning();

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncRunning();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden />;
}
