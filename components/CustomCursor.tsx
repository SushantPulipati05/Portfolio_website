"use client";

import { useEffect, useRef } from "react";

// A small glowing star that follows the mouse exactly.
// Over links and buttons it opens into a glowing ring.
// - Only turns on for devices with a real mouse (touch screens keep normal behaviour).
// - Text fields keep the normal typing cursor.
const INTERACTIVE = "a, button, [role='button'], label, select, summary";
const TEXT_FIELDS = "input, textarea, [contenteditable='true']";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const root = document.body; // React never sets a className on <body>, so these classes are safe here
    root.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
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

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      root.classList.remove("custom-cursor", "cursor-visible", "cursor-hover", "cursor-text", "cursor-down");
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
