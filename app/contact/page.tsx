import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import { profile } from "@/data/content";

export const metadata: Metadata = pageMeta({
  path: "/contact",
  title: "Contact",
  description:
    "Get in touch with Sushant Pulipati about software engineering roles and internships: email, GitHub and resume.",
});

export default function ContactPage() {
  const github = profile.github.replace(/^https?:\/\//, "");
  const xHandle = "@" + profile.x.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "");

  return (
    <main>
      <section className="page-header contact-hero">
        <h1 className="h1" data-decrypt>
          Say <span className="accent">hi.</span>
        </h1>
        <p className="lead" data-decrypt>
          Hiring, building something, or just curious about a project? Email reaches me fastest.
        </p>
        <div className="mail">
          <a href={`mailto:${profile.email}`} data-decrypt>
            {profile.email}
          </a>
          <CopyEmail email={profile.email} />
        </div>
      </section>

      <section className="section contact-section">
        <div className="section-label" data-decrypt>Elsewhere</div>
        <div className="rows">
          <a className="row" href={profile.github} target="_blank" rel="noreferrer">
            <b data-decrypt>GitHub</b>
            <small>↗</small>
            <span data-decrypt>{github}</span>
          </a>
          <a className="row" href={profile.x} target="_blank" rel="noreferrer">
            <b data-decrypt>X</b>
            <small>↗</small>
            <span data-decrypt>{xHandle}</span>
          </a>
          {profile.linkedin && (
            <a className="row" href={profile.linkedin} target="_blank" rel="noreferrer">
              <b data-decrypt>LinkedIn</b>
              <small>↗</small>
              <span data-decrypt>LinkedIn</span>
            </a>
          )}
          <a className="row" href={profile.resume} target="_blank" rel="noreferrer">
            <b data-decrypt>Resume</b>
            <small>↓</small>
            <span data-decrypt>resume.pdf</span>
          </a>
        </div>
      </section>

      <section className="section contact-section">
        <div className="section-label" data-decrypt>Or send a message</div>
        <ContactForm />
      </section>
    </main>
  );
}
