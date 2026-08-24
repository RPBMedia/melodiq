// Genre Journeys (PRD M4) — the map/progression backbone. A Journey is an
// ordered set of themed Stages; each stage is a 10-question game in one genre.
// Clear a stage (>=1 star) to unlock the next; 3 stars is mastery.
//
// The catalog is code-defined and version-controlled (like achievements). Only
// per-stage best-star results are persisted (UserStageProgress), keyed by stage id.

export type JourneyStage = {
  id: string; // stable, unique across all journeys
  title: string;
  /** Genre id passed to buildGame — matches a sub-genre in genres.ts. */
  genre: string;
};

export type Journey = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  accent: string;
  stages: JourneyStage[];
};

export const STAGE_QUESTIONS = 10;
export const MAX_STAGE_STARS = 3;

const VIOLET = "#8B5CF6";
const ROSE = "#FB7185";
const AMBER = "#FBBF24";

export const JOURNEYS: Journey[] = [
  {
    id: "rise-of-metal",
    title: "Rise of Metal",
    description: "From the New Wave to the abyss — trace metal through its heaviest eras.",
    emoji: "🔥",
    accent: VIOLET,
    stages: [
      { id: "metal-1", title: "Heavy Metal", genre: "heavy metal" },
      { id: "metal-2", title: "Speed & Power", genre: "power metal" },
      { id: "metal-3", title: "Progressive Metal", genre: "progressive metal" },
      { id: "metal-4", title: "Death Metal", genre: "death metal" },
      { id: "metal-5", title: "Black Metal", genre: "black metal" },
    ],
  },
  {
    id: "pop-to-rock",
    title: "Pop to Rock",
    description: "Start on the charts and climb your way up to the loud stuff.",
    emoji: "🎸",
    accent: ROSE,
    stages: [
      { id: "poprock-1", title: "Pop", genre: "pop" },
      { id: "poprock-2", title: "Indie", genre: "indie" },
      { id: "poprock-3", title: "Pop Rock", genre: "pop rock" },
      { id: "poprock-4", title: "Hard Rock", genre: "hard rock" },
      { id: "poprock-5", title: "Rock", genre: "rock" },
    ],
  },
  {
    id: "roots-and-soul",
    title: "Roots & Soul",
    description: "The lineage of groove — blues to jazz to soul to the streets.",
    emoji: "🎷",
    accent: AMBER,
    stages: [
      { id: "roots-1", title: "Blues", genre: "blues" },
      { id: "roots-2", title: "Jazz", genre: "jazz" },
      { id: "roots-3", title: "R&B / Soul", genre: "r&b" },
      { id: "roots-4", title: "Hip-Hop", genre: "hip hop" },
      { id: "roots-5", title: "Folk", genre: "folk" },
    ],
  },
];

/** Stars for a stage result: >=90% -> 3, >=70% -> 2, >=50% -> 1, else 0. */
export function starsForCorrect(correct: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

export function journeyById(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}

/** Locate a stage (and its journey + index) by stage id. */
export function stageById(
  stageId: string,
): { journey: Journey; stage: JourneyStage; index: number } | undefined {
  for (const journey of JOURNEYS) {
    const index = journey.stages.findIndex((s) => s.id === stageId);
    if (index >= 0) return { journey, stage: journey.stages[index], index };
  }
  return undefined;
}

export type StarsMap = Record<string, number>; // stageId -> best stars

/** Stage 0 is always open; later stages need >=1 star on the previous stage. */
export function stageUnlocked(journey: Journey, index: number, stars: StarsMap): boolean {
  if (index <= 0) return true;
  const prev = journey.stages[index - 1];
  return (stars[prev.id] ?? 0) >= 1;
}

export type JourneyProgress = {
  stagesCleared: number; // stages with >=1 star
  totalStars: number;
  maxStars: number;
  nextStageId: string | null; // first unlocked, not-yet-3-star stage
  complete: boolean; // all stages have >=1 star
};

export function journeyProgress(journey: Journey, stars: StarsMap): JourneyProgress {
  let stagesCleared = 0;
  let totalStars = 0;
  let nextStageId: string | null = null;
  journey.stages.forEach((stage, i) => {
    const s = stars[stage.id] ?? 0;
    totalStars += s;
    if (s >= 1) stagesCleared += 1;
    // "Next" is the first unlocked stage you haven't cleared yet (0 stars).
    if (nextStageId === null && stageUnlocked(journey, i, stars) && s < 1) {
      nextStageId = stage.id;
    }
  });
  return {
    stagesCleared,
    totalStars,
    maxStars: journey.stages.length * MAX_STAGE_STARS,
    nextStageId,
    complete: stagesCleared === journey.stages.length,
  };
}
