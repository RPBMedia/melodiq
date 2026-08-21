# 🎧 MelodIQ — Product Requirements & Roadmap

> **Hear it. Name it. Beat the clock.**
> A fast, addictive "name that track" game spanning every corner of music — from
> chart pop to black metal to film scores — with 500+ clips, genre journeys,
> streaks, and a neon-lit UI that feels like a night out with an equalizer.

This document is the **source of truth** for MelodIQ's product direction. It
extends the working MVP (see `MelodIQ-README.md`) into a complete, kick-ass
product across seven milestones, and makes an explicit, honest case for **if and
when to monetize**.

---

## 1. Vision

MelodIQ turns "wait — I *know* this song!" into a game. You hear a 30-second
clip, race a decaying timer to name it, build streaks, climb leaderboards, and
collect the tracks you nail into a personal record wall. The hook is **breadth +
speed + bragging rights**: a general player and a death-metal obsessive both find
a lane, and both want "one more round."

**Three pillars**
1. **Range** — one game covers Top-40 to Norwegian black metal to Studio Ghibli
   scores. Depth per genre is what die-hards share with their friends.
2. **Feel** — sub-second audio start, a pulsing spectrum, a score that visibly
   melts as you hesitate, and confetti-grade payoff on a fast correct answer.
3. **Fairness** — server-authoritative timing and scoring (already built): the
   title never reaches the browser until after you answer, so scores are real.

**Non-goals (for now):** streaming full tracks, a social network, user-uploaded
audio, or becoming a music-discovery/recommendation product.

---

## 2. Current state (what already exists — call it M0/M1)

The repo ships a genuinely working full-stack game:

- **Auth & accounts:** Google sign-in (Auth.js/NextAuth v5) + Prisma
  (`User/Account/Session`).
- **Core loop:** 10-round game, 30s timer, live **decaying score**, Web-Audio
  **spectrum visualizer**, correct/incorrect reveal.
- **Two answer modes:** multiple-choice and **type-the-title** (typo-tolerant
  matching + autocomplete).
- **Genre playlists:** pick a genre or "all"; ~10 mainstream songs/genre, ~80
  songs across 8 genres.
- **Server-authoritative timing + scoring** (`scoring.ts`, round start/answer
  APIs) — anti-cheat by design.
- **Leaderboard** (public) + **per-user stats** (best/avg/accuracy/recent).
- **Legal audio:** `scripts/fetch-previews.mjs` fills `Song.previewUrl` from the
  **iTunes Search API** (free, legal 30s previews). *This is the linchpin — see
  §7 Content & Licensing.*
- **Data model:** `Song`, `GameSession`, `Round`.

**What's missing to be "kick-ass":** content breadth (→500+), a proper genre
taxonomy, meta-progression (levels/collection/achievements), more game modes, a
daily habit loop, competitive/social depth, mobile-grade polish, and a
monetization layer. That's M2–M7.

---

## 3. Design language

**Keep the existing neon-synthwave palette** (already in `tailwind.config.ts` /
`globals.css`) — it's the brand. Do not drift from these tokens; earn energy
through motion and layout, not new hues.

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0B0A1A` | app background (near-black indigo) |
| `surface` / `surface2` | `#15132B` / `#1E1B3A` | cards, panels |
| `line` | `#2A2750` | borders, dividers, scrollbar |
| `ink` / `muted` | `#F4F2FF` / `#A09CC4` | text / secondary text |
| `magenta` | `#FF2D87` | primary accent, CTAs, "hot" states |
| `violet` | `#8B5CF6` | secondary accent, genre chrome |
| `cyan` | `#22D3EE` | timers, active/now-playing |
| `good` / `bad` | `#34D399` / `#FB7185` | correct / wrong, score tiers |
| `amber` (`#FBBF24`) | | streaks, "mid" score, highlights |

Type: **Space Grotesk** (display) + **Inter** (body) — already set.

**Feel principles**
- **Motion is the product's personality.** Framer Motion for the score decay, a
  reactive spectrum that *is* the audio, streak flames, and a satisfying
  round-transition. Respect `prefers-reduced-motion` (swap pulses for fades).
- **The clip is the hero.** Big now-playing card, waveform/spectrum front and
  center, everything else recedes.
- **Reward speed viscerally.** Faster answers = brighter payoff (magenta→cyan
  flash, points count-up, streak++). A near-miss on the clock should *sting*.
- **Genre identity through accent + iconography, not new palettes.** Each genre
  gets an emoji/glyph + one accent from the existing set (e.g., metal→magenta,
  jazz→amber, classical→violet, electronic→cyan).
- **One-thumb mobile.** Everything reachable; audio starts on first tap
  (autoplay policies); big tap targets for MC; fast keyboard for typing mode.

---

## 4. Core gameplay loop

1. **Setup:** choose **mode** (see §5), **genre/journey**, and **answer style**
   (multiple-choice or type-the-title).
2. **Round:** clip starts (server stamps start). Timer + score decay begin. A
   **spectrum visualizer** pulses. Optional **hints** (see below) cost points.
3. **Answer:** MC tap or typed guess → server scores against its own clocks →
   reveal (title, artist, year, cover art) + "you were X% of the way to it."
4. **Between rounds:** streak state, running score, a quick "add to collection"
   moment for newly-identified tracks.
5. **Results:** score, accuracy, fastest answer, streak, XP earned, rank delta,
   share card. Prompt: next journey step / daily / rematch.

**Scoring (extend `scoring.ts`):** base points × speed multiplier × streak
multiplier × difficulty multiplier, minus hint costs. Keep it server-side.

**Hints (optional, cost points):** reveal genre → decade → artist initials →
first letter of title → one MC distractor removed. Hints turn "no idea" into a
gamble instead of a dead round (retention win).

---

## 5. Game modes (the variety that makes it kick-ass)

Ship the core first, then layer these. Each is a small variation on the proven
loop, which keeps engineering cheap and content reusable.

- **Classic (exists):** 10 clips, 30s each, genre or all.
- **Genre Journeys / "Tours"** *(the Dinoria-expeditions analog):* a map of
  themed stages per genre & era (e.g., *"Rise of Metal"*: NWOBHM → thrash →
  death → black → folk metal). Clear a stage (≥1★) to unlock the next; 3★ for
  mastery. This is the single best structure for turning a flat quiz into a
  **progression game** and giving 500+ clips a *purpose*.
- **Daily Challenge:** same 10 clips for everyone, seeded by date; a daily
  streak; a dedicated leaderboard. *The core habit loop.*
- **Survival / Streak:** infinite clips, 3 lives, difficulty ramps; how far can
  you go?
- **Speed / Intro Round:** identify from the **first 1–2 seconds**; escalating
  reveal (more of the clip plays the longer you wait, for fewer points).
- **Finish the Lyric / Guess the Year / Guess the Artist:** reuse the clip +
  metadata for fresh question types (needs lyric snippets and/or year fields).
- **Head-to-Head (async then live):** two players get the same 10 clips; compare
  scores. Later: real-time rooms with a lobby.
- **Weekly Tournament:** rotating ruleset, big leaderboard, seasonal cosmetics.
- **Playlist Party (local pass-and-play):** couch multiplayer for a phone.

---

## 6. Genre taxonomy

Your list, expanded and organized. MelodIQ ships **genre families** with
**sub-genres** so a casual picks "Rock" while a purist drills into "Melodic
Death Metal." Aim for coverage that flatters both. (★ = in your original ask.)

- **General / All Genres ★** — the great equalizer; the default lane.
- **Pop ★** family: pop ★, dance-pop, synth-pop, teen pop, K-pop, J-pop,
  Latin pop, electropop, indie pop.
- **Rock ★** family: classic rock, pop rock ★, hard rock ★, punk, post-punk,
  grunge, alternative ★(indie ★), progressive rock, psychedelic, garage,
  southern rock, arena rock.
- **Metal ★** family: heavy metal ★, hard rock ★, thrash, death metal ★,
  black metal ★, folk metal ★, power metal, doom/sludge, symphonic metal,
  metalcore/deathcore, nu-metal, industrial metal, djent, grindcore.
- **Electronic** family: house, techno, trance, EDM/big-room, drum & bass,
  dubstep, synthwave, ambient, IDM, industrial ★, trip-hop, lo-fi.
- **Hip-Hop / R&B** family: hip-hop/rap, boom-bap, trap, R&B, soul, funk,
  neo-soul, disco.
- **Jazz ★ / Blues ★** family: jazz ★, blues ★, swing, bebop, smooth jazz,
  bossa nova, gospel.
- **Roots / Folk** family: folk ★, indie folk, country, bluegrass, americana,
  reggae, ska, world/afrobeat, Celtic, new-age ★.
- **Classical ★ & Score** family: classical ★ (baroque/romantic/modern), opera,
  **OST ★** (film scores), **video-game music (VGM)**, musical theatre/Broadway.
- **Fun cross-cuts (not genres, but great quizzes):** by **decade**
  (60s→2020s), **one-hit wonders**, **movie/TV themes**, **Christmas/holiday**,
  **covers vs originals**, **"before they were famous."**

> **Recommendation:** launch with ~12 flagship genres (your ★ list) fully
> stocked, expose the family/sub-genre tree progressively, and use the
> cross-cut quizzes as limited-time events to keep the daily fresh.

---

## 7. Content & Licensing — the make-or-break

**This is the most important section for both product and monetization.** A
"name that hit" game needs *recognizable* music, and recognizable music is
copyrighted. How you source clips determines cost, legal risk, and therefore the
whole business model.

**What you already have (and why it's smart):** the iTunes **Search API** returns
free, legal **30-second preview** URLs for the vast majority of commercial music,
no API key, no per-play fee. That's why MelodIQ can reach 500+ recognizable clips
at **near-zero content cost** — a massive advantage over competitors who license
full catalogs.

**The honest caveat:** Apple's previews are provided to help users *find and buy*
music. Using them to power a monetized game is a **gray area**, not a clean
license. It's fine for building, testing, and a free product; before scaling a
**paid** product on them, review Apple Media Services / iTunes Affiliate terms
and have a fallback. Practical strategy:

1. **Now → launch (free):** iTunes previews via `fetch-previews.mjs`. Store
   `previewUrl`, `appleTrackId`, cover art, artist, year, genre. Cache/pin the
   clip metadata; never rehost the audio (stream Apple's URL).
2. **Diversify sourcing** so you're not single-supplier: add **Deezer API**
   (30s previews, generous terms) and **Spotify** (30s `preview_url`, though
   coverage is shrinking) as alternates; fall back per track.
3. **Safe-harbor genres:** for **classical, jazz standards, folk, and some OST**,
   lean on **public-domain** recordings and **Creative-Commons / production-music
   libraries** (e.g., Musopen for classical, ccMixter, Free Music Archive,
   Jamendo). These you can host and monetize cleanly.
4. **At real scale / serious monetization:** pursue a proper **licensed preview
   provider** (7digital, Napster/Rhapsody-style APIs) or a direct clip license.
   Budget this only once revenue justifies it. **SongPop** (the obvious
   comparable) does exactly this — licenses short clips — which is why it can
   charge; MelodIQ's edge is reaching MVP scale *without* that cost.

**Content targets to hit "500+ and kick-ass":**

| Tier | Genres | Clips each | Notes |
|---|---|---|---|
| Flagship | your ~12 ★ genres | 30–50 | enough for repeat play without repeats |
| Family fill | ~15 more sub-genres | 15–25 | depth for enthusiasts |
| Cross-cut events | decades, themes, OST/VGM | 20–40 | rotate as daily/events |

That math clears **500–700+** clips comfortably. Curate for **recognizability +
difficulty tiers** (1 iconic → 5 deep-cut), mirroring Dinoria's tiered pools so
"easy" and "legendary" modes both work. Build a lightweight **curation admin**
(or seed files like `songs.ts`) and a **QA pass** that verifies every
`previewUrl` resolves and the clip is the right recording.

**Metadata to store per track:** title, artist, year, genre + sub-genre,
difficulty tier, decade, `previewUrl` (+ provider + external id), cover art,
alt-titles/aliases (for typing mode), optional lyric snippet, "is
instrumental/OST/VGM" flags.

---

## 8. Progression & meta (the retention engine)

Borrow what makes Dinoria sticky, tuned for music:

- **XP & Levels:** earn XP from rounds, journeys, dailies; a triangular curve
  with **DJ-rank titles** (Bedroom DJ → Crate Digger → Selector → Resident →
  Headliner → Legend).
- **Record Collection:** every track you correctly ID becomes a collectible
  **record/card** (cover art + your best time + times seen) on a **record wall**.
  Completion % per genre drives "gotta catch 'em all."
- **Achievements/Badges:** data-driven (e.g., *"Name 10 metal tracks under 5s,"*
  *"Perfect classical round,"* *"7-day daily streak,"* *"One-hit wonder
  whisperer"*), with a celebration banner.
- **Streaks:** daily streak (habit) + in-run streak (dopamine).
- **Seasons:** a rotating theme every ~6 weeks (a featured genre/era), seasonal
  leaderboard + cosmetic rewards.

---

## 9. Social & competitive

- **Leaderboards** (exists → expand): global, **per-genre**, **weekly**,
  friends-only, daily-challenge.
- **Friends & rivals:** add by handle; see their scores on your daily; nudge for
  a rematch.
- **Head-to-Head:** async first (same seed), then live rooms.
- **Shareables:** a crisp result card ("I named *Painkiller* in 1.2s — beat me")
  for social loops. These are cheap and drive organic install/visits.

---

## 10. Audio UX & accessibility

- **Instant start:** preload the next clip; start audio on the user gesture that
  begins the round (mobile autoplay compliance). Target < 300ms perceived start.
- **Visualizer:** keep the Web-Audio spectrum; make it react to the actual clip;
  offer a calmer variant for reduced-motion.
- **Accessibility:** full keyboard play, captions/labels for controls, color is
  never the only signal (icons + text for correct/wrong), volume + mute memory,
  a "hard of hearing"-friendly mode that leans on year/artist metadata quizzes.
- **Resilience:** if a `previewUrl` 404s mid-game, the server silently swaps in a
  replacement round (never a dead clip).

---

## 11. Technical architecture (build on what's there)

- **Frontend:** Next.js 14 App Router + TS + Tailwind + Framer Motion (all
  present). Add: journey map UI, collection wall, richer results, event banners.
- **Auth:** NextAuth v5 (Google present); add email/magic-link later for reach.
- **DB:** Prisma → **Postgres in prod** (Supabase or Neon fits the family; the
  other apps already use Supabase). Extend schema: `Genre`, `SubGenre`,
  `JourneyStage`, `Achievement`, `UserAchievement`, `CollectionItem`,
  `DailyChallenge`, `Friendship`, plus fields on `Song` (difficulty, decade,
  aliases, provider ids, lyric snippet).
- **Audio:** stream provider preview URLs; never rehost licensed audio; host only
  the CC/PD clips you own.
- **Server-authoritative** everything score/time related (already the pattern) —
  essential once money/leaderboards matter.
- **Content pipeline:** extend `fetch-previews.mjs` into a multi-provider
  fetch + validate + tier tool; keep song pools in version-controlled seed files
  with a QA script (verify URL + correct recording).
- **Analytics:** event tracking (round start/answer/finish, hint use, mode,
  genre, retention cohorts) — you can't make the monetization call in §12
  without this.

---

## 12. Monetization — the case, and the timing

**Should MelodIQ be monetized? — Yes, eventually, but retention comes first.**
A music-quiz game lives or dies on *content breadth + fun + habit*. Monetizing a
thin or leaky game just caps a small number; monetizing a sticky one compounds.

**The unusual advantage:** because MVP content runs on **free preview APIs**,
MelodIQ's **content cost is near-zero at first** — unlike SongPop, you are *not*
forced to monetize to cover licensing early. That means you can **optimize purely
for growth/retention first**, then switch on revenue from a position of strength.

**Comparable — SongPop:** the definitive proof the category monetizes. It
licenses short clips and runs **freemium**: free play with limits/ads, sells
**song packs**, and a **subscription** (unlimited plays, exclusive packs,
ad-free). It has done tens of millions of installs. MelodIQ can copy the *model*
while dodging the early *cost*.

**Recommended model (freemium, layered):**
1. **Free core forever** — daily challenge, a rotating set of genres, leaderboards.
   This is the growth engine; never gate the habit loop.
2. **Ads as a floor (light):** a rewarded ad for "extra daily play" or "continue
   your streak"; occasional interstitial between games. Rewarded > forced.
3. **MelodIQ Pro (subscription, ~$3.99/mo or ~$24/yr):** unlimited plays, **all
   genre journeys unlocked**, ad-free, **advanced stats** (per-genre accuracy,
   fastest-ID history), exclusive **modes** (Intro/Speed), and cosmetic
   themes/visualizers. This is the primary revenue line.
4. **One-time packs / cosmetics:** decade packs, "Metal Deep Cuts," seasonal
   visualizer skins — for players who won't subscribe.

**When to flip each on (gates, not dates):**
- **Now → don't monetize.** Instrument analytics; grow content to 500+; make the
  daily loop genuinely sticky.
- **Gate A — turn on ads floor + Pro** once you have: **500+ clips**, a working
  **daily + journeys**, and **D7 retention ≳ 20%** with a few hundred DAU. Below
  that, revenue is noise and monetization risks capping growth.
- **Gate B — packs, seasons, live H2H** once **Pro conversion ≳ 3–5%** and
  retention holds. This is where you'd also **budget a real clip license** (Gate
  B revenue should cover it) and de-risk the §7 gray area.
- **Guardrail:** keep the **free experience excellent**. The moment monetization
  hurts D1/D7, pull it back. Watch **conversion, ARPDAU, and retention together** —
  never trade a big retention hit for a small revenue bump.

**Rough unit economics to validate the case:** with free preview audio, marginal
cost/user ≈ hosting + analytics + occasional ad-network fees ≈ pennies. A single
Pro subscriber (~$24/yr) therefore covers *many* free users — so the model works
at **modest scale** *if* retention is real. The entire bet reduces to: **can
MelodIQ make people come back daily?** Everything in M2–M5 is aimed at that; §12
is only worth executing after it's proven.

---

## 13. Milestones

Structured like Dinoria's PRD — each milestone is shippable and gated by the
"definition of done" in §14. **Only advance when the previous milestone is
stable.**

### M1 — Foundation ✅ (largely built)
Core loop, Google auth, MC + typing modes, ~80 songs/8 genres, server-auth
scoring, leaderboard, per-user stats, iTunes preview pipeline. *Polish + deploy.*

### M2 — Content & Genres (the "500+" milestone)
- Genre **taxonomy** (families + sub-genres) in schema + UI.
- Multi-provider **content pipeline** (iTunes + Deezer fallback) with validation
  + **difficulty tiers**; CC/PD sourcing for classical/jazz/folk safe harbor.
- Grow library to **500+ curated clips** across the flagship genres.
- Curation/QA pass: every `previewUrl` verified, right recording, tiered.

### M3 — Progression & Habit
- **Daily Challenge** (seeded, streaks, its own leaderboard).
- **XP/Levels** with DJ-rank titles; **Record Collection** wall; **Achievements**.
- Results/share cards; onboarding that teaches the loop in 20 seconds.

### M3.5 — Content Floor (≥50 per sub-genre) — **highest priority, before multiplayer**
Guarantee variety even in the longest game: **every sub-genre must hold at least
50 curated, preview-verified tracks** (≈2× the 30-question max, with headroom), so
a single game never repeats a clip. Current depth is far below this — Black Metal
11; Dance, Folk metal, Hip hop 10; R&B 13; New-age 14 (baseline: 383 songs across
19 sub-genres, **all under 50**), so the same songs recur within one game.

- Extend the content pipeline into an **"expand genre to N"** tool: curated
  candidate lists → multi-provider preview fetch (iTunes + Deezer) → validate
  (URL resolves, right recording, difficulty tier) → append to the
  version-controlled `prisma/songs.ts` (dedup by title+artist).
- Raise **every** sub-genre to ≥50, thinnest first (dance, folk metal, hip hop,
  black metal, r&b, new-age…), keeping a spread of difficulty tiers and eras.
- Add a **floor-check script** that fails when `min(count per sub-genre) < 50`.
- **DoD:** min per-sub-genre count ≥ 50; floor-check green; a 30-question game in
  any one sub-genre yields 30 distinct tracks; no dead previews or wrong/duplicate
  recordings after a re-seed + spot-check.

### M4 — Modes & Journeys
- **Genre Journeys/Tours** (the map-progression backbone) with star ratings +
  unlocks, themed per genre/era.
- **Survival**, **Speed/Intro**, and one metadata mode (**Guess the Year** or
  **Finish the Lyric**).
- Hints system; per-genre + weekly leaderboards.

### M5 — Social & Live
- Friends/rivals; **async Head-to-Head**; weekly **tournaments**; seasons.
- Deeper stats; shareable rivalries.

### M6 — Monetization & Growth
- Analytics-driven decision on Gate A (per §12); **MelodIQ Pro** subscription
  (Stripe — reuse StoryMaker's Stripe learnings), **rewarded ads** floor,
  **genre/decade packs**.
- SEO/landing + share loops; app-store-ready PWA (installable, offline shell).
- Revisit **licensing** (Gate B) if scaling.

### M7 — Live Multiplayer & Platform
- Real-time H2H rooms + lobbies; live tournaments.
- Native wrappers (Capacitor/Expo) for App Store/Play if the web numbers justify.
- Continued content, seasonal events, performance.

---

## 14. Definition of done (per milestone)
Implementation + loading/error/empty states + TypeScript passes + lint passes +
tests pass (scoring/matching are the critical units) + **mobile-first behaviour
checked** + accessibility basics (keyboard, reduced-motion, non-color signals) +
audio verified on iOS Safari & Android Chrome + docs updated. No placeholder
logic presented as production behaviour. Server stays authoritative for anything
scored or timed.

---

## 15. Success metrics (KPIs)
- **Retention:** D1, **D7**, D30 (the north star; gates monetization).
- **Habit:** daily-challenge play rate, daily-streak length.
- **Engagement:** rounds/session, sessions/DAU, hint usage, mode mix.
- **Breadth health:** clip repeat-rate per player (want low), per-genre coverage.
- **Growth:** share→install/visit rate, K-factor from result cards.
- **Revenue (post-Gate A):** Pro conversion %, ARPDAU, ad eCPM, churn.

---

## 16. Risks & mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| **Preview-API licensing gray area** | High | Multi-provider fallback; CC/PD safe-harbor genres; budget a real license at Gate B; never rehost licensed audio |
| Preview coverage gaps / dead URLs | Med | Validate in pipeline; server hot-swaps dead rounds; store multiple provider ids |
| Retention doesn't materialize | High | Don't monetize until D7 proven; invest M3/M4 (daily + journeys) first |
| Audio latency / autoplay blocks | Med | Preload next clip; start on user gesture; perceived-start budget |
| Cheating on leaderboards | Med | Server-authoritative timing/scoring (already the pattern); title withheld until answered |
| Content curation cost | Med | Tiered seed files + QA script; community-suggested tracks later (moderated) |

---

## 17. Open questions for Rui
1. **Store target:** web/PWA first (fastest, matches the family) with native
   wrappers later — agree? (Native music playback has extra store/licensing
   scrutiny.)
2. **Reuse Supabase** (like your other apps) for prod Postgres + auth, or keep
   NextAuth/Prisma + Neon?
3. **Monetization appetite:** comfortable launching **free-first** and only
   flipping revenue at Gate A (D7 ≳ 20%)? (Strongly recommended.)
4. **Content ambition:** stop at 500+, or treat it as a living catalog that keeps
   growing (like Dinoria's 200)?

---

*Structure intentionally mirrors `DINORIA_PRD.md`: numbered milestones, a clear
definition of done, and quality gates. Build one milestone at a time; keep the
neon palette; make the daily loop irresistible before charging a cent.*
