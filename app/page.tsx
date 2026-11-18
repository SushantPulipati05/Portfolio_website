import Link from "next/link";
import DomainIcon from "@/components/DomainIcon";
import { domains, profile, story } from "@/data/content";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="prompt">$ whoami</div>
        <h1 className="h1">
          {profile.headline} <span className="accent">{profile.headlineAccent}</span>
          <span className="cursor" aria-hidden="true" />
        </h1>
        <p className="lead">{profile.bio}</p>
        <div className="links-row">
          <a href={profile.github} target="_blank" rel="noreferrer">github ↗</a>
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
          )}
          <a href={`mailto:${profile.email}`}>email ↗</a>
          <a href={profile.resume} target="_blank" rel="noreferrer">resume.pdf ↓</a>
        </div>
      </section>

      <section className="section" aria-labelledby="story-title">
        <div className="section-label">// story</div>
        <h2 id="story-title" className="h2">How I got here</h2>
        <div className="story">
          {story.map((item) => (
            <div className="story-row" key={item.date}>
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
