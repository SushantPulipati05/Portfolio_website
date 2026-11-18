"use client";

import { useEffect, useRef } from "react";

// The night sky behind every page.
// - Stars twinkle slowly and drift at different speeds as you scroll (parallax).
// - Stars near the mouse brighten a little.
// - Every 9 to 21 seconds a shooting star crosses the top of the screen.
// Star colour comes from the --star CSS variable, so light mode gets dark "stars".
// With "reduced motion" turned on, it draws one still frame and stops.
type Star = { x: number; y: number; r: number; a: number; p: number; s: number; d: number };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let mx = -999;
    let my = -999;
    let frame = 0;
    let shoot: { x: number; y: number; l: number } | null = null;
    let nextShoot = performance.now() + 5000;
    let color = "223,228,255";

    const readColor = () => {
      color = getComputedStyle(root).getPropertyValue("--star").trim() || color;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // About one star per 1,600 px² of screen, in three sizes:
      // 5% bright, 25% medium and 70% faint "dust" that fills out the sky.
      stars = Array.from({ length: Math.round((W * H) / 1600) }, () => {
        const roll = Math.random();
        const size = roll < 0.05 ? "big" : roll < 0.3 ? "mid" : "dust";
        return {
          x: Math.random() * W,
          y: Math.random() * H * 2,
          r: size === "big" ? 1.2 + Math.random() * 0.3 : size === "mid" ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.3,
          a: size === "big" ? 0.9 : size === "mid" ? 0.45 + Math.random() * 0.4 : 0.25 + Math.random() * 0.3,
          p: Math.random() * Math.PI * 2, // twinkle phase
          s: 0.4 + Math.random() * 1.2, // twinkle speed
          d: 0.04 + Math.random() * 0.22, // parallax depth
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const scroll = window.scrollY;

      for (const s of stars) {
        const y = (((s.y - scroll * s.d) % (H * 2)) + H * 2) % (H * 2);
        if (y > H) continue;
        const dist = Math.hypot(s.x - mx, y - my);
        const near = dist < 140 ? 1 - dist / 140 : 0;
        const twinkle = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin((t / 1000) * s.s + s.p);
        const alpha = Math.min(1, s.a * twinkle + near * 0.7);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r + near * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        if (!shoot && t > nextShoot) {
          shoot = { x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.35, l: 0 };
        }
        if (shoot) {
          shoot.l += 14;
          const len = Math.min(shoot.l, 120);
          const hx = shoot.x - shoot.l * 0.9;
          const hy = shoot.y + shoot.l * 0.45;
          const g = ctx.createLinearGradient(hx, hy, hx + len * 0.9, hy - len * 0.45);
          g.addColorStop(0, `rgba(${color},0.9)`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx + len * 0.9, hy - len * 0.45);
          ctx.stroke();
          if (shoot.l > W * 0.6) {
            shoot = null;
            nextShoot = t + 9000 + Math.random() * 12000;
          }
        }
        frame = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    // Redraw the still frame on scroll/resize when animation is off.
    const redraw = () => {
      if (reduceMotion) draw(0);
    };

    readColor();
    resize();
    const themeWatcher = new MutationObserver(() => {
      readColor();
      redraw();
    });
    themeWatcher.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("resize", redraw);
    window.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      themeWatcher.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", redraw);
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
