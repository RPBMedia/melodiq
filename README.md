# 🎧 MelodIQ

Hear a 30-second clip, name the song before the clock runs out. The faster you
guess, the more you score. Account-based, Google sign-in, a public leaderboard,
and per-player stats.

This is an initial, working full-stack version with a clean structure you can
build on.

---

## Stack

| Layer    | Choice                                            |
| -------- | ------------------------------------------------- |
| Framework| **Next.js 14** (App Router) + **TypeScript**      |
| Styling  | **Tailwind CSS** + **Framer Motion** (dark theme) |
| Auth     | **Auth.js (NextAuth v5)** with **Google** sign-in |
| Database | **Prisma** ORM — SQLite in dev, Postgres in prod  |
| Audio    | HTML5 `<audio>` + Web Audio API visualizer        |

---

## What's included

- Google login + session handling
- Dashboard with **Play**, **Leaderboard**, and **My Stats** cards
- Pre-game setup: choose an **answer mode** (multiple choice / type the title)
  and a **genre playlist** (or all genres)
- Full 10-song game loop with a 30s timer, a live decaying score, a pulsing
  spectrum visualizer, and a correct/incorrect reveal
- **Server-authoritative timing _and_ scoring**: the server stamps when each
  clip starts and when the guess arrives, so neither the elapsed time nor the
  points can be faked by the client — the correct title isn't even sent to the
  browser until after you answer
- "Type the title" mode with typo-tolerant matching and title autocomplete
- Genre-filtered playlists (~10 mainstream songs per genre)
- Public leaderboard (username/avatar, score, genre/mode, date)
- Per-user stats (best, average, accuracy, recent games)
- Prisma schema for **users, songs, game sessions, and scores**
- A seed script with ~80 mainstream songs across 8 genres
- An optional script to populate **legal** 30s previews from the iTunes API

---

## Project structure

```
melodiq/
├─ prisma/
│  ├─ schema.prisma        # User, Account, Session, Song, GameSession, Round
│  ├─ songs.ts             # the song pool (~80 songs) + GENRES
│  └─ seed.ts              # seeds the song pool
├─ scripts/
│  └─ fetch-previews.mjs   # optional: fill previewUrl from iTunes Search API
├─ src/
│  ├─ lib/
│  │  ├─ auth.ts           # NextAuth config (Google + Prisma adapter)
│  │  ├─ prisma.ts         # Prisma client singleton
│  │  ├─ scoring.ts        # the scoring rules (single source of truth)
│  │  ├─ match.ts          # typo-tolerant title matching (typing mode)
│  │  ├─ game.ts           # genre-aware round + option generation
│  │  └─ types.ts          # session type augmentation
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  ├─ game/start/route.ts          # create session + rounds (genre/mode)
│  │  │  ├─ game/round/start/route.ts    # stamp server start time for a round
│  │  │  ├─ game/round/answer/route.ts   # score one round on server clocks
│  │  │  ├─ game/finish/route.ts         # aggregate + mark finished
│  │  │  ├─ genres/route.ts              # public genre list + counts
│  │  │  ├─ leaderboard/route.ts         # public top scores
│  │  │  └─ stats/route.ts               # current user's stats
│  │  ├─ page.tsx          # landing / sign-in
│  │  ├─ dashboard/page.tsx
│  │  ├─ play/page.tsx
│  │  ├─ leaderboard/page.tsx
│  │  ├─ stats/page.tsx
│  │  ├─ layout.tsx, providers.tsx, globals.css
│  └─ components/
│     ├─ GamePlayer.tsx    # setup + core game loop (client)
│     ├─ Visualizer.tsx    # the pulsing spectrum (signature element)
│     ├─ LeaderboardList.tsx, StatsView.tsx
│     ├─ DashboardCard.tsx, AuthButtons.tsx, Logo.tsx
└─ ...config files
```

> **Upgrading from the first version?** The schema changed (server-timing
> fields + a `finishedAt` flag). Re-run `npm run db:push` and `npm run db:seed`.

---

## Getting started

### 1. Prerequisites
- Node.js 18.17+ (Node 20+ recommended)
- npm

### 2. Install
```bash
npm install
```

### 3. Environment
```bash
cp .env.example .env
```
Then fill in `.env`:
- `AUTH_SECRET` — run `npx auth secret` (or `openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — see below
- `DATABASE_URL` — already set to SQLite by default

### 4. Setting up Google login
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) →
   **APIs & Services → Credentials**.
2. **Create credentials → OAuth client ID → Web application**.
3. Add **Authorized redirect URI**:
   `http://localhost:3000/api/auth/callback/google`
   (add your production URL too, e.g.
   `https://yourdomain.com/api/auth/callback/google`).
4. Copy the **Client ID** and **Client secret** into `.env`.

### 5. Database + seed
```bash
npm run db:push     # create tables from the schema
npm run db:seed     # load the song pool
```

### 6. (Optional) Real audio previews
By default songs have no audio and rounds run as a silent timed challenge.
To play **legal** 30-second previews, populate them from Apple's free iTunes
Search API (no key required; its `previewUrl` clips are licensed for preview):
```bash
npm run fetch:previews
```

### 7. Run
```bash
npm run dev
```
Open http://localhost:3000.

---

## Scoring rules

A round lasts **30 seconds**, a game is **10 songs**.

| Answered within | Points (if correct) |
| --------------- | ------------------- |
| 0–5 s           | 100                 |
| 6–10 s          | 80                  |
| 11–20 s         | 50                  |
| 21–30 s         | 25                  |
| Wrong / no answer | 0                 |

Max game score: **1000**. The live counter on screen shows what you'd earn if
you answered *right now*, and it ticks down green → amber → red as time passes.
All rules live in `src/lib/scoring.ts`.

---

## A note on audio & copyright

MelodIQ never ships or stores full copyrighted songs. The `Song.previewUrl`
field is designed for a **legal preview source**:

- the **iTunes Search API** (used by `fetch:previews`) returns licensed 30s
  preview clips, or
- a future integration (Spotify/Deezer preview endpoints, your own licensed
  catalog), or
- nothing at all — the game falls back to a silent timed round.

Swap in any provider by populating `previewUrl`; nothing else needs to change.

---

## Data models (Prisma)

- **User / Account / Session** — Auth.js tables (Google identities).
- **Song** — `title, artist, genre, year, coverColor, previewUrl`.
- **GameSession** — one game: `score, correctCount, totalRounds, mode, genre`,
  plus `finishedAt` (only finished games appear on the leaderboard / in stats).
  The public leaderboard is a ranked read over these rows.
- **Round** — per-song detail, pre-created at game start: the guess, `correct`,
  `points`, and the server timestamps `startedAt` / `answeredAt` that drive the
  authoritative `timeMs`.

---

## Security notes & known limitations

- **Scoring and timing are both server-authoritative.** `/api/game/round/start`
  records the start time on the server; `/api/game/round/answer` computes elapsed
  time from server clocks and looks up the real title to decide correctness and
  points. The browser never sees the answer ahead of time and can't claim its own
  timing. (Network latency on the start call can shave off a few ms in the
  player's favor — negligible for a casual game; sign the round if you need more.)
- A small typo budget is allowed in "type the title" mode (see `src/lib/match.ts`);
  tune or remove it to taste.
- Add rate limiting / abuse protection before a public launch.

---

## Deploying

1. Provision Postgres and set `DATABASE_URL`.
2. In `prisma/schema.prisma` change `provider = "sqlite"` → `"postgresql"`.
3. `npx prisma migrate deploy` (or `prisma db push`) and `npm run db:seed`.
4. Set all `.env` vars in your host (Vercel etc.), add the production Google
   redirect URI, and deploy. `npm run build` runs `prisma generate` first.
