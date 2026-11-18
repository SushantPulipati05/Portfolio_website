"use client";

import { FormEvent, useState } from "react";
import { profile } from "@/data/content";

// Sends the message to /api/contact (app/api/contact/route.ts), which emails it to me.
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"), // honeypot, empty for real visitors
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-done" role="status">
        <p className="form-done-title">Transmission received.</p>
        <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button type="button" className="copy" onClick={() => setStatus("idle")}>
          send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">name</label>
        <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required />
      </div>
      <div className="field">
        <label htmlFor="email">email</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={200} required />
      </div>
      <div className="field">
        <label htmlFor="message">message</label>
        <textarea id="message" name="message" rows={4} minLength={10} maxLength={5000} required />
      </div>

      {/* Honeypot: hidden from people and screen readers; bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          {error} You can also email{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      )}

      <button type="submit" className="btn" disabled={sending}>
        {sending ? "sending…" : "send transmission →"}
      </button>
    </form>
  );
}
