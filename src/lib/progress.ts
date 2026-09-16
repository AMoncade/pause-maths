// Propriété du lot Engine. Progression locale : chargement sûr, sauvegarde, données dérivées.
// Fonctions pures : `now` (epoch ms) est toujours passé en paramètre.
import { ProgressSchema } from './schema';
import type { Course, CourseCode, Progress, Question, Settings, Topic } from './types';

export const STORAGE_KEY = 'pause-maths:progress';
export const BACKUP_PREFIX = 'pause-maths:backup-';
export const CURRENT_VERSION = 1;

/** `migrations[v]` transforme un état de version v en version v + 1. Aucune tant que v = 1. */
export type Migration = (state: Record<string, unknown>) => Record<string, unknown>;
export const migrations: Record<number, Migration> = {};

export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>>;

export interface LoadResult {
  progress: Progress;
  /** true si des données existaient mais étaient illisibles : l'état est neuf. */
  recovered: boolean;
  /** clé de la copie brute, absente si la copie a elle-même échoué */
  backupKey?: string;
}

const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** État neuf : tous les cours, aucun choix de thème explicite (chacun suit son defaultOn), Défi désactivé. */
export function emptyProgress(now: number, courses: Course[]): Progress {
  return {
    v: 1,
    cards: {},
    activeDays: [],
    settings: {
      courses: courses.map((c) => c.code),
      topicOverrides: {},
      challenge: false,
      updatedAt: now,
    },
    flagged: [],
  };
}

/** Thème coché : choix explicite de l'utilisateur, sinon Topic.defaultOn (un thème passé à defaultOn plus tard devient coché). */
export function isTopicOn(settings: Settings, topic: Topic): boolean {
  return settings.topicOverrides[topic.id] ?? topic.defaultOn;
}

/** Enregistre le choix explicite de cocher ou décocher un thème ; settings.updatedAt = now. */
export function setTopic(p: Progress, topicId: string, on: boolean, now: number): Progress {
  return {
    ...p,
    settings: { ...p.settings, topicOverrides: { ...p.settings.topicOverrides, [topicId]: on }, updatedAt: now },
  };
}

/**
 * Remise à zéro : cartes et jours actifs effacés, resetAt = now. Réglages, signalements et code de synchro conservés.
 * merge écarte ensuite toute carte antérieure à resetAt, pour que la synchro ne ramène pas l'ancienne progression.
 */
export function resetProgress(p: Progress, now: number): Progress {
  const out: Progress = {
    v: 1,
    cards: {},
    activeDays: [],
    settings: p.settings,
    flagged: p.flagged,
    resetAt: now,
  };
  if (p.syncCode !== undefined) out.syncCode = p.syncCode;
  return out;
}

/**
 * Applique les migrations pas à pas jusqu'à `target`. Retourne undefined si la donnée n'a pas de version entière,
 * si la version est inconnue (plus récente que l'app ou sans migration) ou si une migration échoue.
 */
export function migrate(
  data: unknown,
  steps: Record<number, Migration> = migrations,
  target: number = CURRENT_VERSION,
): Record<string, unknown> | undefined {
  if (!isRecord(data) || typeof data.v !== 'number' || !Number.isInteger(data.v)) return undefined;
  if (data.v < 1 || data.v > target) return undefined;
  let state = data;
  try {
    for (let v = data.v; v < target; v++) {
      const step = steps[v];
      if (!step) return undefined;
      state = step(state);
    }
  } catch {
    return undefined;
  }
  return state;
}

/**
 * JSON.parse → migrations → Zod. Tout échec : copie brute dans `pause-maths:backup-<now>`, puis état neuf.
 * L'original n'est retiré qu'une fois la copie écrite, pour ne jamais perdre de données en silence.
 */
export function loadProgress(storage: ProgressStorage, now: number, courses: Course[]): LoadResult {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { progress: emptyProgress(now, courses), recovered: true };
  }
  if (raw === null) return { progress: emptyProgress(now, courses), recovered: false };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    data = undefined;
  }
  const migrated = migrate(data);
  const parsed = migrated === undefined ? undefined : ProgressSchema.safeParse(migrated);
  if (parsed?.success) return { progress: parsed.data, recovered: false };

  const backupKey = backup(storage, raw, now);
  return backupKey === undefined
    ? { progress: emptyProgress(now, courses), recovered: true }
    : { progress: emptyProgress(now, courses), recovered: true, backupKey };
}

function backup(storage: ProgressStorage, raw: string, now: number): string | undefined {
  try {
    let key = `${BACKUP_PREFIX}${now}`;
    for (let i = 1; storage.getItem(key) !== null; i++) key = `${BACKUP_PREFIX}${now}-${i}`;
    storage.setItem(key, raw);
    try {
      storage.removeItem?.(STORAGE_KEY);
    } catch {
      // la copie existe : l'original sera remplacé à la prochaine sauvegarde
    }
    return key;
  } catch {
    return undefined;
  }
}

/** Écrit tout l'état. En cas d'échec (quota, mode privé), l'appelant garde l'état en mémoire et affiche un bandeau. */
export function saveProgress(storage: Pick<Storage, 'setItem'>, p: Progress): { ok: boolean } {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(p));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Jour local "YYYY-MM-DD". */
export function dayKey(now: number): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Ajoute le jour de `now` aux jours actifs (triés). Retourne `p` inchangé s'il y est déjà. */
export function markActive(p: Progress, now: number): Progress {
  const key = dayKey(now);
  if (p.activeDays.includes(key)) return p;
  return { ...p, activeDays: [...p.activeDays, key].sort() };
}

/** Jours actifs consécutifs se terminant aujourd'hui, ou hier si aujourd'hui n'est pas encore joué. */
export function streak(p: Progress, now: number): number {
  const days = new Set(p.activeDays);
  const today = new Date(now);
  // midi local : reculer d'un jour avec setDate reste juste aux changements d'heure
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** XP dérivée : 10 par bonne réponse + 5 par box au-dessus de 1. Les cartes absentes de la banque sont ignorées. */
export function xp(p: Progress, bank: Question[], course?: CourseCode): number {
  let total = 0;
  for (const q of bank) {
    if (course !== undefined && q.course !== course) continue;
    const card = p.cards[q.id];
    if (card) total += 10 * card.k + 5 * (card.box - 1);
  }
  return total;
}

/** Seuil d'XP du début d'un niveau : 0, 100, 400, 900… */
const threshold = (lvl: number) => 100 * (lvl - 1) ** 2;

/** Niveau = floor(sqrt(xp / 100)) + 1, calculé sans erreur d'arrondi aux seuils. */
export function level(xpTotal: number): number {
  const x = Math.max(0, xpTotal);
  let lvl = Math.floor(Math.sqrt(x / 100)) + 1;
  while (threshold(lvl + 1) <= x) lvl++;
  while (lvl > 1 && threshold(lvl) > x) lvl--;
  return lvl;
}

/** Barre de niveau : `into` = XP depuis le seuil du niveau courant, `span` = XP entre ce seuil et le suivant. */
export function levelProgress(xpTotal: number): { level: number; into: number; span: number } {
  const lvl = level(xpTotal);
  return { level: lvl, into: Math.max(0, xpTotal) - threshold(lvl), span: threshold(lvl + 1) - threshold(lvl) };
}

/** Part des questions du thème (dans la banque) dont la carte est en box ≥ 3. 0 si le thème est vide. */
export function mastery(p: Progress, bank: Question[], topicId: string): number {
  const questions = bank.filter((q) => q.topic === topicId);
  if (questions.length === 0) return 0;
  const mastered = questions.filter((q) => (p.cards[q.id]?.box ?? 0) >= 3).length;
  return mastered / questions.length;
}

/** Signale ou retire le signalement d'une question (liste triée). */
export function toggleFlag(p: Progress, id: string): Progress {
  const flagged = p.flagged.includes(id) ? p.flagged.filter((f) => f !== id) : [...p.flagged, id].sort();
  return { ...p, flagged };
}
