// Propriété du lot Engine. Fusion de deux progressions (client et api/sync.ts) : pure, sans DOM.
// Commutative, associative et idempotente : merge(a, b) et merge(b, a) donnent le même état, égalités comprises.
import type { CardState, Progress, Settings } from './types';

const cardKey = (c: CardState) => [c.at, c.n, c.k, c.due, c.box, c.wrongLast ? 1 : 0];

function compareTuples(x: readonly (number | string)[], y: readonly (number | string)[]): number {
  for (let i = 0; i < x.length; i++) {
    const a = x[i]!;
    const b = y[i]!;
    if (a !== b) return a < b ? -1 : 1;
  }
  return 0;
}

/** La réponse la plus récente (`at`) gagne ; à égalité, un ordre total fixe tranche. */
function pickCard(a: CardState, b: CardState): CardState {
  const c = compareTuples(cardKey(a), cardKey(b)) >= 0 ? a : b;
  return { box: c.box, due: c.due, n: c.n, k: c.k, wrongLast: c.wrongLast, at: c.at };
}

/** Les réglages au `updatedAt` le plus récent gagnent ; à égalité, un ordre total fixe tranche. */
function pickSettings(a: Settings, b: Settings): Settings {
  const key = (s: Settings) => [s.updatedAt, JSON.stringify([s.courses, s.topics, s.challenge])];
  const s = compareTuples(key(a), key(b)) >= 0 ? a : b;
  return { courses: [...s.courses], topics: [...s.topics], challenge: s.challenge, updatedAt: s.updatedAt };
}

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])].sort();

/** Code de synchro conservé s'il est présent d'un seul côté ; s'ils diffèrent (cas anormal), le plus petit, pour rester commutatif. */
function pickCode(a?: string, b?: string): string | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return a <= b ? a : b;
}

export function merge(a: Progress, b: Progress): Progress {
  const cards: Record<string, CardState> = {};
  for (const id of union(Object.keys(a.cards), Object.keys(b.cards))) {
    const x = a.cards[id] ?? b.cards[id]!;
    const y = b.cards[id] ?? x;
    cards[id] = pickCard(x, y);
  }
  const out: Progress = {
    v: 1,
    cards,
    activeDays: union(a.activeDays, b.activeDays),
    settings: pickSettings(a.settings, b.settings),
    flagged: union(a.flagged, b.flagged),
  };
  const syncCode = pickCode(a.syncCode, b.syncCode);
  if (syncCode !== undefined) out.syncCode = syncCode;
  return out;
}
