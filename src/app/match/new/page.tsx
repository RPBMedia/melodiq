import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MatchNewForm } from "@/components/MatchNewForm";

export const dynamic = "force-dynamic";

export default async function NewMatchPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>
      <h1 className="font-display text-3xl font-bold">🎮 Head-to-Head</h1>
      <p className="mt-1 text-muted">
        Challenge a friend to the same 10 clips. No hints — everyone plays on equal terms.
      </p>
      <MatchNewForm />
    </main>
  );
}
