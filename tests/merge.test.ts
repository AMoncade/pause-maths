import { describe, expect, it } from 'vitest';
import { merge } from '@/lib/merge';
import { resetProgress } from '@/lib/progress';
import { ProgressSchema } from '@/lib/schema';
import type { Progress } from '@/lib/types';
import { card, deepFreeze, progressWith } from './helpers';

const phone = deepFreeze(
  progressWith({
    cards: {
      shared: card({ box: 3, n: 4, k: 3, at: 2_000, due: 9_000 }),
      phoneOnly: card({ box: 2, n: 1, k: 1, at: 1_500 }),
    },
    activeDays: ['2026-09-14', '2026-09-16'],
    settings: { courses: ['MAT1600'], topicOverrides: { 'mat1600-syst': true, 'mat1600-det': false }, challenge: true, updatedAt: 500 },
    flagged: ['q2'],
    syncCode: 'K7F2-9QXD-M3PA',
  }),
);

const laptop = deepFreeze(
  progressWith({
    cards: {
      shared: card({ box: 1, n: 5, k: 3, at: 3_000, due: 3_600, wrongLast: true }),
      laptopOnly: card({ box: 4, n: 3, k: 3, at: 1_000 }),
    },
    activeDays: ['2026-09-15', '2026-09-16'],
    settings: { courses: ['MAT1400', 'STT1700'], topicOverrides: { 'stt1700-desc': true }, challenge: false, updatedAt: 800 },
    flagged: ['q1', 'q2'],
  }),
);

const both = (a: Progress, b: Progress) => {
  const ab = merge(a, b);
  expect(merge(b, a)).toEqual(ab);
  return ab;
};

describe('merge', () => {
  it('par carte, la réponse la plus récente gagne ; les cartes d\'un seul côté sont gardées', () => {
    const m = both(phone, laptop);
    expect(m.cards).toEqual({
      shared: laptop.cards.shared,
      phoneOnly: phone.cards.phoneOnly,
      laptopOnly: laptop.cards.laptopOnly,
    });
  });

  it('activeDays et flagged : union triée', () => {
    const m = both(phone, laptop);
    expect(m.activeDays).toEqual(['2026-09-14', '2026-09-15', '2026-09-16']);
    expect(m.flagged).toEqual(['q1', 'q2']);
  });

  it('settings : celui au updatedAt le plus récent, en entier', () => {
    expect(both(phone, laptop).settings).toEqual(laptop.settings);
    const newerPhone = { ...phone, settings: { ...phone.settings, updatedAt: 900 } };
    expect(both(newerPhone, laptop).settings).toEqual(newerPhone.settings);
  });

  it('syncCode conservé s\'il est présent d\'un seul côté, absent s\'il n\'est nulle part', () => {
    expect(both(phone, laptop).syncCode).toBe('K7F2-9QXD-M3PA');
    const { syncCode: _c, ...noCode } = phone;
    const m = both(noCode, laptop);
    expect('syncCode' in m).toBe(false);
  });

  it('commutatif aussi aux égalités (même at, même updatedAt, codes différents)', () => {
    const a = progressWith({
      cards: { x: card({ at: 5, n: 2, k: 1, box: 2 }) },
      settings: { courses: ['MAT1600'], topicOverrides: {}, challenge: false, updatedAt: 7 },
      syncCode: 'BBBB-BBBB-BBBB',
    });
    const b = progressWith({
      cards: { x: card({ at: 5, n: 3, k: 1, box: 1, wrongLast: true }) },
      settings: { courses: ['STT1700'], topicOverrides: {}, challenge: true, updatedAt: 7 },
      syncCode: 'AAAA-AAAA-AAAA',
    });
    const m = both(a, b);
    expect(m.cards.x).toEqual(b.cards.x);
    expect(m.syncCode).toBe('AAAA-AAAA-AAAA');
  });

  it('idempotent et associatif', () => {
    const third = progressWith({
      cards: { shared: card({ box: 5, at: 2_500 }), other: card({ at: 10 }) },
      activeDays: ['2026-09-01'],
      settings: { courses: ['MAT1500'], topicOverrides: {}, challenge: false, updatedAt: 800 },
      flagged: ['q0'],
      syncCode: 'K7F2-9QXD-M3PA',
    });
    const m = merge(phone, laptop);
    expect(merge(m, m)).toEqual(m);
    expect(merge(merge(phone, laptop), third)).toEqual(merge(phone, merge(laptop, third)));
    expect(merge(merge(third, laptop), phone)).toEqual(merge(phone, merge(laptop, third)));
  });

  it('état neuf d\'un côté : l\'autre est conservé (premier appareil qui rejoint la synchro)', () => {
    const fresh = progressWith();
    const m = both(fresh, phone);
    expect(m.cards).toEqual(phone.cards);
    expect(m.settings).toEqual(phone.settings);
  });

  describe('remise à zéro (resetAt)', () => {
    const RESET = 10_000;

    it('reset sur A puis merge avec B plein : cartes vides, resetAt conservé, dans les deux ordres', () => {
      const a = resetProgress(phone, RESET);
      const m = both(a, laptop);
      expect(m.cards).toEqual({});
      expect(m.resetAt).toBe(RESET);
      expect(ProgressSchema.safeParse(m).success).toBe(true);
    });

    it('une réponse donnée après la remise à zéro survit, même venant de l\'autre appareil', () => {
      const a = resetProgress(phone, RESET);
      const b = {
        ...laptop,
        cards: { ...laptop.cards, apres: card({ at: RESET + 1 }), pile: card({ at: RESET }) },
      };
      expect(Object.keys(both(a, b).cards).sort()).toEqual(['apres', 'pile']);
    });

    it('garde le resetAt le plus récent', () => {
      const a = { ...progressWith({ cards: { x: card({ at: 150 }) } }), resetAt: 100 };
      const b = { ...progressWith({ cards: { y: card({ at: 250 }) } }), resetAt: 200 };
      const m = both(a, b);
      expect(m.resetAt).toBe(200);
      expect(Object.keys(m.cards)).toEqual(['y']);
    });

    it('associatif et idempotent avec des remises à zéro', () => {
      const a = resetProgress(phone, 2_200);
      const c = { ...progressWith({ cards: { shared: card({ at: 2_100 }), neuf: card({ at: 2_300 }) } }), resetAt: 1_000 };
      expect(merge(merge(a, laptop), c)).toEqual(merge(a, merge(laptop, c)));
      const m = merge(a, laptop);
      expect(merge(m, m)).toEqual(m);
    });

    it('aucune remise à zéro : pas de clé resetAt', () => {
      expect('resetAt' in merge(phone, laptop)).toBe(false);
    });
  });

  it('résultat valide pour Zod, entrées non mutées (gelées), aucun partage d\'objet avec les entrées', () => {
    const m = merge(phone, laptop);
    expect(ProgressSchema.safeParse(m).success).toBe(true);
    expect(m.cards.shared).not.toBe(laptop.cards.shared);
    expect(m.settings.courses).not.toBe(laptop.settings.courses);
  });
});
