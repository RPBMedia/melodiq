import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// Password hashing with Node's built-in scrypt — no external dependency. Stored
// as "salt:hash" (both hex). Used by the Credentials auth provider so players
// who don't want a third-party login can use email + password.

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, KEYLEN);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

/** Minimum viable password policy: at least 8 characters. */
export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}
