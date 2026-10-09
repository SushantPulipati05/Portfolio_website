import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/content";

export const metadata: Metadata = { title: "Contact · Sushant Pulipati" };

export default function ContactPage() {
  const github = profile.github.replace(/^https?:\/\//, "");

  return (
    <main>
      <section className="page-header">
        <div className="prompt">$ ping sushant</div>
        <h1 className="h1">
          Let&apos;s <span className="accent">talk.</span>
        </h1>
        <p className="lead">
          Hiring, collaborating, or just want to say hi? Email is the fastest way to reach me, but the form works too.
        </p>
      </section>

      <div className="contact-grid">
        <div className="contact-links">
          <a className="contact-card primary" href={`mailto:${profile.email}`}>
            <div className="label">email</div>
            <div className="value">{profile.email}</div>
          </a>
          <a className="contact-card" href={profile.github} target="_blank" rel="noreferrer">
            <div className="label">github</div>
            <div className="value">{github} ↗</div>
          </a>
          {profile.linkedin && (
            <a className="contact-card" href={profile.linkedin} target="_blank" rel="noreferrer">
              <div className="label">linkedin</div>
              <div className="value">LinkedIn ↗</div>
            </a>
          )}
          <a className="contact-card" href={profile.resume} target="_blank" rel="noreferrer">
            <div className="label">resume</div>
            <div className="value">resume.pdf ↓</div>
          </a>
        </div>
        <ContactForm />
      </div>

      <footer className="footer">© {new Date().getFullYear()} {profile.name} · designed and built by me</footer>
    </main>
  );
}
