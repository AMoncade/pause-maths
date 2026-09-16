// État d'une partie (mémoire seulement) — logique pure, testée dans tests/ui/ui-game.test.ts.
import type { CourseCode, GameSession, Mode, Progress, Question, Rng } from './types';

export const RAFALE_LENGTH = 5;

/** Réponse donnée : index d'origine du choix (qcm), booléen (vf), « je savais » (flash). */
export type Answer = number | boolean;

export interface RoundResult {
  id: string;
  course: CourseCode;
  ok: boolean;
  flash: boolean;
}

export interface Round {
  mode: Mode;
  session: GameSession;
  question: Question | null;
  /** ordre d'affichage des choix qcm (indices dans question.choices) ; vide sinon */
  order: number[];
  picked: Answer | null;
  ok: boolean | null;
  revealed: boolean;
  combo: number;
  maxCombo: number;
  results: RoundResult[];
}

export function newRound(mode: Mode): Round {
  return {
    mode,
    session: { shown: [] },
    question: null,
    order: [],
    picked: null,
    ok: null,
    revealed: false,
    combo: 0,
    maxCombo: 0,
    results: [],
  };
}

/** Permutation de 0..n-1 (Fisher–Yates). */
export function shuffledOrder(n: number, rng: Rng): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Affiche une question. Contrat avec le scheduler : `session` est UN objet mutable détenu par l'UI,
 * jamais recréé ; on y pousse chaque id montré (nextQuestion peut le tronquer en place en sansFin).
 */
export function withQuestion(round: Round, q: Question, rng: Rng): Round {
  const { session } = round;
  session.shown.push(q.id);
  session.lastCourse = q.course;
  session.lastTopic = q.topic;
  return {
    ...round,
    question: q,
    order: q.type === 'qcm' ? shuffledOrder(q.choices.length, rng) : [],
    picked: null,
    ok: null,
    revealed: false,
  };
}

export function isCorrect(q: Question, pick: Answer): boolean {
  switch (q.type) {
    case 'qcm':
      return typeof pick === 'number' && q.choices[pick]?.correct === true;
    case 'vf':
      return pick === q.answer;
    case 'flash':
      return pick === true;
  }
}

export function reveal(round: Round): Round {
  if (round.question?.type !== 'flash' || round.revealed) return round;
  return { ...round, revealed: true };
}

/** Enregistre la réponse. Sans effet si déjà répondu, ou si la carte flash n'est pas révélée. */
export function answer(round: Round, pick: Answer): Round {
  const q = round.question;
  if (!q || round.ok !== null) return round;
  if (q.type === 'flash' && !round.revealed) return round;
  const ok = isCorrect(q, pick);
  const flash = q.type === 'flash';
  const combo = flash ? round.combo : ok ? round.combo + 1 : 0;
  return {
    ...round,
    picked: pick,
    ok,
    combo,
    maxCombo: Math.max(round.maxCombo, combo),
    results: [...round.results, { id: q.id, course: q.course, ok, flash }],
  };
}

export function isAnswered(round: Round): boolean {
  return round.ok !== null;
}

export function roundOver(round: Round): boolean {
  return round.mode === 'rafale' && round.results.length >= RAFALE_LENGTH;
}

export function score(round: Round): { correct: number; total: number } {
  return { correct: round.results.filter((r) => r.ok).length, total: round.results.length };
}

export function isPerfect(round: Round): boolean {
  return roundOver(round) && round.results.every((r) => r.ok);
}

/** 0 : pas de flamme ; 1 : 2–4 ; 2 : 5–9 ; 3 : 10 et plus. */
export function comboTier(combo: number): 0 | 1 | 2 | 3 {
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  if (combo >= 2) return 1;
  return 0;
}

/** Ids ratés pendant la manche, sans doublon, dans l'ordre. */
export function missedIds(round: Round): string[] {
  return [...new Set(round.results.filter((r) => !r.ok).map((r) => r.id))];
}

/** Questions jouables avec les réglages actuels (même filtre que le pool du scheduler). */
export function playable(bank: Question[], p: Progress): Question[] {
  const { courses, topics, challenge } = p.settings;
  return bank.filter(
    (q) => courses.includes(q.course) && topics.includes(q.topic) && (challenge || !q.challenge),
  );
}

/** Nombre de questions « À revoir » (dernière réponse fausse) dans la sélection. */
export function reviewCount(bank: Question[], p: Progress): number {
  return playable(bank, p).filter((q) => p.cards[q.id]?.wrongLast === true).length;
}

/** Choix du titre de feedback, stable pour une question donnée. */
export function pickLine(lines: readonly string[], seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return lines[h % lines.length]!;
}
