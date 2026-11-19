import { Resend } from "resend";

// POST /api/contact
// Receives the contact form as JSON, checks it, emails it to me through Resend,
// then sends the visitor a short "got your message" confirmation.
// The API key only lives on the server (env vars), so the browser never sees it.
//
// Status codes:
//   200  sent (or silently dropped spam)
//   400  the visitor sent something invalid
//   429  too many messages from the same visitor
//   500  my setup is broken (missing env vars)
//   502  Resend failed to send

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = process.env.CONTACT_FROM_EMAIL || "Sushant <hello@sushnt.dev>"; // must be on the verified domain

// ---------- Rate limiting ----------
// At most 3 messages per visitor (IP) per hour, and at most 2 confirmation emails
// to the same address per day. This stops someone from using the form to flood an
// inbox. It's kept in memory, so it's best-effort: each server instance on Vercel
// has its own counters. If the form ever gets abused, move this to a shared store
// like Upstash Redis.
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const hits = new Map<string, number[]>();

function tooMany(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing forever on a long-lived instance.
  if (hits.size > 5000) hits.clear();
  return false;
}

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

// Only use the visitor's name in the confirmation if it looks like a plain name,
// so the form can't be used to send links or messages to someone else.
function safeFirstName(name: string) {
  const looksLikeLink = /(https?:|www\.|\.[a-z]{2,}\b|[<>@/\\])/i.test(name);
  if (looksLikeLink) return "there";
  const first = name.split(/\s+/)[0].slice(0, 40);
  return first || "there";
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function confirmationEmail(firstName: string) {
  const text = [
    `Hey ${firstName},`,
    "",
    "Your message made it across the void and landed safely in my inbox. 🛰️",
    "",
    "I read every one myself (no bots here, except the one sending you this), so give me a day or two and I’ll write back properly.",
    "",
    "Sushant Pulipati",
    "sushnt.dev",
    "",
    "(If you didn’t send a message on sushnt.dev, you can ignore this email.)",
  ].join("\n");

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#16161a;max-width:520px">
  <p>Hey ${escapeHtml(firstName)},</p>
  <p>Your message made it across the void and landed safely in my inbox. 🛰️</p>
  <p>I read every one myself (no bots here, except the one sending you this), so give me a day or two and I’ll write back properly.</p>
  <p>Sushant Pulipati<br><a href="https://sushnt.dev" style="color:#3346d8">sushnt.dev</a></p>
  <p style="font-size:12px;color:#85868d">If you didn’t send a message on sushnt.dev, you can ignore this email.</p>
</div>`;

  return { text, html };
}

export async function POST(request: Request) {
  // 1. Read the body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }
  if (typeof body !== "object" || body === null) return bad("Invalid request.");
  const data = body as Record<string, unknown>;

  // 2. Honeypot: a hidden field humans never fill in. Bots do, so pretend it worked.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  // 3. Validate (never trust the browser's "required" checks)
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (name.length < 1 || name.length > 100) return bad("Please add your name (up to 100 characters).");
  if (email.length > 200 || !EMAIL_RE.test(email)) return bad("Please enter a valid email address.");
  if (message.length < 10) return bad("Your message is a bit short. Say a little more?");
  if (message.length > 5000) return bad("Your message is too long (5,000 characters max).");

  // 4. Rate limit per visitor
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(`ip:${ip}`, 3, HOUR)) {
    return bad("You've sent a few messages already. Please try again in an hour.", 429);
  }

  // 5. Config
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return bad("The form isn't set up right now.", 500);
  }

  const resend = new Resend(apiKey);

  // 6. Send the message to me
  const { error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    replyTo: email, // replying in Gmail goes straight to the visitor
    subject: `New message from ${name} via sushnt.dev`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return bad("Couldn't send right now. Please try again in a bit.", 502);
  }

  // 7. Confirmation to the visitor. Fixed text, never their message.
  //    If this fails, their message still reached me, so don't show an error.
  if (!tooMany(`to:${email.toLowerCase()}`, 2, DAY)) {
    const { text, html } = confirmationEmail(safeFirstName(name));
    const confirm = await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: toEmail, // if they reply to the confirmation, it comes to my Gmail
      subject: "Transmission received",
      text,
      html,
    });
    if (confirm.error) console.error("Contact form: confirmation email failed", confirm.error);
  }

  return Response.json({ ok: true });
}
