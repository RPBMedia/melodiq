import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// Apple is wired only when its credentials are configured, so the app builds and
// runs on Google + email/password without an Apple Developer setup. Apple's
// clientSecret is a signed JWT you generate from your Apple key (Team/Key/Service IDs).
const appleEnabled = !!(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET);
export const APPLE_ENABLED = appleEnabled;

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Set explicitly (rather than relying on v5 env auto-detection) so a missing
  // secret fails loudly at config time and Vercel host-trust is unambiguous.
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    ...(appleEnabled
      ? [
          Apple({
            clientId: process.env.AUTH_APPLE_ID,
            clientSecret: process.env.AUTH_APPLE_SECRET,
          }),
        ]
      : []),
    // Email + password for players who don't want a third-party login. Works
    // with the JWT session strategy already in use; the register endpoint
    // (/api/auth/register) creates the account and hashes the password.
    Credentials({
      name: "Email & password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String(creds?.email ?? "").toLowerCase().trim();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    // Persist the database user id onto the JWT and expose it on the session
    // so server code can attach game sessions to the right account.
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
