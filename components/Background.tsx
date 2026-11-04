"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = [
  "Go", "Temporal", "Kafka", "Docker", "K8s", "Next.js",
  "POST /api", "async/await", "λ =>", "{ ...system }", "0b10110",
  "SELECT 1;", "Redis.get()", "gorm.DB", "Claude Code", "npm build",
  "O(1)", "200 OK", "git push", "fn()", "interface Model", "<Suspense />",
  "ETag", "JWT", "helm apply", "stream()", "EventBus", "gRPC"
];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Floating code symbols reflecting Rijaniaina's real stack */
function CodeFloat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || reducedMotion()) return;
    const count = window.innerWidth < 768 ? 14 : 26;
    const spans: HTMLSpanElement[] = [];

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      span.style.left = `${Math.random() * 95}vw`;
      span.style.fontSize = `${10 + Math.random() * 11}px`;
      span.style.animationDuration = `${20 + Math.random() * 24}s`;
      span.style.animationDelay = `${-Math.random() * 32}s`;
      span.style.setProperty("--o", (0.04 + Math.random() * 0.05).toFixed(3));
      span.style.setProperty("--r", `${(Math.random() * 24 - 12).toFixed(1)}deg`);
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
  isHub: boolean;
  pulseSpeed: number;
}

interface Packet {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

/**
 * Enhanced Neural Constellation & Distributed Workflow Canvas
 * - Real-time theme sync (system preference + UI dark/light toggle)
 * - Interactive cursor node with dynamic connection web & subtle gravitational swirl
 * - Ambient mouse aura that illuminates the architectural blueprint
 * - Traveling data packet pulses signifying distributed event pipelines (Kafka/Temporal)
 * - Auto-pauses when tab is hidden or reduced motion is requested
 */
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
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    const LINK_DIST = 175;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const POINTER_LINK_DIST = 210;
    const POINTER_LINK_DIST_SQ = POINTER_LINK_DIST * POINTER_LINK_DIST;
    const FIELD_RADIUS = 240;
    const FIELD_RADIUS_SQ = FIELD_RADIUS * FIELD_RADIUS;

    const pointer = {
      x: -1e4,
      y: -1e4,
      vx: 0,
      vy: 0,
      targetX: -1e4,
      targetY: -1e4,
      active: false,
    };

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let packets: Packet[] = [];
    let raf: number | null = null;
    let running = true;
    let lastPacketSpawn = 0;

    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");

    const isCurrentThemeDark = () => {
      if (document.documentElement.classList.contains("dark")) return true;
      if (document.documentElement.classList.contains("light")) return false;
      return darkMq.matches;
    };

    const getColors = () => {
      const dark = isCurrentThemeDark();
      return dark
        ? {
            node: "rgba(217, 243, 106, 0.78)",
            hub: "rgba(240, 255, 170, 0.95)",
            hubRing: "rgba(217, 243, 106, 0.28)",
            line: "rgba(217, 243, 106, 0.15)",
            lineNear: "rgba(217, 243, 106, 0.38)",
            mouseLine: "rgba(217, 243, 106, 0.72)",
            mouseNode: "rgba(255, 255, 255, 0.95)",
            packet: "rgba(255, 255, 255, 0.95)",
            mouseAura: "rgba(217, 243, 106, 0.08)",
          }
        : {
            node: "rgba(14, 36, 51, 0.48)",
            hub: "rgba(63, 90, 24, 0.85)",
            hubRing: "rgba(63, 90, 24, 0.22)",
            line: "rgba(14, 36, 51, 0.10)",
            lineNear: "rgba(63, 90, 24, 0.32)",
            mouseLine: "rgba(63, 90, 24, 0.65)",
            mouseNode: "rgba(14, 36, 51, 0.85)",
            packet: "rgba(63, 90, 24, 0.95)",
            mouseAura: "rgba(217, 243, 106, 0.14)",
          };
    };

    let colors = getColors();

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adaptive density: comfortable across mobile, tablet, and 4K displays
      const count = Math.max(48, Math.min(115, Math.round((W * H) / 15000)));
      particles = Array.from({ length: count }, (_, i) => {
        const isHub = i % 8 === 0;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * (isHub ? 0.18 : 0.26),
          vy: (Math.random() - 0.5) * (isHub ? 0.18 : 0.26),
          r: isHub ? Math.random() * 1.5 + 2.2 : Math.random() * 1.2 + 0.9,
          phase: Math.random() * Math.PI * 2,
          isHub,
          pulseSpeed: 0.9 + Math.random() * 0.6,
        };
      });
      packets = [];
    }

    function tick(t: number) {
      const time = t / 1000;
      ctx!.clearRect(0, 0, W, H);

      // Smooth pointer momentum
      pointer.x += (pointer.targetX - pointer.x) * 0.35;
      pointer.y += (pointer.targetY - pointer.y) * 0.35;
      pointer.vx *= 0.88;
      pointer.vy *= 0.88;
      if (Math.abs(pointer.vx) < 0.02) pointer.vx = 0;
      if (Math.abs(pointer.vy) < 0.02) pointer.vy = 0;
      const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 6);

      // 1. Ambient mouse spotlight illuminating blueprint grid
      if (pointer.active) {
        const aura = ctx!.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          FIELD_RADIUS * 1.15
        );
        aura.addColorStop(0, colors.mouseAura);
        aura.addColorStop(0.5, colors.mouseAura.replace(/[\d\.]+\)$/, "0.03)"));
        aura.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = aura;
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, FIELD_RADIUS * 1.15, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor gravitational swirl & displacement
        if (pointer.active && speed > 0.04) {
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
            const push = falloff * falloff * speed * 0.45;
            p.x += tx * push;
            p.y += ty * push;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries with comfortable margins
        if (p.x < -24) p.x = W + 24;
        if (p.x > W + 24) p.x = -24;
        if (p.y < -24) p.y = H + 24;
        if (p.y > H + 24) p.y = -24;

        // Draw particle node
        const pulse = 0.5 + 0.5 * Math.sin(time * p.pulseSpeed + p.phase);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r + pulse * (p.isHub ? 0.8 : 0.4), 0, Math.PI * 2);
        ctx!.fillStyle = p.isHub ? colors.hub : colors.node;
        ctx!.fill();

        // Architectural orbital ring for hub nodes
        if (p.isHub) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r * 2.6 + pulse * 1.2, 0, Math.PI * 2);
          ctx!.strokeStyle = colors.hubRing;
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }
      }

      // 3. Connect constellation edges
      const activeEdges: { a: number; b: number }[] = [];
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= LINK_DIST_SQ) continue;

          activeEdges.push({ a: i, b: j });

          const alpha = 1 - d2 / LINK_DIST_SQ;
          let nearCursor = false;
          if (pointer.active) {
            const mx = (a.x + b.x) * 0.5 - pointer.x;
            const my = (a.y + b.y) * 0.5 - pointer.y;
            nearCursor = mx * mx + my * my < FIELD_RADIUS_SQ;
          }

          ctx!.globalAlpha = nearCursor ? Math.min(1, alpha * 0.85) : alpha * 0.45;
          ctx!.strokeStyle = nearCursor ? colors.lineNear : colors.line;
          ctx!.lineWidth = nearCursor ? 1.0 : 0.7;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      // 4. Connect cursor to nearby nodes in real-time
      if (pointer.active) {
        const pointerLinks: { idx: number; d2: number }[] = [];
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_LINK_DIST_SQ) {
            pointerLinks.push({ idx: i, d2 });
          }
        }
        pointerLinks.sort((a, b) => a.d2 - b.d2);
        const maxLinks = Math.min(6, pointerLinks.length);

        for (let k = 0; k < maxLinks; k++) {
          const target = particles[pointerLinks[k].idx];
          const d2 = pointerLinks[k].d2;
          const alpha = (1 - d2 / POINTER_LINK_DIST_SQ) * 0.75;
          ctx!.globalAlpha = alpha;
          ctx!.strokeStyle = colors.mouseLine;
          ctx!.lineWidth = 1.1;
          ctx!.beginPath();
          ctx!.moveTo(pointer.x, pointer.y);
          ctx!.lineTo(target.x, target.y);
          ctx!.stroke();
        }

        // Central interactive pointer node & micro ping ring
        ctx!.globalAlpha = 0.9;
        ctx!.fillStyle = colors.mouseNode;
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2);
        ctx!.fill();

        const pingRadius = 6 + (Math.sin(time * 3) * 0.5 + 0.5) * 6;
        ctx!.globalAlpha = 0.45 * (1 - (pingRadius - 6) / 6);
        ctx!.strokeStyle = colors.mouseLine;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, pingRadius, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // 5. Distributed Data Packets along active edges (event pipeline visualization)
      if (activeEdges.length > 0 && t - lastPacketSpawn > 1400 && packets.length < 5) {
        lastPacketSpawn = t;
        const randomEdge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
        packets.push({
          fromIdx: randomEdge.a,
          toIdx: randomEdge.b,
          progress: 0,
          speed: 0.012 + Math.random() * 0.014,
        });
      }

      // Draw and advance packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1 || !particles[pkt.fromIdx] || !particles[pkt.toIdx]) {
          packets.splice(i, 1);
          continue;
        }

        const pA = particles[pkt.fromIdx];
        const pB = particles[pkt.toIdx];
        const curX = pA.x + (pB.x - pA.x) * pkt.progress;
        const curY = pA.y + (pB.y - pA.y) * pkt.progress;

        const packetAlpha = Math.sin(pkt.progress * Math.PI);
        ctx!.globalAlpha = Math.min(1, packetAlpha * 0.95);
        ctx!.fillStyle = colors.packet;
        ctx!.beginPath();
        ctx!.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx!.fill();

        // Subtle glow tail
        ctx!.globalAlpha = packetAlpha * 0.35;
        ctx!.beginPath();
        ctx!.arc(curX, curY, 4.5, 0, Math.PI * 2);
        ctx!.fill();
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
      if (e.pointerType === "touch") return; // Touch scrolling remains natural
      if (pointer.active) {
        pointer.vx = pointer.vx * 0.5 + (e.clientX - pointer.targetX) * 0.5;
        pointer.vy = pointer.vy * 0.5 + (e.clientY - pointer.targetY) * 0.5;
      } else {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
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
      resizeTimer = window.setTimeout(() => running && resize(), 150);
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const updateTheme = () => {
      colors = getColors();
    };

    // Listen to OS theme changes
    darkMq.addEventListener("change", updateTheme);

    // Also observe the class attribute on html tag (for instantaneous theme toggle response)
    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      darkMq.removeEventListener("change", updateTheme);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
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
