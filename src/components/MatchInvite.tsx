"use client";

import { useState } from "react";

// Copy the match link to the clipboard so the host can paste it to a friend.
// Deliberately NOT the native share sheet — on desktop that menu confused testers;
// a direct copy with a clear confirmation is predictable everywhere.
export function MatchInvite({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    setFailed(false);
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={copy} className="btn-primary w-full px-6 py-4 text-base">
        {copied ? "✓ Link copied! Send it to your friend" : "📋 Copy invite link"}
      </button>
      {failed && (
        <p className="break-all text-center text-xs text-muted">
          Couldn&rsquo;t copy automatically — here&rsquo;s the link:{" "}
          <span className="text-ink">{path}</span>
        </p>
      )}
    </div>
  );
}
