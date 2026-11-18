import Link from "next/link";
import DomainIcon from "@/components/DomainIcon";
import { domains, profile, story } from "@/data/content";

// Structured data: tells Google who this site is about and which profiles are the same person.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: "https://sushnt.dev",
  jobTitle: "Software Engineer",
  description: "Software engineer and CS student in Pune building backend systems in Go and Android and iOS apps.",
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "MIT World Peace University" },
  knowsAbout: ["Go", "Distributed systems", "PostgreSQL", "Android", "iOS", "TypeScript"],
  sameAs: [profile.github, profile.x, profile.linkedin].filter(Boolean),
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // Escaping "<" keeps the data from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="hero">
        <div className="prompt">$ whoami</div>
        <h1 className="h1">
          {profile.headline} <span className="accent">{profile.headlineAccent}</span>
          <span className="cursor" aria-hidden="true" />
        </h1>
        <p className="lead">{profile.bio}</p>
        <div className="links-row">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={profile.x} target="_blank" rel="noreferrer">
            X <span aria-hidden="true">↗</span>
          </a>
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <a href={`mailto:${profile.email}`}>
            Email <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="story-title">
        <div className="section-label">// story</div>
        <h2 id="story-title" className="h2">How I got here</h2>
        <div className="story">
          {story.map((item) => (
            <div className="story-row" key={item.date + item.text}>
              <div className={`story-date${item.highlight ? " now" : ""}`}>{item.date}</div>
              <div className="story-text">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="domains-title">
        <div className="section-label">// domains</div>
        <h2 id="domains-title" className="h2">What I work on</h2>
        <p className="section-intro">The areas I&apos;ve actually shipped things in, and the tools I reach for in each.</p>
        <div className="domains">
          {domains.map((d) => (
            <div className={`domain${d.wide ? " wide" : ""}`} key={d.title}>
              <div className="domain-head">
                <span className="domain-icon">
                  <DomainIcon name={d.icon} />
                </span>
                <h3>{d.title}</h3>
              </div>
              <p>{d.description}</p>
              <div className="chips">
                {d.tools.map((tool) => (
                  <span className="chip" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="next-link">
        <Link href="/projects">projects →</Link>
      </div>
    </main>
  );
}
