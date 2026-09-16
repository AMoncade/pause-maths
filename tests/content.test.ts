// Gate de la vraie banque. Vide aujourd'hui : ces tests passent trivialement, c'est voulu.
// La preuve que le gate attrape quelque chose est dans tests/gate.test.ts.
import { describe, expect, it } from 'vitest';
import { bank, bankVersion, retiredIds } from '@/content/bank';
import { courses } from '@/content/courses';
import retiredJson from '@/content/retired-ids.json';
import { checkBank, checkFiles, FILE_RULES, formatIssues } from '@/lib/gate';

const files = import.meta.glob<unknown>('../src/content/*/*.json', { eager: true, import: 'default' });
const fileRules: readonly string[] = FILE_RULES;

describe('banque réelle (src/content)', () => {
  it('bank.ts charge toutes les questions de src/content/<cours>/*.json', () => {
    const fromFiles = Object.values(files).flatMap((f) => (Array.isArray(f) ? f : []));
    expect(bank).toEqual(fromFiles);
    expect(bankVersion).toEqual({ builtAt: 'test', count: bank.length });
  });

  it('checkBank(bank, courses, retiredIds) est vide', () => {
    const issues = checkBank(bank, courses, retiredIds);
    expect(issues, formatIssues(issues)).toEqual([]);
  });

  it('chaque fichier est un tableau rangé dans <cours>/<thème>.json', () => {
    const issues = checkFiles(files, courses, retiredIds).filter((i) => fileRules.includes(i.rule));
    expect(issues, formatIssues(issues)).toEqual([]);
  });

  it('retired-ids.json est un tableau de chaînes', () => {
    expect(Array.isArray(retiredJson)).toBe(true);
    expect((retiredJson as unknown[]).every((id) => typeof id === 'string')).toBe(true);
  });
});

describe('courses.ts', () => {
  it('ids de thèmes uniques et préfixés par le code du cours en minuscules', () => {
    const ids = courses.flatMap((c) => c.topics.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of courses) {
      for (const t of c.topics) expect(t.id.startsWith(`${c.code.toLowerCase()}-`), t.id).toBe(true);
    }
  });

  it('les quatre cours, dans l\'ordre des puces', () => {
    expect(courses.map((c) => c.code)).toEqual(['MAT1400', 'MAT1500', 'MAT1600', 'STT1700']);
  });
});
