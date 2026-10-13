import type { Metadata } from "next";
import Link from "next/link";
import DemoMedia from "@/components/DemoMedia";
import { projects, type Project } from "@/data/content";

export const metadata: Metadata = { title: "Projects · Sushant Pulipati" };

function Links({ p }: { p: Project }) {
  if (!p.links.length) return null;
  return (
    <div className="p-links">
      {p.links.map((l) => (
        <a key={l.href + l.label} href={l.href} target="_blank" rel="noreferrer">
          {l.label}
        </a>
      ))}
    </div>
  );
}

function Learned({ p, compact = false }: { p: Project; compact?: boolean }) {
  if (!p.learned.length) return null;
  if (compact) {
    return (
      <div className="learned-compact">
        <span className="learned-h">{"// learned"}</span>
        {p.learned[0]}
      </div>
    );
  }
  return (
    <div className="learned">
      <div className="learned-h">{p.role ? "// my part & what I learned" : "// what I learned"}</div>
      {p.role && <p className="role">{p.role}</p>}
      <ol>
        {p.learned.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>
    </div>
  );
}

function Stats({ p }: { p: Project }) {
  if (!p.stats?.length) return null;
  return (
    <div className="p-stats">
      {p.stats.map((s) => (
        <div className="p-stat" key={s.label}>
          {s.value}
          <small>{s.label}</small>
        </div>
      ))}
    </div>
  );
}

// Big case card (layout B):
//   demo edge to edge on top
//   header row: tag + title on the left, code button on the right
//   two columns: description + numbers | what I learned
function FeaturedCard({ p, n }: { p: Project; n: number }) {
  return (
    <article className="case reveal">
      <div className="case-media">
        <DemoMedia demo={p.demo} />
      </div>
      <div className="case-content">
        <header className="case-top">
          <div>
            <div className="p-label">
              {String(n).padStart(2, "0")} · {p.tags}
            </div>
            <h3>{p.name}</h3>
          </div>
          {p.links.length > 0 && (
            <div className="case-actions">
              {p.links.map((l) => (
                <a key={l.href + l.label} className="btn-pill" href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </header>
        <div className="case-cols">
          <div className="case-info">
            <p className="p-desc">{p.description}</p>
            <Stats p={p} />
          </div>
          <Learned p={p} />
        </div>
      </div>
    </article>
  );
}

// App card: phone recording beside the text.
function AppCard({ p, n, flip }: { p: Project; n: number; flip: boolean }) {
  return (
    <article className={`app-card reveal${flip ? " flip" : ""}`}>
      <DemoMedia demo={p.demo} />
      <div className="case-body">
        <div className="p-label">
          {String(n).padStart(2, "0")} · {p.tags}
        </div>
        <h3>{p.name}</h3>
        {p.status && <span className="p-chip">{p.status}</span>}
        <p className="p-desc">{p.description}</p>
        <Links p={p} />
        <Learned p={p} />
      </div>
    </article>
  );
}

// Small card for projects without a recording yet.
function MiniCard({ p, n }: { p: Project; n: number }) {
  return (
    <article className="mini-card reveal">
      <div className="p-label">
        {String(n).padStart(2, "0")} · {p.tags}
      </div>
      <h3>{p.name}</h3>
      {p.status && <span className="p-chip">{p.status}</span>}
      <p className="p-desc">{p.description}</p>
      <Links p={p} />
      <Learned p={p} compact />
    </article>
  );
}

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.tier === "featured");
  const apps = projects.filter((p) => p.tier === "app");
  const appsWithVideo = apps.filter((p) => p.demo.kind === "video");
  const appsWithout = apps.filter((p) => p.demo.kind !== "video");
  const lab = projects.filter((p) => p.tier === "lab");
  const num = (p: Project) => projects.indexOf(p) + 1;

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />

      <section className="page-header">
        <div className="prompt">$ ls ~/projects --sort=depth</div>
        <h1 className="h1">
          Stuff I&apos;ve <span className="accent">built.</span>
        </h1>
        <p className="lead">
          Everything here started as something I didn&apos;t know how to do. Each project says what it taught me, because
          that&apos;s the real point of building it.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="tier">
          <div className="tier-head">
            <h2>Deep dives</h2>
            <span>built properly, measured, documented</span>
          </div>
          {featured.map((p) => (
            <FeaturedCard key={p.slug} p={p} n={num(p)} />
          ))}
        </section>
      )}

      {apps.length > 0 && (
        <section className="tier">
          <div className="tier-head">
            <h2>Apps &amp; products</h2>
            <span>full-stack apps, shipped or in progress</span>
          </div>
          {appsWithVideo.map((p, i) => (
            <AppCard key={p.slug} p={p} n={num(p)} flip={i % 2 === 1} />
          ))}
          {appsWithout.length > 0 && (
            <div className="mini-grid">
              {appsWithout.map((p) => (
                <MiniCard key={p.slug} p={p} n={num(p)} />
              ))}
            </div>
          )}
        </section>
      )}

      {lab.length > 0 && (
        <section className="tier">
          <div className="tier-head">
            <h2>Small builds &amp; experiments</h2>
            <span>quick projects, each taught one thing</span>
          </div>
          <div className="mini-grid">
            {lab.map((p) => (
              <MiniCard key={p.slug} p={p} n={num(p)} />
            ))}
          </div>
        </section>
      )}

      <div className="next-link">
        <Link href="/contact">contact →</Link>
      </div>
    </main>
  );
}
