# CLAUDE.md — MelodIQ

Music guessing game. Next.js 14 (App Router) + TypeScript + Tailwind + Framer
Motion, Prisma → Postgres, NextAuth v5 (Google). Roadmap and product spec live in
`MELODIQ_PRD.md` (milestones M1–M7; currently building **M3 — Progression &
Habit**).

## Testing & verification workflow (IMPORTANT — save tokens)

- **Do NOT run tests (or typecheck / lint / build) after each edit during a
  build.** Write test files alongside the code as normal, but leave them
  unrun while iterating.
- **Run the full verification suite ONCE, when a milestone/feature is
  complete** — not incrementally. That single pass is:
  ```bash
  npm test            # node --test on src/lib/*.test.ts (pure units)
  npx tsc --noEmit    # typecheck
  npm run lint        # next lint
  npm run build        # prisma generate + next build
  ```
- Fix whatever that pass surfaces, re-run once, then commit. This trades a
  little end-of-milestone rework for far fewer mid-build tool calls.

## Architecture notes

- **Server-authoritative** for anything scored or timed. Round timing comes from
  server clocks (`Round.startedAt/answeredAt`), never the client. XP is awarded
  only in `/api/game/finish`, and only on a game's first finish (idempotent).
- **Scoring** (`src/lib/scoring.ts`) and **progression** (`src/lib/progression.ts`,
  XP/levels/DJ-ranks/daily-streak/seeded-RNG) are pure and IO-free — shared by
  client display and server logic, and the critical units to test.
- **Daily Challenge** is deterministic: `buildGame(..., seed)` uses the seeded
  PRNG in `progression.ts` so everyone gets the identical clip set + option order
  for a given UTC date. Dailies are normal `GameSession`s flagged with
  `dailyDate`; they reuse the round/answer/finish endpoints.
- **Audio:** stream provider preview URLs (iTunes stable; Deezer ephemeral →
  re-resolved at serve time in `buildGame`). Never rehost licensed audio.
- **Schema changes:** edit `prisma/schema.prisma`, then `npm run db:push`
  (additive changes are safe) and `npx prisma generate` for client types.

## Definition of done (per `MELODIQ_PRD.md` §14)

Implementation + loading/error/empty states + TypeScript + lint + tests +
mobile-first + a11y basics (keyboard, reduced-motion, non-color signals) + audio
verified on iOS Safari & Android Chrome. No placeholder logic shipped as real
behaviour.
