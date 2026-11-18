import { Resend } from "resend";

// POST /api/contact
// Receives the contact form as JSON, checks it, and emails it to me through Resend.
// The API key only lives on the server (env vars), so the browser never sees it.
//
// Status codes:
//   200  sent (or silently dropped spam)
//   400  the visitor sent something invalid
//   500  my setup is broken (missing env vars)
//   502  Resend failed to send

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
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

  // 4. Config
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return bad("The form isn't set up right now.", 500);
  }

  // 5. Send
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>", // Resend's test sender until sushnt.dev is verified
    to: toEmail,
    replyTo: email, // replying in Gmail goes straight to the visitor
    subject: `New message from ${name} via sushnt.dev`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return bad("Couldn't send right now. Please try again in a bit.", 502);
  }

  return Response.json({ ok: true });
}
