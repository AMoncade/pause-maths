// STUBS TEMPORAIRES du lot UI — à supprimer dès que lot/engine et lot/pwa sont fusionnés.
// Mêmes signatures que progress.ts, scheduler.ts, sync.ts et pwa.ts (brief de la régie) ;
// logique volontairement minimale, juste de quoi faire tourner l'interface.
import type {
  CardState,
  Course,
  CourseCode,
  GameSession,
  Mode,
  Progress,
  Question,
  Rng,
} from './types';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

// ---------- progress.ts ----------

export const STORAGE_KEY = 'pause-maths:progress';

export function emptyProgress(now: number, courses: Course[]): Progress {
  return {
    v: 1,
    cards: {},
    activeDays: [],
    settings: {
      courses: courses.map((c) => c.code),
      topics: courses.flatMap((c) => c.topics.filter((t) => t.defaultOn).map((t) => t.id)),
      challenge: false,
      updatedAt: now,
    },
    flagged: [],
  };
}

export function loadProgress(
  storage: StorageLike,
  now: number,
  courses: Course[],
): { progress: Progress; recovered: boolean; backupKey?: string } {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return { progress: emptyProgress(now, courses), recovered: false };
  try {
    const p = JSON.parse(raw) as Progress;
    if (p && p.v === 1 && p.settings && p.cards) return { progress: p, recovered: false };
    throw new Error('forme inconnue');
  } catch {
    const backupKey = `pause-maths:backup-${now}`;
    try {
      storage.setItem(backupKey, raw);
    } catch {
      /* ignore */
    }
    return { progress: emptyProgress(now, courses), recovered: true, backupKey };
  }
}

export function saveProgress(storage: StorageLike, p: Progress): { ok: boolean } {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(p));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function dayOf(now: number): string {
  const d = new Date(now);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function markActive(p: Progress, now: number): Progress {
  const day = dayOf(now);
  if (p.activeDays.includes(day)) return p;
  return { ...p, activeDays: [...p.activeDays, day] };
}

export function streak(p: Progress, now: number): number {
  const days = new Set(p.activeDays);
  let n = 0;
  let t = now;
  if (!days.has(dayOf(t))) t -= 86_400_000;
  while (days.has(dayOf(t))) {
    n += 1;
    t -= 86_400_000;
  }
  return n;
}

export function xp(p: Progress, bank: Question[], course?: CourseCode): number {
  let total = 0;
  for (const q of bank) {
    if (course && q.course !== course) continue;
    const c = p.cards[q.id];
    if (c) total += c.k * 10 * q.difficulty;
  }
  return total;
}

export function levelProgress(x: number): { level: number; into: number; span: number } {
  let level = 1;
  let floor = 0;
  let span = 100;
  while (x >= floor + span) {
    floor += span;
    level += 1;
    span = 100 + (level - 1) * 50;
  }
  return { level, into: x - floor, span };
}

export function level(x: number): number {
  return levelProgress(x).level;
}

export function mastery(p: Progress, bank: Question[], topicId: string): number {
  const qs = bank.filter((q) => q.topic === topicId);
  if (qs.length === 0) return 0;
  const sum = qs.reduce((s, q) => s + ((p.cards[q.id]?.box ?? 0) >= 3 ? 1 : 0), 0);
  return sum / qs.length;
}

export function toggleFlag(p: Progress, id: string): Progress {
  const flagged = p.flagged.includes(id) ? p.flagged.filter((f) => f !== id) : [...p.flagged, id];
  return { ...p, flagged };
}

// ---------- scheduler.ts ----------

const INTERVAL: Record<number, number> = {
  1: 10 * 60_000,
  2: 86_400_000,
  3: 3 * 86_400_000,
  4: 7 * 86_400_000,
  5: 16 * 86_400_000,
};

export function applyAnswer(p: Progress, id: string, ok: boolean, now: number): Progress {
  const prev = p.cards[id];
  const box = (ok ? Math.min((prev?.box ?? 0) + 1, 5) : 1) as CardState['box'];
  const card: CardState = {
    box,
    due: now + INTERVAL[box]!,
    n: (prev?.n ?? 0) + 1,
    k: (prev?.k ?? 0) + (ok ? 1 : 0),
    wrongLast: !ok,
    at: now,
  };
  return { ...p, cards: { ...p.cards, [id]: card } };
}

export function nextQuestion(
  bank: Question[],
  p: Progress,
  session: GameSession,
  mode: Mode,
  _now: number,
  rng: Rng,
): Question | null {
  const base = bank.filter(
    (q) =>
      p.settings.courses.includes(q.course) &&
      p.settings.topics.includes(q.topic) &&
      (!q.challenge || p.settings.challenge) &&
      (mode !== 'aRevoir' || p.cards[q.id]?.wrongLast === true),
  );
  let pool = base.filter((q) => !session.shown.includes(q.id));
  if (pool.length === 0 && mode === 'sansFin' && base.length > 0) {
    session.shown.splice(0, Math.max(0, session.shown.length - 10));
    pool = base.filter((q) => !session.shown.includes(q.id));
    if (pool.length === 0) pool = base;
  }
  if (pool.length === 0) return null;
  const other = pool.filter((q) => q.course !== session.lastCourse);
  const from = other.length > 0 ? other : pool;
  return from[Math.floor(rng() * from.length)] ?? null;
}

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

// ---------- sync.ts ----------

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateSyncCode(): string {
  let s = '';
  for (let i = 0; i < 12; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

export function formatSyncCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}

export function normalizeSyncCode(input: string): string | null {
  const s = input.toUpperCase().replace(/[\s-]/g, '');
  if (s.length !== 12) return null;
  for (const ch of s) if (!ALPHABET.includes(ch)) return null;
  return s;
}

export async function syncNow(
  p: Progress,
): Promise<{ ok: true; progress: Progress } | { ok: false; error: string }> {
  await new Promise((r) => setTimeout(r, 400));
  if (!p.syncCode) return { ok: false, error: 'Aucun code de synchro.' };
  return { ok: false, error: 'Le serveur de synchro n’est pas encore branché.' };
}

export async function checkSyncCode(
  _code: string,
): Promise<{ ok: true; exists: boolean } | { ok: false; error: string }> {
  return { ok: false, error: 'Le serveur de synchro n’est pas encore branché.' };
}

// ---------- pwa.ts ----------

export function initPwa(): void {}

export function onUpdateReady(_cb: () => void): void {}

export function applyUpdate(): void {}
