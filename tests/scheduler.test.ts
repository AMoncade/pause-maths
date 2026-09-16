import { describe, expect, it } from 'vitest';
import { applyAnswer, INTERVAL_MS, mulberry32, nextQuestion, SANS_FIN_KEEP } from '@/lib/scheduler';
import type { GameSession, Mode, Progress, Question } from '@/lib/types';
import { card, DAY, deepFreeze, local, makeQuestion, MIN, progressWith } from './helpers';

const NOW = local(2026, 9, 16, 18, 30);
const SEEDS = [1, 2, 3, 42, 1234, 99999];

const ALL_TOPICS = ['mat1400-vect', 'mat1500-logic', 'mat1600-syst', 'mat1600-det', 'stt1700-desc', 'stt1700-prob'];

/** Progression où tous les cours et `topics` sont cochés. */
const settingsFor = (cards: Progress['cards'] = {}, opts: { topics?: string[]; challenge?: boolean } = {}) =>
  progressWith({
    cards,
    settings: {
      courses: ['MAT1400', 'MAT1500', 'MAT1600', 'STT1700'],
      topics: opts.topics ?? ALL_TOPICS,
      challenge: opts.challenge ?? false,
      updatedAt: 0,
    },
  });

const ids = (prefix: string, n: number, from = 1) =>
  Array.from({ length: n }, (_, i) => `${prefix}-${String(i + from).padStart(3, '0')}`);

/** Simule l'appelant (lot UI) : pousse chaque id montré et met à jour lastCourse / lastTopic. */
function play(bank: Question[], p: Progress, mode: Mode, seed: number, steps: number, now = NOW) {
  const rng = mulberry32(seed);
  const session: GameSession = { shown: [] };
  const picked: Question[] = [];
  for (let i = 0; i < steps; i++) {
    const q = nextQuestion(bank, p, session, mode, now, rng);
    if (q === null) break;
    picked.push(q);
    session.shown.push(q.id);
    session.lastCourse = q.course;
    session.lastTopic = q.topic;
  }
  return { picked, session };
}

describe('INTERVAL_MS et mulberry32', () => {
  it('intervalles des boîtes', () => {
    expect(INTERVAL_MS).toEqual({ 1: 10 * MIN, 2: DAY, 3: 3 * DAY, 4: 7 * DAY, 5: 16 * DAY });
  });

  it('mulberry32 : déterministe, dans [0, 1), à peu près uniforme', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const xs = Array.from({ length: 10_000 }, () => a());
    expect(Array.from({ length: 10_000 }, () => b())).toEqual(xs);
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
    const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
    expect(mulberry32(43)()).not.toBe(mulberry32(42)());
  });
});

describe('applyAnswer', () => {
  const p = deepFreeze(progressWith({ cards: { vue: card({ box: 4, n: 6, k: 5, due: 1, at: 1 }), max: card({ box: 5, n: 9, k: 9 }) } }));

  it('carte jamais vue, bonne réponse : box 2, due dans 1 jour, jour marqué actif', () => {
    const q = applyAnswer(p, 'neuve', true, NOW);
    expect(q.cards.neuve).toEqual({ box: 2, due: NOW + DAY, n: 1, k: 1, wrongLast: false, at: NOW });
    expect(q.activeDays).toEqual(['2026-09-16']);
  });

  it('mauvaise réponse : retour en box 1, due dans 10 minutes, wrongLast', () => {
    expect(applyAnswer(p, 'vue', false, NOW).cards.vue).toEqual({ box: 1, due: NOW + 10 * MIN, n: 7, k: 5, wrongLast: true, at: NOW });
    expect(applyAnswer(p, 'neuve', false, NOW).cards.neuve).toEqual({ box: 1, due: NOW + 10 * MIN, n: 1, k: 0, wrongLast: true, at: NOW });
  });

  it('bonne réponse : box + 1 plafonnée à 5', () => {
    expect(applyAnswer(p, 'vue', true, NOW).cards.vue).toMatchObject({ box: 5, due: NOW + 16 * DAY, n: 7, k: 6, wrongLast: false });
    expect(applyAnswer(p, 'max', true, NOW).cards.max).toMatchObject({ box: 5, due: NOW + 16 * DAY, n: 10, k: 10 });
  });

  it('ne mute pas la progression (entrée gelée) et garde les autres cartes', () => {
    const q = applyAnswer(p, 'vue', true, NOW);
    expect(q.cards.max).toBe(p.cards.max);
    expect(p.cards.vue!.box).toBe(4);
  });
});

describe('nextQuestion — paliers', () => {
  const [a, b, c, d] = ['mat1600-syst-001', 'mat1600-syst-002', 'mat1600-syst-003', 'mat1600-syst-004'];
  const bank = deepFreeze([d, c, b, a].map((id) => makeQuestion(id)));
  const p = deepFreeze(
    settingsFor({
      [a]: card({ box: 1, due: NOW - MIN, wrongLast: true }),
      [c]: card({ box: 3, due: NOW - MIN }),
      [d]: card({ box: 2, due: NOW + DAY }),
    }),
  );

  it.each(SEEDS)('A (due, box 1) → B (jamais vue) → C (due, box ≥ 2) → D (pas due), puis null en Rafale (seed %i)', (seed) => {
    const { picked } = play(bank, p, 'rafale', seed, 10);
    expect(picked.map((q) => q.id)).toEqual([a, b, c, d]);
  });

  it('une carte manquée revient après 10 minutes avant 400 questions jamais vues (HANDOFF §7)', () => {
    const big = [...ids('mat1600-syst', 400).map((id) => makeQuestion(id)), makeQuestion('mat1600-syst-999')];
    const missed = applyAnswer(settingsFor(), 'mat1600-syst-999', false, NOW);
    const rng = mulberry32(7);
    expect(nextQuestion(big, missed, { shown: [] }, 'rafale', NOW + 5 * MIN, rng)?.id).not.toBe('mat1600-syst-999');
    expect(nextQuestion(big, missed, { shown: [] }, 'rafale', NOW + 11 * MIN, rng)?.id).toBe('mat1600-syst-999');
  });

  it('dans un palier : tri (box, due, difficulté)', () => {
    const qs = ['mat1600-syst-011', 'mat1600-syst-012', 'mat1600-syst-013', 'mat1600-syst-014'];
    const tierD = [
      makeQuestion(qs[0]!, { difficulty: 1 }),
      makeQuestion(qs[1]!, { difficulty: 1 }),
      makeQuestion(qs[2]!, { difficulty: 3 }),
      makeQuestion(qs[3]!, { difficulty: 1 }),
    ];
    const pd = settingsFor({
      [qs[0]!]: card({ box: 3, due: NOW + 1 * DAY }),
      [qs[1]!]: card({ box: 2, due: NOW + 5 * DAY }),
      [qs[2]!]: card({ box: 2, due: NOW + 2 * DAY }),
      [qs[3]!]: card({ box: 2, due: NOW + 2 * DAY }),
    });
    for (const seed of SEEDS) expect(play(tierD, pd, 'rafale', seed, 4).picked.map((q) => q.id)).toEqual([qs[3], qs[2], qs[1], qs[0]]);
  });

  it('jamais vues : les plus faciles d\'abord, ordre varié entre questions de même difficulté', () => {
    const easy = ids('mat1600-syst', 10).map((id) => makeQuestion(id, { difficulty: 1 }));
    const hard = makeQuestion('mat1600-syst-050', { difficulty: 3 });
    const bankB = [hard, ...easy];
    const firsts = new Set<string>();
    for (let seed = 0; seed < 60; seed++) {
      const { picked } = play(bankB, settingsFor(), 'rafale', seed, 11);
      expect(picked.at(-1)?.id).toBe(hard.id);
      firsts.add(picked[0]!.id);
    }
    expect(firsts.size).toBeGreaterThan(5);
  });
});

describe('nextQuestion — session et sélection', () => {
  const bank = deepFreeze([
    ...ids('mat1600-syst', 8).map((id) => makeQuestion(id)),
    ...ids('mat1600-det', 7).map((id) => makeQuestion(id)),
    ...ids('stt1700-desc', 9).map((id) => makeQuestion(id)),
    ...ids('mat1400-vect', 6).map((id) => makeQuestion(id)),
  ]);

  it.each(SEEDS)('aucune répétition dans une session, toute la sélection montrée puis null (seed %i)', (seed) => {
    const { picked } = play(bank, deepFreeze(settingsFor()), 'rafale', seed, 100);
    expect(picked).toHaveLength(bank.length);
    expect(new Set(picked.map((q) => q.id)).size).toBe(bank.length);
  });

  it('Rafale épuisée : null sans toucher session.shown', () => {
    const session: GameSession = { shown: deepFreeze(bank.map((q) => q.id)) };
    expect(nextQuestion(bank, settingsFor(), session, 'rafale', NOW, mulberry32(1))).toBeNull();
    expect(session.shown).toHaveLength(bank.length);
  });

  it.each(SEEDS)('alternance : jamais deux fois de suite le même cours tant qu\'un autre reste (seed %i)', (seed) => {
    const twoCourses = bank.filter((q) => q.course !== 'MAT1400' && q.topic !== 'mat1600-det').slice(0, 16);
    const { picked } = play(twoCourses, settingsFor(), 'rafale', seed, 100);
    const courses = picked.map((q) => q.course);
    // 8 MAT1600 et 8 STT1700 : alternance stricte
    expect(twoCourses.filter((q) => q.course === 'MAT1600')).toHaveLength(8);
    for (let i = 1; i < courses.length; i++) expect(courses[i]).not.toBe(courses[i - 1]);
  });

  it.each(SEEDS)('alternance des thèmes dans un cours (seed %i)', (seed) => {
    const oneCourse = [...ids('mat1600-syst', 5), ...ids('mat1600-det', 5)].map((id) => makeQuestion(id));
    const topics = play(oneCourse, settingsFor(), 'rafale', seed, 10).picked.map((q) => q.topic);
    for (let i = 1; i < topics.length; i++) expect(topics[i]).not.toBe(topics[i - 1]);
  });

  it('évite lastCourse s\'il y a un autre cours, le garde sinon', () => {
    const p = settingsFor();
    for (const seed of SEEDS) {
      expect(nextQuestion(bank, p, { shown: [], lastCourse: 'MAT1600' }, 'rafale', NOW, mulberry32(seed))?.course).not.toBe('MAT1600');
    }
    const only1600 = bank.filter((q) => q.course === 'MAT1600');
    expect(nextQuestion(only1600, p, { shown: [], lastCourse: 'MAT1600', lastTopic: 'mat1600-syst' }, 'rafale', NOW, mulberry32(1))?.topic).toBe(
      'mat1600-det',
    );
  });

  it('respecte les cours et thèmes cochés', () => {
    const p = progressWith({ settings: { courses: ['MAT1600', 'MAT1400'], topics: ['mat1600-det', 'stt1700-desc', 'mat1400-vect'], challenge: false, updatedAt: 0 } });
    for (const seed of SEEDS) {
      const topics = new Set(play(bank, p, 'rafale', seed, 100).picked.map((q) => q.topic));
      expect([...topics].sort()).toEqual(['mat1400-vect', 'mat1600-det']);
    }
    expect(nextQuestion(bank, progressWith(), { shown: [] }, 'sansFin', NOW, mulberry32(1))).toBeNull();
  });

  it('questions Défi seulement si le Défi est activé', () => {
    const withChallenge = [...bank, ...ids('mat1600-syst', 4, 900).map((id) => makeQuestion(id, { challenge: true }))];
    for (const seed of SEEDS) {
      const off = play(withChallenge, settingsFor(), 'rafale', seed, 200).picked;
      expect(off.some((q) => q.challenge)).toBe(false);
      expect(off).toHaveLength(bank.length);
      const on = play(withChallenge, settingsFor({}, { challenge: true }), 'rafale', seed, 200).picked;
      expect(on.filter((q) => q.challenge)).toHaveLength(4);
      expect(on).toHaveLength(withChallenge.length);
    }
  });
});

describe('nextQuestion — pondération weak', () => {
  // Cours et thèmes candidats : seulement des questions jamais vues (palier B).
  // La faiblesse vient de cartes vues dans des thèmes non cochés du même cours : elles comptent pour weak mais ne sont pas candidates.
  const candidates = [...ids('mat1600-syst', 3), ...ids('stt1700-desc', 3)].map((id) => makeQuestion(id));
  const history = [...ids('mat1600-det', 4), ...ids('stt1700-prob', 4)].map((id) => makeQuestion(id));
  const bank = [...candidates, ...history];
  const topics = ['mat1600-syst', 'stt1700-desc'];

  const share = (p: Progress, course: string) => {
    let hits = 0;
    const runs = 4000;
    for (let seed = 0; seed < runs; seed++) {
      if (nextQuestion(bank, p, { shown: [] }, 'rafale', NOW, mulberry32(seed))?.course === course) hits++;
    }
    return hits / runs;
  };

  it('weak = 0 partout : cours équiprobables', () => {
    expect(share(settingsFor({}, { topics }), 'MAT1600')).toBeCloseTo(0.5, 1);
  });

  it('MAT1600 entièrement raté (weak 1, w = 3) contre STT1700 réussi (weak 0, w = 1) : ~75 %', () => {
    const cards = Object.fromEntries([
      ...ids('mat1600-det', 4).map((id) => [id, card({ wrongLast: true, due: NOW + DAY })]),
      ...ids('stt1700-prob', 4).map((id) => [id, card({ wrongLast: false, due: NOW + DAY })]),
    ]);
    const s = share(settingsFor(cards, { topics }), 'MAT1600');
    expect(s).toBeGreaterThan(0.72);
    expect(s).toBeLessThan(0.78);
  });

  it('weak = moitié des cartes vues ratées (w = 2) : ~2/3 contre w = 1', () => {
    const cards = Object.fromEntries(ids('mat1600-det', 4).map((id, i) => [id, card({ wrongLast: i < 2, due: NOW + DAY })]));
    const s = share(settingsFor(cards, { topics }), 'MAT1600');
    expect(s).toBeGreaterThan(0.63);
    expect(s).toBeLessThan(0.7);
  });

  it('les cartes absentes de la banque ne comptent pas dans weak', () => {
    const cards = Object.fromEntries(ids('mat1600-zzz', 20).map((id) => [id, card({ wrongLast: true })]));
    expect(share(settingsFor(cards, { topics }), 'MAT1600')).toBeCloseTo(0.5, 1);
  });

  it('pondération des thèmes dans un cours', () => {
    const oneCourse = [...ids('mat1600-syst', 3), ...ids('mat1600-det', 3)].map((id) => makeQuestion(id));
    const seen = makeQuestion('mat1600-det-100');
    const p = settingsFor({ [seen.id]: card({ wrongLast: true, due: NOW + DAY }) }, { topics: ['mat1600-syst', 'mat1600-det'] });
    let det = 0;
    for (let seed = 0; seed < 4000; seed++) {
      if (nextQuestion([...oneCourse, seen], p, { shown: [] }, 'rafale', NOW, mulberry32(seed))?.topic === 'mat1600-det') det++;
    }
    expect(det / 4000).toBeGreaterThan(0.72);
    expect(det / 4000).toBeLessThan(0.78);
  });
});

describe('nextQuestion — Sans fin', () => {
  const bank = [...ids('mat1600-syst', 15), ...ids('stt1700-desc', 15)].map((id) => makeQuestion(id));

  it.each(SEEDS)('ne s\'arrête jamais, et 11 questions consécutives sont toujours distinctes (seed %i)', (seed) => {
    const { picked } = play(bank, settingsFor(), 'sansFin', seed, 200);
    expect(picked).toHaveLength(200);
    for (let i = 0; i + SANS_FIN_KEEP + 1 <= picked.length; i++) {
      expect(new Set(picked.slice(i, i + SANS_FIN_KEEP + 1).map((q) => q.id)).size).toBe(SANS_FIN_KEEP + 1);
    }
  });

  it('au redémarrage, tronque session.shown EN PLACE aux 10 derniers', () => {
    const rng = mulberry32(5);
    const shown = bank.map((q) => q.id);
    const session: GameSession = { shown };
    const q = nextQuestion(bank, settingsFor(), session, 'sansFin', NOW, rng);
    expect(session.shown).toBe(shown);
    expect(shown).toEqual(bank.slice(-SANS_FIN_KEEP).map((x) => x.id));
    expect(shown).not.toContain(q!.id);
  });

  it.each(SEEDS)('après épuisement, ne boucle pas sur 11 cartes : les 20 appels suivants montrent 20 questions distinctes (seed %i)', (seed) => {
    const { picked } = play(bank, settingsFor(), 'sansFin', seed, 90);
    expect(new Set(picked.slice(30, 50).map((q) => q.id)).size).toBe(20);
    expect(new Set(picked.slice(30, 90).map((q) => q.id)).size).toBe(bank.length);
  });

  it('petite sélection (3 questions) : continue sans répétition immédiate', () => {
    const small = ids('mat1600-syst', 3).map((id) => makeQuestion(id));
    const { picked } = play(small, settingsFor(), 'sansFin', 3, 30);
    expect(picked).toHaveLength(30);
    for (let i = 1; i < picked.length; i++) expect(picked[i]!.id).not.toBe(picked[i - 1]!.id);
  });

  it('sélection vide : null, session.shown intact', () => {
    const session: GameSession = { shown: ['x'] };
    expect(nextQuestion(bank, settingsFor({}, { topics: [] }), session, 'sansFin', NOW, mulberry32(1))).toBeNull();
    expect(session.shown).toEqual(['x']);
  });
});

describe('nextQuestion — À revoir', () => {
  const bank = [...ids('mat1600-syst', 6), ...ids('stt1700-desc', 6)].map((id) => makeQuestion(id));
  const wrong = ['mat1600-syst-002', 'mat1600-syst-005', 'stt1700-desc-001'];
  const p = deepFreeze(
    settingsFor({
      'mat1600-syst-001': card({ box: 1, due: NOW - MIN, wrongLast: false }),
      'mat1600-syst-002': card({ box: 1, due: NOW + 5 * MIN, wrongLast: true }),
      'mat1600-syst-005': card({ box: 1, due: NOW - MIN, wrongLast: true }),
      'stt1700-desc-001': card({ box: 1, due: NOW - DAY, wrongLast: true }),
      'stt1700-desc-002': card({ box: 3, due: NOW - DAY, wrongLast: false }),
    }),
  );

  it.each(SEEDS)('seulement les cartes à dernière réponse fausse, dues ou non, puis null (seed %i)', (seed) => {
    const { picked } = play(bank, p, 'aRevoir', seed, 20);
    expect(picked.map((q) => q.id).sort()).toEqual([...wrong].sort());
  });

  it('un seul palier : la carte pas encore due passe dans le même tri que les dues', () => {
    const only1600 = bank.filter((q) => q.course === 'MAT1600');
    expect(play(only1600, p, 'aRevoir', 1, 5).picked.map((q) => q.id)).toEqual(['mat1600-syst-005', 'mat1600-syst-002']);
  });

  it('aucune erreur : null', () => {
    expect(nextQuestion(bank, settingsFor(), { shown: [] }, 'aRevoir', NOW, mulberry32(1))).toBeNull();
  });
});

describe('nextQuestion — pureté', () => {
  it('même seed et mêmes entrées : même suite ; banque et progression non mutées', () => {
    const bank = deepFreeze([...ids('mat1600-syst', 10), ...ids('stt1700-desc', 10)].map((id) => makeQuestion(id)));
    const p = deepFreeze(settingsFor({ 'mat1600-syst-003': card({ due: NOW - MIN, wrongLast: true }) }));
    const run = () => play(bank, p, 'rafale', 77, 20).picked.map((q) => q.id);
    expect(run()).toEqual(run());
  });
});
