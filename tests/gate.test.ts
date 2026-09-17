// CONTRÔLE DU GATE : chaque règle doit être levée par son cas cassé, et seulement elle.
// Sans ce contrôle, un content.test.ts vert n'atteste rien.
import { describe, expect, it } from 'vitest';
import { checkBank, checkFiles, FILE_RULES, formatIssues, RULES } from '@/lib/gate';
import type { Question } from '@/lib/types';
import brokenJson from './fixtures/broken.json';
import validJson from './fixtures/valid.json';
import { testCourses, testRetired } from './fixtures/courses';

interface BrokenCase {
  rule: string;
  note: string;
  questions: unknown[];
}

const broken = brokenJson as unknown as BrokenCase[];
const valid = validJson as unknown as Question[];
const clone = <T>(x: T): T => structuredClone(x);
const rulesOf = (issues: { rule: string }[]) => [...new Set(issues.map((i) => i.rule))].sort();

describe('gate — fixture valide', () => {
  it('ne lève rien sur des questions correctes (qcm, vf, flash, Défi avec solution multiligne)', () => {
    const issues = checkBank(valid, testCourses, testRetired);
    expect(issues, formatIssues(issues)).toEqual([]);
  });

  it('ne signale pas « Aucune » ni « Aucune solution » comme choix fourre-tout', () => {
    const q = clone(valid[0]!) as Extract<Question, { type: 'qcm' }>;
    q.choices[1].text = 'Aucune solution';
    expect(checkBank([q], testCourses, testRetired)).toEqual([]);
  });

  it('ne signale pas « Toutes les … » ni « Aucune des … » quand ce ne sont pas des choix fourre-tout', () => {
    const q = clone(valid[0]!) as Extract<Question, { type: 'qcm' }>;
    q.choices[1].text = 'Toutes les droites sont parallèles';
    q.choices[2].text = "Aucune des deux équations n'a de solution";
    q.choices[3].text = 'Tous les coefficients sont nuls';
    expect(checkBank([q], testCourses, testRetired)).toEqual([]);
  });

  it('accepte le Markdown dans solution, et un tiret ou un souligné qui appartiennent à une formule', () => {
    const defi = clone(valid[3]!);
    defi.solution = '# Méthode\n**Étape 1** : calculer le déterminant.\n- si $k = 1$ : infinité de solutions\n- si $k = -1$ : incompatible';
    const q = clone(valid[0]!) as Extract<Question, { type: 'qcm' }>;
    q.prompt = '$x - y = 0$ - combien de solutions a le système $x + y = 2$, $x - y = 0$ ?';
    q.choices[3].text = '$- 2$ - deux solutions';
    q.explanation = '$-1$ - les droites se coupent. Le piège : $x_{1} \\ne x_1^2$.';
    const issues = checkBank([defi, q], testCourses, testRetired);
    expect(issues, formatIssues(issues)).toEqual([]);
  });

  it('KaTeX strict : accepte une lettre accentuée dans \\text{…}, pas en mode math', () => {
    const q = clone(valid[0]!);
    q.prompt = String.raw`Combien de solutions a $x + y = 2 \text{ et } x - y = 0 \text{ (système réel)}$ ?`;
    expect(checkBank([q], testCourses, testRetired)).toEqual([]);
    q.prompt = 'Combien de solutions a $x + y = 2$, système réél en $é$ ?';
    expect(checkBank([q], testCourses, testRetired).map((i) => i.rule)).toEqual(['katex']);
  });

  it('accepte un dollar littéral échappé \\$ hors et dans une formule', () => {
    const q = clone(valid[0]!);
    q.prompt = String.raw`Un billet coûte 5\$ et un autre $x\$$ : combien de solutions a $x = 1$ ?`;
    expect(checkBank([q], testCourses, testRetired)).toEqual([]);
  });

  it('accepte un saut de ligne dans solution hors formule, même autour d\'une formule display', () => {
    const q = clone(valid[3]!);
    expect(q.solution).toContain('\n');
    q.solution = 'Étape 1 :\n$$x = 1$$\nÉtape 2.';
    expect(checkBank([q], testCourses, testRetired)).toEqual([]);
  });
});

describe('gate — fixture cassée (tests/fixtures/broken.json)', () => {
  it('couvre toutes les règles de checkBank et aucune règle inconnue', () => {
    const covered = new Set(broken.map((c) => c.rule));
    expect([...covered].sort()).toEqual([...RULES].sort());
  });

  it.each(broken.map((c) => [c.rule, c.note, c] as const))('%s — %s', (rule, _note, c) => {
    const issues = checkBank(c.questions, testCourses, testRetired);
    expect(rulesOf(issues), formatIssues(issues)).toEqual([rule]);
    for (const issue of issues) expect(issue.message.length).toBeGreaterThan(0);
  });

  it('le cas "\\nabla" dans une formule de solution est bien présent et rejeté', () => {
    const c = broken.find((x) => x.note.includes('nabla'));
    expect(c).toBeDefined();
    const issues = checkBank(c!.questions, testCourses, testRetired);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.rule).toBe('control-char');
    expect(issues[0]!.message).toContain('U+000A');
  });
});

describe('gate — messages et cas limites', () => {
  it('explique le piège JSON "\\theta" et propose la correction', () => {
    const c = broken.find((x) => x.note.includes('theta'))!;
    const [issue] = checkBank(c.questions, testCourses, testRetired);
    expect(issue!.message).toContain('U+0009');
    expect(issue!.message).toContain('écrire "\\\\theta"');
    expect(issue!.id).toBe('mat1600-det-001');
  });

  it('nomme la formule fautive pour KaTeX', () => {
    const c = broken.find((x) => x.rule === 'katex')!;
    const [issue] = checkBank(c.questions, testCourses, testRetired);
    expect(issue!.message).toContain(String.raw`\frac{1}{`);
  });

  it('lève schema pour un élément qui n\'est pas un objet, avec sa position', () => {
    const issues = checkBank([valid[0], 'pas une question', null], testCourses, testRetired);
    expect(issues.map((i) => [i.rule, i.message.split(' :')[0]])).toEqual([
      ['schema', 'élément #1'],
      ['schema', 'élément #2'],
    ]);
  });

  it('lève chaque règle indépendamment quand une question cumule les fautes', () => {
    const q = clone(broken.find((x) => x.rule === 'challenge-solution')!.questions[0]) as Record<string, unknown>;
    q.id = 'mat1600-syst-900';
    q.difficulty = 7;
    q.prompt = 'Un billet coûte 5$ ' + 'x'.repeat(290);
    const issues = checkBank([q], testCourses, testRetired);
    expect(rulesOf(issues)).toEqual(['challenge-solution', 'id-retired', 'prompt-length', 'schema', 'stray-dollar']);
  });

  it('id-unique : un seul signalement par id, même répété trois fois', () => {
    const issues = checkBank([valid[0], valid[0], valid[0]], testCourses, testRetired);
    expect(issues).toEqual([{ id: 'mat1600-syst-001', rule: 'id-unique', message: 'id présent 3 fois' }]);
  });
});

describe('gate — checkFiles', () => {
  const [qcm, vf, flash, defi] = valid;

  it('ne lève rien sur des fichiers bien rangés (chemins Windows ou POSIX)', () => {
    const issues = checkFiles(
      {
        '../src/content/mat1600/mat1600-syst.json': [qcm, defi],
        'src\\content\\mat1600\\mat1600-det.json': [vf],
        'stt1700/stt1700-desc.json': [flash],
      },
      testCourses,
      testRetired,
    );
    expect(issues, formatIssues(issues)).toEqual([]);
  });

  it('couvre les règles de fichiers', () => {
    const issues = checkFiles(
      {
        'src/content/mat1600/mat1600-syst.json': { questions: [qcm] },
        'src/content/stt1700/mat1600-det.json': [vf],
      },
      testCourses,
      testRetired,
    );
    expect(rulesOf(issues)).toEqual([...FILE_RULES].sort());
    expect(issues.find((i) => i.rule === 'file-route')).toMatchObject({
      id: 'mat1600-det-001',
      file: 'src/content/stt1700/mat1600-det.json',
    });
  });

  it('rattache chaque issue de checkBank à son fichier et liste les fichiers d\'un id en double', () => {
    const issues = checkFiles(
      { 'a/mat1600/mat1600-syst.json': [qcm], 'b/mat1600/mat1600-syst.json': [qcm] },
      testCourses,
      testRetired,
    );
    expect(issues).toEqual([
      {
        id: 'mat1600-syst-001',
        file: 'a/mat1600/mat1600-syst.json',
        rule: 'id-unique',
        message: 'id présent 2 fois (a/mat1600/mat1600-syst.json, b/mat1600/mat1600-syst.json)',
      },
    ]);
  });
});
