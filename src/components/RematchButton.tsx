"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Clone a finished match's settings into a fresh one and go play it.
export function RematchButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rematch() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/match/${matchId}/rematch`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.matchId) {
        setError(data.error || "Could not start a rematch.");
        return;
      }
      router.push(`/play?match=${data.matchId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={rematch} disabled={busy} className="btn-primary w-full px-6 py-4 text-base disabled:opacity-60">
        {busy ? "Starting…" : "🔁 Rematch"}
      </button>
      {error && <p className="text-center text-sm text-bad">{error}</p>}
    </div>
  );
}
