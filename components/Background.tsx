"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = [
  "</>", "{ }", "=>", "fn()", "AI", "0b101", "</div>",
  "async", "await", "[ ]", "npm", "<html>", "git", "()=>{}",
  "const", "=>", "0101", "λ", "σ", "//", "●", "⌘", "{...}", "[]",
  "#!", "~", "=>{}", "01010", "AI*", "fn()",
];

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Floating code symbols (randomised on the client only). */
function CodeFloat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || reducedMotion()) return;
    const count = window.innerWidth < 760 ? 12 : 22;
    const spans: HTMLSpanElement[] = [];
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      span.style.left = `${Math.random() * 96}vw`;
      span.style.fontSize = `${10 + Math.random() * 12}px`;
      span.style.animationDuration = `${18 + Math.random() * 22}s`;
      span.style.animationDelay = `${-Math.random() * 30}s`;
      span.style.setProperty("--o", (0.03 + Math.random() * 0.05).toFixed(3));
      span.style.setProperty("--r", `${(Math.random() * 30 - 15).toFixed(1)}deg`);
      container.appendChild(span);
      spans.push(span);
    }
    return () => spans.forEach((s) => s.remove());
  }, []);

  return <div className="code-float" id="code-float" aria-hidden="true" ref={ref} />;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

/** Neural-network constellation that swirls around the cursor. */
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (reducedMotion()) {
      canvas.style.display = "none";
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const LINK_DIST_SQ = 195 * 195;
    const FIELD_RADIUS = 250;
    const FIELD_RADIUS_SQ = FIELD_RADIUS * FIELD_RADIUS;
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false };

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let raf: number | null = null;
    let running = true;

    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const getColors = () =>
      darkMq.matches
        ? { node: "rgba(217,243,106,0.62)", line: "rgba(217,243,106,0.13)", hot: "rgba(217,243,106,0.42)" }
        : { node: "rgba(10,25,34,0.42)", line: "rgba(10,25,34,0.10)", hot: "rgba(63,90,24,0.34)" };
    let colors = getColors();

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(52, Math.min(130, Math.round((W * H) / 14000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function tick(t: number) {
      const time = t / 1000;
      ctx!.clearRect(0, 0, W, H);

      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      if (Math.abs(pointer.vx) < 0.02) pointer.vx = 0;
      if (Math.abs(pointer.vy) < 0.02) pointer.vy = 0;
      const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 5);

      for (const p of particles) {
        if (pointer.active && speed > 0.02) {
          const rx = p.x - pointer.x;
          const ry = p.y - pointer.y;
          const d2 = rx * rx + ry * ry;
          if (d2 < FIELD_RADIUS_SQ) {
            const d = Math.sqrt(d2) || 1;
            const falloff = 1 - d / FIELD_RADIUS;
            let tx = -ry / d;
            let ty = rx / d;
            if (tx * pointer.vx + ty * pointer.vy < 0) {
              tx = -tx;
              ty = -ty;
            }
            const push = falloff * falloff * speed * 0.5;
            p.x += tx * push;
            p.y += ty * push;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        const pulse = 0.5 + 0.5 * Math.sin(time * 1.1 + p.phase);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r + pulse * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = colors.node;
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= LINK_DIST_SQ) continue;
          const alpha = 1 - d2 / LINK_DIST_SQ;
          let near = false;
          if (pointer.active) {
            const mx = (a.x + b.x) * 0.5 - pointer.x;
            const my = (a.y + b.y) * 0.5 - pointer.y;
            near = mx * mx + my * my < FIELD_RADIUS_SQ;
          }
          ctx!.globalAlpha = near ? Math.min(1, alpha * 0.85) : alpha * 0.55;
          ctx!.strokeStyle = near ? colors.hot : colors.line;
          ctx!.lineWidth = near ? 0.9 : 0.7;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(tick);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      running = true;
      resize();
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // keep mobile scrolling untouched
      if (pointer.active) {
        pointer.vx = pointer.vx * 0.6 + (e.clientX - pointer.x) * 0.4;
        pointer.vy = pointer.vy * 0.6 + (e.clientY - pointer.y) * 0.4;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
    };
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => running && resize(), 180);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onTheme = () => {
      colors = getColors();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    darkMq.addEventListener("change", onTheme);
    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      darkMq.removeEventListener("change", onTheme);
    };
  }, []);

  return <canvas id="neural-canvas" aria-hidden="true" ref={ref} />;
}

export function Background() {
  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-orbs" aria-hidden="true" />
      <NeuralCanvas />
      <CodeFloat />
    </>
  );
}
