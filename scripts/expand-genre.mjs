// Content Floor tool (PRD M3.5). Takes curated candidate lists for sub-genres,
// validates that each track has a real streamable preview (iTunes → Deezer),
// de-dupes against the existing pool (and across this run), and appends the
// survivors to prisma/songs.ts as SeedSong rows.
//
//   node scripts/expand-genre.mjs <file.mjs> [<file2.mjs> ...]
//
// Each file's default export is a batch { genre, coverColor, songs: [{ title,
// artist, year, difficulty }] } OR an array of such batches. Year/difficulty
// come from curation; the APIs only confirm a playable preview exists, so we
// never seed genre-filler that would play silent.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const songsPath = join(__dirname, "..", "prisma", "songs.ts");

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const key = (t, a) => `${norm(t)}::${norm(a)}`;
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node scripts/expand-genre.mjs <file.mjs> [<file2.mjs> ...]");
  process.exit(1);
}

let text = readFileSync(songsPath, "utf8");
const existing = new Set();
for (const m of text.matchAll(/title:\s*"((?:[^"\\]|\\.)+)",\s*artist:\s*"((?:[^"\\]|\\.)+)"/g)) {
  existing.add(key(m[1].replace(/\\"/g, '"'), m[2].replace(/\\"/g, '"')));
}

// Collect all batches from every file (each default = batch or batch[]).
const batches = [];
for (const f of files) {
  const mod = await import(pathToFileURL(resolve(f)).href);
  for (const b of Array.isArray(mod.default) ? mod.default : [mod.default]) batches.push(b);
}

let addedLines = "";
for (const { genre, coverColor, songs } of batches) {
  if (!genre || !coverColor || !Array.isArray(songs)) {
    console.error("bad batch (need genre, coverColor, songs):", genre);
    continue;
  }
  const kept = [];
  let dup = 0;
  let dropped = 0;
  for (const c of songs) {
    const k = key(c.title, c.artist);
    if (existing.has(k)) {
      dup++;
      continue;
    }
    const ok = (await itunesPreview(c.title, c.artist)) || (await deezerPreview(c.title, c.artist));
    await sleep(150);
    if (!ok) {
      dropped++;
      continue;
    }
    existing.add(k);
    kept.push(c);
  }
  for (const c of kept) {
    addedLines += `  { title: "${esc(c.title)}", artist: "${esc(c.artist)}", genre: "${genre}", year: ${c.year}, coverColor: "${coverColor}", difficulty: ${c.difficulty ?? 2} },\n`;
  }
  console.log(`"${genre}": +${kept.length} · ${dup} dup · ${dropped} dropped`);
}

if (addedLines) {
  const idx = text.lastIndexOf("];");
  text = text.slice(0, idx) + addedLines + text.slice(idx);
  writeFileSync(songsPath, text);
}
console.log("\nDone. Run `npm run check:floor` to verify.");
