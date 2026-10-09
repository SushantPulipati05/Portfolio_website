"use client";

import { FormEvent } from "react";
import { profile } from "@/data/content";

// For now this opens the visitor's email app with the message filled in,
// so it works without a backend. Later you can swap in a real API route
// (e.g. app/api/contact/route.ts with Resend) without changing the UI.
export default function ContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Hello from ${name || "your website"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="name">name</label>
      <input id="name" name="name" type="text" autoComplete="name" required />
      <label htmlFor="email">email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="message">message</label>
      <textarea id="message" name="message" rows={5} required />
      <button type="submit" className="btn">
        send →
      </button>
    </form>
  );
}
