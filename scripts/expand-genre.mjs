// Content Floor tool (PRD M3.5). Takes a curated candidate list for one
// sub-genre, validates that each track has a real streamable preview
// (iTunes → Deezer), de-dupes against the existing pool, and appends the
// survivors to prisma/songs.ts as SeedSong rows.
//
//   node scripts/expand-genre.mjs scripts/genre-candidates/<genre>.mjs
//
// Candidate module default export: { genre, coverColor, songs: [{ title,
// artist, year, difficulty }] }. Year/difficulty come from curation; the APIs
// are used only to confirm a playable preview exists (so we never seed a
// genre-filler track that would play silent).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const songsPath = join(__dirname, "..", "prisma", "songs.ts");

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const key = (t, a) => `${norm(t)}::${norm(a)}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function itunesPreview(title, artist) {
  try {
    const term = encodeURIComponent(`${artist} ${title}`);
    const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=6&country=US`;
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    const at = norm(artist).split(" ")[0];
    const tt = norm(title);
    return (data.results || []).some(
      (r) =>
        r.previewUrl &&
        norm(r.artistName || "").includes(at) &&
        (norm(r.trackName || "").includes(tt) || tt.includes(norm(r.trackName || ""))),
    );
  } catch {
    return false;
  }
}

async function deezerPreview(title, artist) {
  try {
    const term = encodeURIComponent(`artist:"${artist}" track:"${title}"`);
    const res = await fetch(`https://api.deezer.com/search?q=${term}&limit=5`);
    if (!res.ok) return false;
    const data = await res.json();
    return (data.data || []).some((r) => r.preview);
  } catch {
    return false;
  }
}

const candFile = process.argv[2];
if (!candFile) {
  console.error("usage: node scripts/expand-genre.mjs <candidatesFile.mjs>");
  process.exit(1);
}
const mod = await import(pathToFileURL(resolve(candFile)).href);
const { genre, coverColor, songs: candidates } = mod.default;
if (!genre || !coverColor || !Array.isArray(candidates)) {
  console.error("candidates file must export { genre, coverColor, songs: [...] }");
  process.exit(1);
}

let text = readFileSync(songsPath, "utf8");
const existing = new Set();
for (const m of text.matchAll(/title:\s*"((?:[^"\\]|\\.)+)",\s*artist:\s*"((?:[^"\\]|\\.)+)"/g)) {
  existing.add(key(m[1].replace(/\\"/g, '"'), m[2].replace(/\\"/g, '"')));
}

const kept = [];
let dup = 0;
let dropped = 0;
for (const c of candidates) {
  const k = key(c.title, c.artist);
  if (existing.has(k)) {
    dup++;
    continue;
  }
  const ok = (await itunesPreview(c.title, c.artist)) || (await deezerPreview(c.title, c.artist));
  await sleep(200); // be polite to the search APIs
  if (!ok) {
    dropped++;
    console.log("  DROP (no preview):", c.title, "—", c.artist);
    continue;
  }
  existing.add(k);
  kept.push(c);
}

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const lines = kept
  .map(
    (c) =>
      `  { title: "${esc(c.title)}", artist: "${esc(c.artist)}", genre: "${genre}", year: ${c.year}, coverColor: "${coverColor}", difficulty: ${c.difficulty ?? 2} },`,
  )
  .join("\n");

if (kept.length) {
  const idx = text.lastIndexOf("];");
  text = text.slice(0, idx) + lines + "\n" + text.slice(idx);
  writeFileSync(songsPath, text);
}

console.log(
  `\n"${genre}": +${kept.length} added · ${dup} already present · ${dropped} dropped (no preview).`,
);
