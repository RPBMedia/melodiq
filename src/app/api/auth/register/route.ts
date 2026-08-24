import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, isValidEmail, passwordProblem } from "@/lib/password";

export const dynamic = "force-dynamic";

// Create an email/password account. The client then signs in via the Credentials
// provider. Emails are unique across all login methods, so an address already
// used with Google (or already registered) is rejected here.
export async function POST(req: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  const name = body.name ? String(body.name).trim().slice(0, 60) : null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const pwProblem = passwordProblem(password);
  if (pwProblem) {
    return NextResponse.json({ error: pwProblem }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });
  if (existing) {
    // No passwordHash => the account is OAuth (Google). Point them at the right button.
    const error = existing.passwordHash
      ? "That email is already registered. Try signing in instead."
      : "This email is registered with Google — use Continue with Google below.";
    return NextResponse.json({ error }, { status: 409 });
  }

  await prisma.user.create({
    data: { email, name, passwordHash: hashPassword(password) },
  });

  return NextResponse.json({ ok: true });
}
