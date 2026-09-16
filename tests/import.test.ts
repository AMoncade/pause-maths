import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { importQuestions, parsePasted } from '../scripts/import-questions';
import type { Question } from '@/lib/types';
import brokenJson from './fixtures/broken.json';
import validJson from './fixtures/valid.json';
import { testCourses, testRetired } from './fixtures/courses';

const valid = validJson as unknown as Question[];
const [qcm, vf, flash, defi] = valid as [Question, Question, Question, Question];
const broken = brokenJson as unknown as { rule: string; note: string; questions: unknown[] }[];

let dir: string;
const opts = () => ({ contentDir: dir, courses: testCourses, retired: testRetired });
const read = (rel: string) => JSON.parse(readFileSync(join(dir, rel), 'utf8')) as Question[];
/** Instantané de tous les fichiers du dossier de contenu. */
const snapshot = () =>
  Object.fromEntries(
    readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => {
        const full = join(e.parentPath, e.name);
        return [full, readFileSync(full, 'utf8')];
      }),
  );

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'pause-maths-import-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('importQuestions', () => {
  it('range chaque question dans <cours>/<thème>.json, trié par id, et résume', () => {
    const r = importQuestions([defi, flash, vf, qcm], opts());
    expect(r.issues).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.written).toEqual(['mat1600/mat1600-det.json', 'mat1600/mat1600-syst.json', 'stt1700/stt1700-desc.json']);
    expect(read('mat1600/mat1600-syst.json').map((q) => q.id)).toEqual(['mat1600-syst-001', 'mat1600-syst-002']);
    expect(read('stt1700/stt1700-desc.json')).toEqual([flash]);
    expect(r.summary).toContain('4 question(s) importée(s)');
    expect(r.summary).toContain('dont 1 Défi');
    expect(r.summary).toMatch(/MAT1600 {2}mat1600-syst +\+2 \(total 2\)/);
  });

  it('fusionne avec un fichier existant sans perdre ses questions', () => {
    mkdirSync(join(dir, 'mat1600'));
    const existing = { ...structuredClone(qcm), id: 'mat1600-syst-005' };
    writeFileSync(join(dir, 'mat1600/mat1600-syst.json'), JSON.stringify([existing]));
    writeFileSync(join(dir, 'mat1600/index.ts'), 'export {};');
    const r = importQuestions([qcm], opts());
    expect(r.ok).toBe(true);
    expect(read('mat1600/mat1600-syst.json')).toEqual([qcm, existing]);
    expect(r.summary).toContain('+1 (total 2)');
    expect(readFileSync(join(dir, 'mat1600/index.ts'), 'utf8')).toBe('export {};');
  });

  it('refuse un id déjà dans la banque, sans rien écrire', () => {
    mkdirSync(join(dir, 'mat1600'));
    writeFileSync(join(dir, 'mat1600/mat1600-syst.json'), JSON.stringify([qcm]));
    const before = snapshot();
    const r = importQuestions([vf, { ...structuredClone(qcm), prompt: 'Nouvelle version : combien de solutions ?' }], opts());
    expect(r.ok).toBe(false);
    expect(r.issues).toEqual([
      expect.objectContaining({ id: 'mat1600-syst-001', rule: 'id-unique', file: 'mat1600/mat1600-syst.json' }),
    ]);
    expect(r.written).toEqual([]);
    expect(snapshot()).toEqual(before);
  });

  it('refuse un id en double dans le collage et un id retiré', () => {
    const dup = importQuestions([qcm, qcm], opts());
    expect(dup.ok).toBe(false);
    expect(dup.issues.map((i) => i.rule)).toEqual(['id-unique']);
    const retired = importQuestions([{ ...structuredClone(qcm), id: 'mat1600-syst-900' }], opts());
    expect(retired.issues.map((i) => i.rule)).toEqual(['id-retired']);
    expect(snapshot()).toEqual({});
  });

  it.each(broken.map((c) => [c.rule, c.note, c] as const))('refuse tout le lot si une question échoue au gate : %s — %s', (rule, _n, c) => {
    const r = importQuestions([vf, ...c.questions], opts());
    expect(r.ok).toBe(false);
    expect(r.issues.map((i) => i.rule)).toContain(rule);
    expect(snapshot()).toEqual({});
  });

  it('refuse autre chose qu\'un tableau non vide', () => {
    expect(importQuestions({ questions: [qcm] }, opts()).ok).toBe(false);
    expect(importQuestions([], opts()).ok).toBe(false);
  });

  it('refuse si le fichier cible existant est illisible', () => {
    mkdirSync(join(dir, 'mat1600'));
    writeFileSync(join(dir, 'mat1600/mat1600-syst.json'), '{ pas du json');
    const r = importQuestions([qcm], opts());
    expect(r.issues.map((i) => i.rule)).toEqual(['file-shape']);
    expect(readFileSync(join(dir, 'mat1600/mat1600-syst.json'), 'utf8')).toBe('{ pas du json');
  });
});

describe('parsePasted', () => {
  it('accepte un BOM et une clôture Markdown ```json', () => {
    expect(parsePasted('﻿[1, 2]')).toEqual([1, 2]);
    expect(parsePasted('```json\n[{"a": 1}]\n```\n')).toEqual([{ a: 1 }]);
    expect(parsePasted('```\n[]\n```')).toEqual([]);
  });

  it('lève sur un JSON invalide (échappement \\s inconnu)', () => {
    expect(() => parsePasted(String.raw`["$\sigma$"]`)).toThrow();
  });
});

describe('CLI npm run import', () => {
  const tsx = join('node_modules', 'tsx', 'dist', 'cli.mjs');
  const run = (...args: string[]) => {
    try {
      const stdout = execFileSync(process.execPath, [tsx, 'scripts/import-questions.ts', ...args], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, INIT_CWD: dir },
      });
      return { code: 0, out: stdout };
    } catch (e) {
      const err = e as { status: number; stdout: string; stderr: string };
      return { code: err.status, out: err.stdout + err.stderr };
    }
  };

  it('sans argument : usage, code 2', () => {
    expect(run()).toMatchObject({ code: 2, out: expect.stringContaining('Usage') });
  }, 30_000);

  it('JSON illisible (chemin relatif à INIT_CWD) : refus, code 1', () => {
    writeFileSync(join(dir, 'colle.json'), String.raw`[{"prompt": "$\sigma$"}]`);
    const r = run('colle.json');
    expect(r.code).toBe(1);
    expect(r.out).toContain('illisible');
  }, 30_000);

  it('question refusée par le gate : liste les problèmes, code 1, rien écrit', () => {
    writeFileSync(join(dir, 'colle.json'), JSON.stringify([{ ...structuredClone(qcm), topic: 'mat1600-inexistant', id: 'mat1600-inexistant-001' }]));
    const r = run('colle.json');
    expect(r.code).toBe(1);
    expect(r.out).toContain('[topic-unknown] mat1600-inexistant-001');
    expect(r.out).toContain('aucun fichier écrit');
  }, 30_000);
});
