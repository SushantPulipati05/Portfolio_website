"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// "Encrypted" text that decrypts as you scroll to it.
//
// Any element with a data-decrypt attribute starts scrambled (letters swapped for
// random letters of the same case, digits for random digits; spaces and
// punctuation stay, so line lengths barely move). When it scrolls into view,
// the real characters lock in from left to right.
//
// The real text is in the HTML the server sends, so search engines, link
// previews and no-JS visitors always get readable text. With "reduced motion"
// on, nothing is scrambled.
//
// data-dx on the element tracks its state: "locked" (scrambled) or "done".
// CSS hides [data-decrypt] elements without data-dx for the split second
// before this runs, so you never see the plain text flash first.

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

const pick = (set: string) => set[Math.floor(Math.random() * set.length)];

function scrambleChar(ch: string) {
  if (ch >= "a" && ch <= "z") return pick(LOWER);
  if (ch >= "A" && ch <= "Z") return pick(UPPER);
  if (ch >= "0" && ch <= "9") return pick(DIGITS);
  return ch;
}

const scramble = (text: string) => Array.from(text, scrambleChar).join("");

type Job = { nodes: Text[]; originals: string[] };

function textNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
  return nodes;
}

export default function Decryptor() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-decrypt]:not([data-dx])"));
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.setAttribute("data-dx", "done"));
      return;
    }

    const jobs = new Map<HTMLElement, Job>();
    const frames = new Set<number>();

    for (const el of els) {
      const nodes = textNodes(el);
      const originals = nodes.map((n) => n.nodeValue ?? "");
      nodes.forEach((n, i) => (n.nodeValue = scramble(originals[i])));
      jobs.set(el, { nodes, originals });
      el.setAttribute("data-dx", "locked");
    }

    const finish = (el: HTMLElement, job: Job) => {
      job.nodes.forEach((n, i) => (n.nodeValue = job.originals[i]));
      el.setAttribute("data-dx", "done");
      jobs.delete(el);
    };

    const run = (el: HTMLElement, job: Job) => {
      const total = job.originals.reduce((sum, s) => sum + s.length, 0) || 1;
      // Short labels take ~0.5s, long paragraphs cap at 1.4s.
      const duration = Math.min(1400, 450 + total * 5);
      // When each character locks in: mostly left to right, with a little randomness.
      let offset = 0;
      const lockAt = job.originals.map((s) => {
        const times = Array.from(s, (_, k) => ((offset + k) / total) * duration * 0.75 + Math.random() * duration * 0.25);
        offset += s.length;
        return times;
      });

      const start = performance.now();
      let lastPaint = 0;
      const step = (now: number) => {
        const t = now - start;
        if (t >= duration) {
          finish(el, job);
          return;
        }
        // Re-roll the unlocked characters ~25 times a second, not every frame.
        if (now - lastPaint > 40) {
          lastPaint = now;
          job.nodes.forEach((node, i) => {
            const o = job.originals[i];
            let s = "";
            for (let k = 0; k < o.length; k++) s += t >= lockAt[i][k] ? o[k] : scrambleChar(o[k]);
            node.nodeValue = s;
          });
        }
        const id = requestAnimationFrame(step);
        frames.add(id);
      };
      frames.add(requestAnimationFrame(step));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const job = jobs.get(el);
          if (job) run(el, job);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      frames.forEach((id) => cancelAnimationFrame(id));
      // Put the real text back on anything still scrambled, and clear the state so
      // a remount (React dev mode mounts effects twice) can scramble it again.
      jobs.forEach((job, el) => {
        job.nodes.forEach((n, i) => (n.nodeValue = job.originals[i]));
        el.removeAttribute("data-dx");
      });
    };
  }, [pathname]);

  return null;
}
