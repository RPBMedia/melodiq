import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GamePlayer, type Variant } from "@/components/GamePlayer";

export const dynamic = "force-dynamic";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: { daily?: string; mode?: string; stage?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const daily = searchParams?.daily === "1";
  const stageId = searchParams?.stage || undefined;
  const initialVariant: Variant = ["survival", "speed", "year"].includes(searchParams?.mode ?? "")
    ? (searchParams!.mode as Variant)
    : "classic";

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-8 lg:max-w-5xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>
      <GamePlayer daily={daily} initialVariant={initialVariant} stageId={stageId} />
    </main>
  );
}
