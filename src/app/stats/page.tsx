import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { StatsView } from "@/components/StatsView";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-10">
      <header className="flex items-center justify-between">
        <Logo className="text-xl" />
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </header>
      <h1 className="mt-8 font-display text-3xl font-bold">📈 My stats</h1>
      <StatsView />
    </main>
  );
}
