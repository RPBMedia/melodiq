// Content Floor guard (PRD M3.5): every sub-genre must hold >= 50 tracks so a
// 30-question game never repeats. Exits non-zero when any sub-genre is below the
// floor, so it can gate CI. Counts from the version-controlled prisma/songs.ts.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FLOOR = 50;
const __dirname = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(__dirname, "..", "prisma", "songs.ts"), "utf8");

const counts = {};
for (const m of text.matchAll(/genre:\s*"([^"]+)"/g)) counts[m[1]] = (counts[m[1]] || 0) + 1;

const rows = Object.entries(counts).sort((a, b) => a[1] - b[1]);
let below = 0;
for (const [g, n] of rows) {
  const ok = n >= FLOOR;
  if (!ok) below++;
  console.log(`${ok ? "ok " : "LOW"} ${String(n).padStart(3)}  ${g}`);
}
const total = rows.reduce((s, [, n]) => s + n, 0);
console.log(`\n${rows.length} sub-genres · ${total} songs · floor ${FLOOR} · ${below} below floor`);
process.exit(below ? 1 : 0);
