import type { Metadata } from "next";
import Link from "next/link";
import RedisTerminal from "@/components/RedisTerminal";
import { projects, type Project } from "@/data/content";

export const metadata: Metadata = { title: "Projects · Sushant Pulipati" };

function Demo({ demo }: { demo: Project["demo"] }) {
  if (demo.kind === "terminal") return <RedisTerminal />;

  if (demo.src) {
    const isVideo = /\.(mp4|webm)$/i.test(demo.src);
    return (
      <div className="media">
        {isVideo ? (
          <video src={demo.src} autoPlay loop muted playsInline aria-label={demo.caption} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={demo.src} alt={demo.caption} />
        )}
      </div>
    );
  }

  return (
    <div className="media">
      <div className="media-placeholder">▶ [GIF: {demo.caption}]</div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />

      <section className="page-header">
        <div className="prompt">$ ls ~/projects</div>
        <h1 className="h1">
          Stuff I&apos;ve <span className="accent">built.</span>
        </h1>
        <p className="lead">Most of these started as something I didn&apos;t know how to do. That was the point.</p>
      </section>

      {projects.map((p, i) => (
        <article className="project reveal" key={p.slug}>
          <div className="project-head">
            <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
            <h2>{p.name}</h2>
            <span className="project-tags">{p.tags}</span>
          </div>
          <Demo demo={p.demo} />
          <p>{p.description}</p>
          <div className="project-links">
            {p.links.map((l) => (
              <a key={l.href + l.label} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </article>
      ))}

      <div className="next-link">
        <Link href="/contact">contact →</Link>
      </div>
    </main>
  );
}
