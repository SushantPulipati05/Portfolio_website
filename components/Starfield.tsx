"use client";

import { useEffect, useRef } from "react";

// The night sky behind every page.
// - Stars twinkle slowly and drift at different speeds as you scroll (parallax).
// - Stars near the mouse brighten a little.
// - Shooting stars cross the sky every 1.5 to 4 seconds, up to 3 at a time,
//   each with its own speed, length and angle.
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
    type Shooter = { x: number; y: number; l: number; speed: number; max: number; slope: number; fade: number };
    let shooters: Shooter[] = [];
    let nextShoot = performance.now() + 1200;
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
        if (t > nextShoot && shooters.length < 3) {
          shooters.push({
            x: Math.random() * W * 0.8 + W * 0.25, // start point (it travels down and to the left)
            y: Math.random() * H * 0.5,
            l: 0,
            speed: 9 + Math.random() * 10,
            max: 80 + Math.random() * 110, // tail length
            slope: 0.3 + Math.random() * 0.35, // how steeply it falls
            fade: W * (0.35 + Math.random() * 0.35), // distance before it burns out
          });
          nextShoot = t + 1500 + Math.random() * 2500;
        }
        for (const s of shooters) {
          s.l += s.speed;
          const len = Math.min(s.l, s.max);
          const hx = s.x - s.l; // head
          const hy = s.y + s.l * s.slope;
          const life = Math.max(0, 1 - s.l / s.fade); // dims as it travels
          const g = ctx.createLinearGradient(hx, hy, hx + len, hy - len * s.slope);
          g.addColorStop(0, `rgba(${color},${life})`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx + len, hy - len * s.slope);
          ctx.stroke();
          // bright head with a soft glow
          const head = ctx.createRadialGradient(hx, hy, 0, hx, hy, 6);
          head.addColorStop(0, `rgba(${color},${life})`);
          head.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = head;
          ctx.beginPath();
          ctx.arc(hx, hy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        shooters = shooters.filter((s) => s.l < s.fade);
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
