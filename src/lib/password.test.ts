import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, isValidEmail, passwordProblem } from "./password";

test("hash round-trips and rejects wrong passwords", () => {
  const stored = hashPassword("correct horse battery");
  assert.ok(stored.includes(":"));
  assert.equal(verifyPassword("correct horse battery", stored), true);
  assert.equal(verifyPassword("wrong password", stored), false);
});

test("each hash uses a fresh salt", () => {
  assert.notEqual(hashPassword("same"), hashPassword("same"));
});

test("verifyPassword tolerates malformed stored values", () => {
  assert.equal(verifyPassword("x", ""), false);
  assert.equal(verifyPassword("x", "nosalt"), false);
});

test("email + password validation", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("nope"), false);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(passwordProblem("short"), "Password must be at least 8 characters.");
  assert.equal(passwordProblem("longenough"), null);
});
