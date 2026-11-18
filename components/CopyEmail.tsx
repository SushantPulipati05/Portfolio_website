"use client";

import { useState } from "react";

// Small "copy" button next to the email on the contact page.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the email is still selectable.
    }
  }

  return (
    <button type="button" className="copy" onClick={copy} aria-live="polite">
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}
