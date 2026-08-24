"use client";

import { useState } from "react";

// Share/copy the match link so a friend can accept the challenge.
export function MatchInvite({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function invite() {
    const url = `${window.location.origin}${path}`;
    const text = "I challenge you on MelodIQ 🎧 — same 10 clips, best score wins.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "MelodIQ Head-to-Head", text, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={invite}
      className="btn-primary w-full px-6 py-4 text-base"
    >
      {copied ? "✓ Link copied!" : "📣 Invite a friend"}
    </button>
  );
}
