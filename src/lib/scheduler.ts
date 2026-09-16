// Propriété du lot Engine. Répétition espacée (boîtes de Leitner) et choix de la prochaine question.
// Pur : `now` et `rng` sont injectés. Seule exception documentée : le redémarrage Sans fin tronque session.shown.
import { isTopicOn, markActive } from './progress';
import type { Box, CardState, Course, GameSession, Mode, Progress, Question, Rng } from './types';

const MIN = 60_000;
const DAY = 86_400_000;

export const INTERVAL_MS: Record<Box, number> = { 1: 10 * MIN, 2: DAY, 3: 3 * DAY, 4: 7 * DAY, 5: 16 * DAY };

/** Nombre d'ids gardés dans session.shown quand Sans fin a tout montré. */
export const SANS_FIN_KEEP = 10;

/** Générateur mulberry32 seedé, valeurs dans [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Enregistre une réponse. Bonne : box + 1 (max 5) ; mauvaise : box 1. Une carte jamais vue part de la box 1.
 * due = now + INTERVAL_MS[box] ; n + 1 ; k + 1 si bonne ; wrongLast = !ok ; at = now ; le jour devient actif.
 */
export function applyAnswer(p: Progress, id: string, ok: boolean, now: number): Progress {
  const prev = p.cards[id];
  const box: Box = ok ? (Math.min((prev?.box ?? 1) + 1, 5) as Box) : 1;
  const next: CardState = {
    box,
    due: now + INTERVAL_MS[box],
    n: (prev?.n ?? 0) + 1,
    k: (prev?.k ?? 0) + (ok ? 1 : 0),
    wrongLast: !ok,
    at: now,
  };
  return markActive({ ...p, cards: { ...p.cards, [id]: next } }, now);
}

/** Paliers : A dues en box 1 · B jamais vues · C dues en box ≥ 2 · D pas encore dues. */
function tierOf(card: CardState | undefined, now: number): 0 | 1 | 2 | 3 {
  if (!card) return 1;
  if (card.due <= now) return card.box === 1 ? 0 : 2;
  return 3;
}

/** Part des cartes vues (dans la banque) dont la dernière réponse était fausse ; 0 si aucune vue. */
function weakness(bank: Question[], p: Progress, belongs: (q: Question) => boolean): number {
  let seen = 0;
  let wrong = 0;
  for (const q of bank) {
    const card = p.cards[q.id];
    if (!card || !belongs(q)) continue;
    seen++;
    if (card.wrongLast) wrong++;
  }
  return seen === 0 ? 0 : wrong / seen;
}

function weightedPick<T>(items: T[], weights: number[], rng: Rng): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!;
    if (r < 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

function fisherYates<T>(items: T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Choix pondéré par w = 1 + 2·weak, en évitant `last` s'il existe une autre option. Options triées pour le déterminisme. */
function pickGroup(options: string[], last: string | undefined, weak: (x: string) => number, rng: Rng): string {
  const sorted = [...options].sort();
  const pool = last !== undefined && sorted.length > 1 ? sorted.filter((x) => x !== last) : sorted;
  return weightedPick(pool, pool.map((x) => 1 + 2 * weak(x)), rng);
}

/** Questions permises par les réglages et le mode, sans tenir compte de session.shown. Thème absent de `courses` = décoché. */
function selection(bank: Question[], p: Progress, mode: Mode, courses: Course[]): Question[] {
  const selectedCourses = new Set(p.settings.courses);
  const onTopics = new Set(courses.flatMap((c) => c.topics.filter((t) => isTopicOn(p.settings, t)).map((t) => t.id)));
  return bank.filter(
    (q) =>
      selectedCourses.has(q.course) &&
      onTopics.has(q.topic) &&
      (q.challenge !== true || p.settings.challenge) &&
      (mode !== 'aRevoir' || p.cards[q.id]?.wrongLast === true),
  );
}

function pick(
  eligible: Question[],
  bank: Question[],
  p: Progress,
  session: GameSession,
  mode: Mode,
  now: number,
  rng: Rng,
): Question | null {
  const shown = new Set(session.shown);
  const pool = eligible.filter((q) => !shown.has(q.id));
  if (pool.length === 0) return null;

  let tier = pool;
  if (mode !== 'aRevoir') {
    const tiers: Question[][] = [[], [], [], []];
    for (const q of pool) tiers[tierOf(p.cards[q.id], now)]!.push(q);
    tier = tiers.find((t) => t.length > 0)!;
  }

  const course = pickGroup(
    [...new Set(tier.map((q) => q.course))],
    session.lastCourse,
    (c) => weakness(bank, p, (q) => q.course === c),
    rng,
  );
  const inCourse = tier.filter((q) => q.course === course);
  const topic = pickGroup(
    [...new Set(inCourse.map((q) => q.topic))],
    session.lastTopic,
    (t) => weakness(bank, p, (q) => q.topic === t),
    rng,
  );
  const candidates = fisherYates(
    inCourse.filter((q) => q.topic === topic),
    rng,
  );
  const key = (q: Question) => {
    const card = p.cards[q.id];
    return [card?.box ?? 0, card?.due ?? 0, q.difficulty] as const;
  };
  // Array.prototype.sort est stable : à clé égale, l'ordre mélangé départage.
  candidates.sort((x, y) => {
    const a = key(x);
    const b = key(y);
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  });
  return candidates[0] ?? null;
}

/**
 * Prochaine question, ou null s'il n'y en a plus.
 *
 * Sélection = cours cochés dans p.settings, thèmes cochés selon isTopicOn (choix explicite, sinon defaultOn ;
 * un thème absent de `courses` est décoché), questions Défi seulement si le Défi est activé,
 * moins session.shown. Mode aRevoir : seulement les cartes dont la dernière réponse était fausse, en un seul palier.
 * Sinon, premier palier non vide : A (dues, box 1) → B (jamais vues) → C (dues, box ≥ 2) → D (pas dues).
 * Cours puis thème tirés au sort avec w = 1 + 2·weak, en évitant session.lastCourse / lastTopic s'il y a une autre option ;
 * puis mélange et tri stable (box, due, difficulté).
 *
 * `session` appartient à l'appelant, qui y pousse chaque id montré et met à jour lastCourse / lastTopic.
 * MUTATION VOULUE, seulement en mode sansFin quand tout a été montré : session.shown est tronqué EN PLACE
 * pour ne garder que les SANS_FIN_KEEP derniers ids (moins si la sélection est plus petite : il en reste
 * toujours au moins un à montrer), puis le choix est refait. Aucune autre entrée n'est modifiée.
 */
export function nextQuestion(
  bank: Question[],
  p: Progress,
  session: GameSession,
  mode: Mode,
  now: number,
  rng: Rng,
  courses: Course[],
): Question | null {
  const eligible = selection(bank, p, mode, courses);
  const q = pick(eligible, bank, p, session, mode, now, rng);
  if (q !== null || mode !== 'sansFin' || eligible.length === 0) return q;

  const keep = Math.min(SANS_FIN_KEEP, eligible.length - 1);
  session.shown.splice(0, Math.max(0, session.shown.length - keep));
  return pick(eligible, bank, p, session, mode, now, rng);
}
