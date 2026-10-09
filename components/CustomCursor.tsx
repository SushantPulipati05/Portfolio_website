"use client";

import { useEffect, useRef } from "react";

// Dot + trailing ring cursor.
// - Only turns on for devices with a real mouse (touch screens keep normal behaviour).
// - Text fields keep the normal typing cursor.
// - With "reduced motion" turned on, the ring follows instantly instead of gliding.
const INTERACTIVE = "a, button, [role='button'], label, select, summary";
const TEXT_FIELDS = "input, textarea, [contenteditable='true']";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.body; // React never sets a className on <body>, so these classes are safe here
    root.classList.add("custom-cursor");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -100, y = -100, rx = -100, ry = -100;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      root.classList.add("cursor-visible");
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      root.classList.toggle("cursor-hover", !!target.closest(INTERACTIVE));
      root.classList.toggle("cursor-text", !!target.closest(TEXT_FIELDS));
    };

    const onLeave = () => root.classList.remove("cursor-visible");
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    const loop = () => {
      const ease = reduceMotion ? 1 : 0.18;
      rx += (x - rx) * ease;
      ry += (y - ry) * ease;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      root.classList.remove("custom-cursor", "cursor-visible", "cursor-hover", "cursor-text", "cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
