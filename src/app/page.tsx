import { redirect } from "next/navigation";
import { auth, APPLE_ENABLED } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Visualizer } from "@/components/Visualizer";
import { AuthPanel } from "@/components/AuthPanel";

export default async function Landing() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-16 lg:max-w-xl">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Logo className="text-2xl" />
        <h1 className="mt-10 font-display text-4xl font-bold leading-tight lg:text-5xl">
          Hear it. <span className="grad-text">Name it.</span><br />Beat the clock.
        </h1>
        <p className="mt-4 max-w-xs text-muted lg:max-w-sm lg:text-lg">
          A 30-second clip. Four choices. The faster you guess the song, the more
          you score.
        </p>

        <div className="mt-10 w-full">
          <Visualizer active />
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-2 text-left text-xs text-muted sm:grid-cols-4">
          <Tier t="0–5s" p="100" />
          <Tier t="6–10s" p="80" />
          <Tier t="11–20s" p="50" />
          <Tier t="21–30s" p="25" />
        </div>
      </div>

      <div className="mt-10">
        <AuthPanel appleEnabled={APPLE_ENABLED} />
        <p className="mt-4 text-center text-xs text-muted">
          Sign in to save scores and climb the leaderboard.
        </p>
      </div>
    </main>
  );
}

function Tier({ t, p }: { t: string; p: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface2/50 border border-line px-3 py-2">
      <span>{t}</span>
      <span className="font-display font-bold text-ink">{p}</span>
    </div>
  );
}
