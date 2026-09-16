// Aides de test partagées (pas un fichier de test).
import type { CardState, CourseCode, Difficulty, Progress, Question } from '@/lib/types';

/** Question vf minimale ; le thème et le cours sont déduits de l'id "<cours>-<thème>-<nnn>". */
export function makeQuestion(id: string, opts: { difficulty?: Difficulty; challenge?: boolean } = {}): Question {
  const [course, topic] = id.split('-') as [string, string];
  return {
    id,
    course: course.toUpperCase() as CourseCode,
    topic: `${course}-${topic}`,
    difficulty: opts.difficulty ?? 1,
    type: 'vf',
    prompt: `Question ${id}`,
    explanation: 'Explication.',
    answer: true,
    ...(opts.challenge ? { challenge: true as const, solution: 'Solution.' } : {}),
  };
}

export function card(partial: Partial<CardState> = {}): CardState {
  return { box: 1, due: 0, n: 1, k: 0, wrongLast: false, at: 0, ...partial };
}

export function progressWith(partial: Partial<Progress> = {}): Progress {
  return {
    v: 1,
    cards: {},
    activeDays: [],
    settings: { courses: ['MAT1400', 'MAT1500', 'MAT1600', 'STT1700'], topics: [], challenge: false, updatedAt: 0 },
    flagged: [],
    ...partial,
  };
}

/** Gèle récursivement : toute mutation d'une entrée « pure » lève en mode strict. */
export function deepFreeze<T>(x: T): T {
  if (typeof x === 'object' && x !== null && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const v of Object.values(x)) deepFreeze(v);
  }
  return x;
}

/** localStorage en mémoire, avec pannes simulables. */
export class MemoryStorage {
  readonly data = new Map<string, string>();
  failGet = false;
  failSet = false;

  getItem(key: string): string | null {
    if (this.failGet) throw new Error('SecurityError');
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.failSet) throw new Error('QuotaExceededError');
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

/** Heure locale (TZ fixé à America/Toronto par vitest.config.ts). Mois 1..12. */
export const local = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min).getTime();

export const MIN = 60_000;
export const DAY = 86_400_000;
