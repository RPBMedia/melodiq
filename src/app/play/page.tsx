import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GamePlayer } from "@/components/GamePlayer";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-8 lg:max-w-5xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>
      <GamePlayer />
    </main>
  );
}
