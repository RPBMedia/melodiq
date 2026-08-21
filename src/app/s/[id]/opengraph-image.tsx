import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

// Node runtime so we can read the game from Postgres via Prisma.
export const runtime = "nodejs";
export const alt = "MelodIQ score card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0B0A1A";
const INK = "#F5F3FF";
const MUTED = "#A09CC4";
const CYAN = "#22D3EE";
const MAGENTA = "#FF2D87";
const VIOLET = "#8B5CF6";

export default async function Image({ params }: { params: { id: string } }) {
  const game = await prisma.gameSession.findUnique({
    where: { id: params.id },
    select: {
      score: true,
      correctCount: true,
      totalRounds: true,
      genre: true,
      dailyDate: true,
      finishedAt: true,
      user: { select: { name: true } },
    },
  });

  const finished = !!game?.finishedAt;
  const isDaily = !!game?.dailyDate;
  const score = game?.score ?? 0;
  const correct = game?.correctCount ?? 0;
  const total = game?.totalRounds ?? 10;
  const firstName = (game?.user?.name ?? "A player").split(" ")[0];
  const chip = isDaily ? "🔥 Daily Challenge" : game?.genre ?? "All genres";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "64px 72px",
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        {/* top: wordmark + context chip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
            🎧&nbsp;MelodIQ
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: INK,
              background: "rgba(139,92,246,0.22)",
              border: "1px solid rgba(139,92,246,0.5)",
              borderRadius: 999,
              padding: "10px 26px",
            }}
          >
            {chip}
          </div>
        </div>

        {/* center: the number */}
        {finished ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, color: MUTED }}>
              {firstName} scored
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div style={{ display: "flex", fontSize: 200, fontWeight: 800, color: CYAN, lineHeight: 1 }}>
                {score.toLocaleString()}
              </div>
              <div style={{ display: "flex", fontSize: 44, color: MUTED, paddingBottom: 26, paddingLeft: 18 }}>
                points
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 44, marginTop: 12 }}>
              {correct}/{total} correct
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, maxWidth: 900 }}>
            Hear a clip. Name the tune.
          </div>
        )}

        {/* bottom: accent bar + CTA */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              height: 10,
              width: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${MAGENTA}, ${VIOLET}, ${CYAN})`,
            }}
          />
          <div style={{ display: "flex", fontSize: 34, color: MUTED, marginTop: 22 }}>
            {finished ? "Can you beat this score?  ·  Play at melodiq" : "The faster you guess, the more you score."}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
