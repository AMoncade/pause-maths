// Équilibre de la banque par cours (thèmes de l'intra) : part de Défi, part de qcm, questions par thème.
// Bornes fixées avec l'admin après mesure de la banque réelle (2026-09-16 : MAT1400 8,3 % Défi / 61,5 % qcm,
// MAT1500 12,5 % / 58,8 %, MAT1600 9,1 % / 61,0 % ; au moins 8 questions par thème).
// Une seule règle de seuil : rien n'est vérifié tant qu'un cours a moins de 40 questions intra
// (un cours qui démarre, ou un thème qui arrive en deux fois).
import { describe, expect, it } from 'vitest';
import { bank } from '@/content/bank';
import { courses } from '@/content/courses';
import type { Course, Question } from '@/lib/types';
import { makeQuestion } from './helpers';

const BOUNDS = {
  /** en dessous, aucune borne n'est vérifiée pour le cours */
  minQuestions: 40,
  challenge: { min: 0.05, max: 0.15 },
  qcm: { min: 0.5, max: 0.7 },
  /** par thème intra ayant au moins une question (cours d'au moins minQuestions) */
  minPerTopic: 8,
};

interface CourseStats {
  code: string;
  total: number;
  challenge: number;
  qcm: number;
  perTopic: Record<string, number>;
}

function statsOf(course: Course, questions: Question[]): CourseStats {
  const intra = new Set(course.topics.filter((t) => t.exam === 'intra').map((t) => t.id));
  const qs = questions.filter((q) => q.course === course.code && intra.has(q.topic));
  const perTopic: Record<string, number> = {};
  for (const q of qs) perTopic[q.topic] = (perTopic[q.topic] ?? 0) + 1;
  return {
    code: course.code,
    total: qs.length,
    challenge: qs.filter((q) => q.challenge === true).length,
    qcm: qs.filter((q) => q.type === 'qcm').length,
    perTopic,
  };
}

const pct = (x: number, n: number) => `${((100 * x) / n).toFixed(1)} %`;

/** Problèmes d'équilibre d'un cours ; [] si tout est dans les bornes. */
function balanceIssues(s: CourseStats, b = BOUNDS): string[] {
  const issues: string[] = [];
  if (s.total < b.minQuestions) return issues;
  const share = (x: number) => x / s.total;
  if (share(s.challenge) < b.challenge.min || share(s.challenge) > b.challenge.max) {
    issues.push(`${s.code} : Défi ${s.challenge}/${s.total} = ${pct(s.challenge, s.total)} (attendu ${pct(b.challenge.min, 1)} à ${pct(b.challenge.max, 1)})`);
  }
  if (share(s.qcm) < b.qcm.min || share(s.qcm) > b.qcm.max) {
    issues.push(`${s.code} : qcm ${s.qcm}/${s.total} = ${pct(s.qcm, s.total)} (attendu ${pct(b.qcm.min, 1)} à ${pct(b.qcm.max, 1)})`);
  }
  for (const [topic, n] of Object.entries(s.perTopic)) {
    if (n < b.minPerTopic) issues.push(`${s.code} : thème ${topic} à ${n} question(s) (minimum ${b.minPerTopic})`);
  }
  return issues;
}

describe('équilibre de la banque réelle (thèmes intra)', () => {
  it.each(courses.map((c) => [c.code, c] as const))('%s', (_code, course) => {
    const s = statsOf(course, bank);
    const issues = balanceIssues(s);
    expect(issues, issues.join('\n')).toEqual([]);
  });
});

describe('contrôle des bornes sur des données synthétiques', () => {
  const course: Course = {
    code: 'MAT1600',
    title: 'test',
    color: '#000',
    topics: [
      { id: 'mat1600-syst', label: 's', exam: 'intra', defaultOn: true },
      { id: 'mat1600-det', label: 'd', exam: 'intra', defaultOn: true },
      { id: 'mat1600-diag', label: 'g', exam: 'final', defaultOn: false },
    ],
  };
  /** n questions d'un thème : `challenge` Défi et `vf` vf, le reste en qcm (makeQuestion donne du vf, on retype). */
  const questions = (topic: string, n: number, opts: { challenge?: number; vf?: number } = {}): Question[] =>
    Array.from({ length: n }, (_, i) => {
      const base = makeQuestion(`${topic}-${String(i + 1).padStart(3, '0')}`, { challenge: i < (opts.challenge ?? 0) });
      if (i >= n - (opts.vf ?? 0)) return base;
      const { answer: _a, ...rest } = base as Extract<Question, { type: 'vf' }>;
      return {
        ...rest,
        type: 'qcm',
        choices: [
          { text: 'a', correct: true },
          { text: 'b', correct: false },
          { text: 'c', correct: false },
          { text: 'd', correct: false },
        ],
      };
    });
  const balanced = [...questions('mat1600-syst', 24, { challenge: 2, vf: 10 }), ...questions('mat1600-det', 24, { challenge: 2, vf: 10 })];

  it('cours équilibré : aucun problème ; les thèmes de l\'examen final ne comptent pas', () => {
    const s = statsOf(course, [...balanced, ...questions('mat1600-diag', 3, { challenge: 3 })]);
    expect(s).toMatchObject({ total: 48, challenge: 4, qcm: 28 });
    expect(balanceIssues(s)).toEqual([]);
  });

  it('lève chaque borne sur son cas', () => {
    const noChallenge = [...questions('mat1600-syst', 24, { vf: 10 }), ...questions('mat1600-det', 24, { vf: 10 })];
    const tooManyChallenge = [...questions('mat1600-syst', 24, { challenge: 5, vf: 10 }), ...questions('mat1600-det', 24, { challenge: 4, vf: 10 })];
    const tooManyQcm = [...questions('mat1600-syst', 24, { challenge: 2, vf: 2 }), ...questions('mat1600-det', 24, { challenge: 2, vf: 2 })];
    const tooFewQcm = [...questions('mat1600-syst', 24, { challenge: 2, vf: 14 }), ...questions('mat1600-det', 24, { challenge: 2, vf: 14 })];
    // 40 + 7 = 47 questions : 3 Défi (6,4 %), 31 qcm (66,0 %), seul le thème det est sous le minimum
    const smallTopic = [...questions('mat1600-syst', 40, { challenge: 3, vf: 14 }), ...questions('mat1600-det', 7, { vf: 2 })];
    expect(balanceIssues(statsOf(course, noChallenge))).toEqual(['MAT1600 : Défi 0/48 = 0.0 % (attendu 5.0 % à 15.0 %)']);
    expect(balanceIssues(statsOf(course, tooManyChallenge))).toEqual(['MAT1600 : Défi 9/48 = 18.8 % (attendu 5.0 % à 15.0 %)']);
    expect(balanceIssues(statsOf(course, tooManyQcm))).toEqual(['MAT1600 : qcm 44/48 = 91.7 % (attendu 50.0 % à 70.0 %)']);
    expect(balanceIssues(statsOf(course, tooFewQcm))).toEqual(['MAT1600 : qcm 20/48 = 41.7 % (attendu 50.0 % à 70.0 %)']);
    expect(balanceIssues(statsOf(course, smallTopic))).toEqual(['MAT1600 : thème mat1600-det à 7 question(s) (minimum 8)']);
  });

  it('sous 40 questions intra, aucune borne : ni proportions ni minimum par thème', () => {
    // 39 questions : 0 Défi, 100 % qcm, un thème à 3 questions
    const below = [...questions('mat1600-syst', 36), ...questions('mat1600-det', 3)];
    expect(statsOf(course, below).total).toBe(39);
    expect(balanceIssues(statsOf(course, below))).toEqual([]);
    const atThreshold = [...questions('mat1600-syst', 37), ...questions('mat1600-det', 3)];
    expect(balanceIssues(statsOf(course, atThreshold))).toHaveLength(3);
  });

  it('bornes incluses : exactement 5 % et 15 % de Défi, 50 % et 70 % de qcm passent', () => {
    const at = (challenge: number, vf: number) => balanceIssues(statsOf(course, questions('mat1600-syst', 40, { challenge, vf })));
    expect(at(2, 12)).toEqual([]);
    expect(at(6, 20)).toEqual([]);
  });
});
