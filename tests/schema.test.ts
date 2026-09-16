import { describe, expect, it } from 'vitest';
import {
  CardStateSchema,
  ProgressSchema,
  QuestionFileSchema,
  QuestionSchema,
  SettingsSchema,
} from '@/lib/schema';
import type { Progress, Question } from '@/lib/types';
import validJson from './fixtures/valid.json';

const valid = validJson as unknown as Question[];
const [qcm, vf, flash, defi] = valid as [Question, Question, Question, Question];
const with_ = (q: Question, patch: Record<string, unknown>) => ({ ...structuredClone(q), ...patch });
const ok = (x: unknown) => QuestionSchema.safeParse(x).success;

describe('QuestionSchema', () => {
  it('accepte les trois types et un Défi, sans transformer les données', () => {
    for (const q of valid) expect(QuestionSchema.parse(q)).toEqual(q);
    expect(QuestionFileSchema.parse(valid)).toEqual(valid);
  });

  it('qcm : exactement 4 choix, exactement 1 correct', () => {
    if (qcm.type !== 'qcm') throw new Error('fixture');
    expect(ok(with_(qcm, { choices: qcm.choices.slice(0, 3) }))).toBe(false);
    expect(ok(with_(qcm, { choices: [...qcm.choices, { text: 'Cinq', correct: false }] }))).toBe(false);
    expect(ok(with_(qcm, { choices: qcm.choices.map((c) => ({ ...c, correct: true })) }))).toBe(false);
    expect(ok(with_(qcm, { choices: qcm.choices.map((c) => ({ ...c, correct: false })) }))).toBe(false);
    expect(ok(with_(qcm, { choices: qcm.choices.map((c, i) => ({ ...c, why: i === 0 ? '' : c.why })) }))).toBe(false);
  });

  it('vf : answer booléen, pas de choices', () => {
    expect(ok(with_(vf, { answer: true }))).toBe(true);
    expect(ok(with_(vf, { answer: 'vrai' }))).toBe(false);
    expect(ok(with_(vf, { choices: [] }))).toBe(false);
  });

  it('flash : answer + 1 à 3 keyPoints', () => {
    expect(ok(with_(flash, { keyPoints: ['a'] }))).toBe(true);
    expect(ok(with_(flash, { keyPoints: ['a', 'b', 'c'] }))).toBe(true);
    expect(ok(with_(flash, { keyPoints: [] }))).toBe(false);
    expect(ok(with_(flash, { keyPoints: ['a', 'b', 'c', 'd'] }))).toBe(false);
    expect(ok(with_(flash, { answer: '' }))).toBe(false);
  });

  it('prompt ≤ 280 caractères', () => {
    expect(ok(with_(vf, { prompt: 'x'.repeat(280) }))).toBe(true);
    expect(ok(with_(vf, { prompt: 'x'.repeat(281) }))).toBe(false);
    expect(ok(with_(vf, { prompt: '  ' }))).toBe(false);
  });

  it('difficulty ∈ {1, 2, 3}', () => {
    for (const d of [1, 2, 3]) expect(ok(with_(vf, { difficulty: d }))).toBe(true);
    for (const d of [0, 4, 1.5, '1']) expect(ok(with_(vf, { difficulty: d }))).toBe(false);
  });

  it('challenge ⇒ solution, et challenge vaut true ou est absent', () => {
    const { solution: _s, ...sansSolution } = structuredClone(defi);
    expect(ok(defi)).toBe(true);
    expect(ok(sansSolution)).toBe(false);
    expect(ok(with_(defi, { challenge: false }))).toBe(false);
    expect(ok(with_(vf, { solution: 'Étapes' }))).toBe(true);
  });

  it('id en minuscules, au moins deux segments séparés par des tirets', () => {
    for (const id of ['mat1600-diag-007', 'stt1700-desc-1', 'a-b']) expect(ok(with_(vf, { id }))).toBe(true);
    for (const id of ['mat1600', 'Mat1600-diag-007', 'mat1600--diag', 'mat1600-diag-', 'mat1600_diag-1', 'mat1600-dïag-1']) {
      expect(ok(with_(vf, { id })), id).toBe(false);
    }
  });

  it('refuse un cours inconnu (MAT1700 n\'existe pas), un type inconnu et une clé inconnue', () => {
    expect(ok(with_(vf, { course: 'MAT1700' }))).toBe(false);
    expect(ok(with_(vf, { type: 'multi' }))).toBe(false);
    expect(ok(with_(vf, { explication: 'x' }))).toBe(false);
  });
});

describe('ProgressSchema / SettingsSchema', () => {
  const progress: Progress = {
    v: 1,
    cards: { 'mat1600-syst-001': { box: 3, due: 1_790_000_000_000, n: 4, k: 3, wrongLast: false, at: 1_789_000_000_000 } },
    activeDays: ['2026-09-15', '2026-09-16'],
    settings: { courses: ['MAT1600', 'STT1700'], topics: ['mat1600-syst'], challenge: false, updatedAt: 1_789_000_000_000 },
    flagged: ['mat1600-syst-001'],
    syncCode: 'K7F2-9QXD-M3PA',
  };

  it('accepte une progression complète, avec ou sans syncCode', () => {
    expect(ProgressSchema.parse(progress)).toEqual(progress);
    const { syncCode: _c, ...sans } = progress;
    expect(ProgressSchema.safeParse(sans).success).toBe(true);
  });

  it('refuse une version inconnue, une box hors 1..5, un jour mal formé', () => {
    expect(ProgressSchema.safeParse({ ...progress, v: 2 }).success).toBe(false);
    const card = progress.cards['mat1600-syst-001']!;
    expect(CardStateSchema.safeParse({ ...card, box: 6 }).success).toBe(false);
    expect(CardStateSchema.safeParse({ ...card, box: 0 }).success).toBe(false);
    expect(CardStateSchema.safeParse({ ...card, n: -1 }).success).toBe(false);
    expect(ProgressSchema.safeParse({ ...progress, activeDays: ['16/09/2026'] }).success).toBe(false);
  });

  it('SettingsSchema refuse un cours inconnu', () => {
    expect(SettingsSchema.safeParse({ ...progress.settings, courses: ['MAT1700'] }).success).toBe(false);
  });
});
