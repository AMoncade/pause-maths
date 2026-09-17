// Propriété du lot Engine. Import de questions collées : `npm run import -- <fichier.json> [--renumber]`.
// Valide tout avec le gate, puis range chaque question dans src/content/<cours>/<thème>.json (trié par id).
// Tout ou rien : à la moindre issue, aucun fichier n'est écrit. Ne touche qu'aux fichiers src/content/<cours>/*.json.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { courses } from '../src/content/courses';
import { checkBank, formatIssues, type Issue } from '../src/lib/gate';
import type { Course, Question } from '../src/lib/types';

export interface ImportOptions {
  /** dossier src/content */
  contentDir: string;
  courses: Course[];
  retired: Set<string>;
  /** `--renumber` : réattribuer les ids avant validation (voir renumberQuestions) */
  renumber?: boolean;
}

export interface RenumberEntry {
  /** id collé (absent si la question n'en avait pas) */
  from: string | undefined;
  to: string;
}

export interface ImportResult {
  ok: boolean;
  issues: Issue[];
  /** chemins relatifs à contentDir, ex. "stt1700/stt1700-desc.json" */
  written: string[];
  summary: string;
  /** correspondance ancien → nouveau, présente seulement avec `renumber` (même si l'import est refusé) */
  renumbered?: RenumberEntry[];
}

/**
 * `--renumber` : donne à chaque question collée, dans l'ordre du fichier, le prochain numéro libre de son thème
 * (`<topic>-<nnn>`). Libre = au-dessus du plus grand numéro déjà présent dans la banque pour ce thème, en sautant
 * les ids retirés et ceux déjà attribués dans ce lot. Les trous ne sont jamais réutilisés : un ancien id peut
 * encore figurer dans la progression d'un utilisateur. Un élément sans `topic` (chaîne) est laissé tel quel,
 * le gate le signalera. L'entrée n'est pas modifiée.
 */
export function renumberQuestions(
  raw: readonly unknown[],
  existingIds: Iterable<string>,
  retired: Set<string>,
): { questions: unknown[]; mapping: RenumberEntry[] } {
  const highest = new Map<string, number>();
  for (const id of existingIds) {
    const m = /^(.+)-(\d+)$/.exec(id);
    if (m) highest.set(m[1]!, Math.max(highest.get(m[1]!) ?? 0, Number(m[2])));
  }
  const assigned = new Set<string>();
  const mapping: RenumberEntry[] = [];
  const questions = raw.map((q) => {
    if (typeof q !== 'object' || q === null || Array.isArray(q)) return q;
    const record = q as Record<string, unknown>;
    const topic = record.topic;
    if (typeof topic !== 'string') return q;
    let n = (highest.get(topic) ?? 0) + 1;
    const idFor = (k: number) => `${topic}-${String(k).padStart(3, '0')}`;
    while (retired.has(idFor(n)) || assigned.has(idFor(n))) n++;
    const to = idFor(n);
    assigned.add(to);
    highest.set(topic, n);
    mapping.push({ from: typeof record.id === 'string' ? record.id : undefined, to });
    return { ...record, id: to };
  });
  return { questions, mapping };
}

/** Texte collé → JSON : retire un BOM et une clôture Markdown ```json … ``` éventuelle. */
export function parsePasted(text: string): unknown {
  let t = (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text).trim();
  const fence = /^```[a-zA-Z]*\s*\n([\s\S]*?)\n?```$/.exec(t);
  if (fence) t = fence[1]!;
  return JSON.parse(t);
}

/** Fichiers de contenu existants : { "<cours>/<fichier>.json": contenu }. */
export function readContentFiles(contentDir: string): Record<string, unknown> {
  const files: Record<string, unknown> = {};
  if (!existsSync(contentDir)) return files;
  for (const dir of readdirSync(contentDir).sort()) {
    const full = join(contentDir, dir);
    if (!statSync(full).isDirectory()) continue;
    for (const name of readdirSync(full).sort()) {
      if (!name.endsWith('.json')) continue;
      const rel = `${dir}/${name}`;
      try {
        files[rel] = JSON.parse(readFileSync(join(full, name), 'utf8'));
      } catch (e) {
        files[rel] = new Error((e as Error).message);
      }
    }
  }
  return files;
}

export function importQuestions(raw: unknown, opts: ImportOptions): ImportResult {
  let renumbered: RenumberEntry[] | undefined;
  const fail = (issues: Issue[]): ImportResult => ({
    ok: false,
    issues,
    written: [],
    summary: '',
    ...(renumbered ? { renumbered } : {}),
  });
  if (!Array.isArray(raw)) return fail([{ rule: 'schema', message: 'le fichier collé doit être un tableau JSON de questions' }]);
  if (raw.length === 0) return fail([{ rule: 'schema', message: 'tableau vide : rien à importer' }]);

  // Ids déjà présents dans la banque (utiles à --renumber et au refus des doublons).
  const existing = readContentFiles(opts.contentDir);
  const owner = new Map<string, string>();
  for (const [file, content] of Object.entries(existing)) {
    if (!Array.isArray(content)) continue;
    for (const q of content) {
      if (typeof q === 'object' && q !== null && typeof (q as { id?: unknown }).id === 'string') {
        owner.set((q as { id: string }).id, file);
      }
    }
  }

  let pasted: unknown[] = raw;
  if (opts.renumber) {
    const r = renumberQuestions(raw, owner.keys(), opts.retired);
    pasted = r.questions;
    renumbered = r.mapping;
  }

  // 1. Gate complet sur les questions collées (ids en double dans le collage et ids retirés compris).
  const issues = checkBank(pasted, opts.courses, opts.retired);
  if (issues.length > 0) return fail(issues);
  const incoming = pasted as Question[];

  // 2. Ids déjà dans la banque, et fichiers cibles lisibles.
  const targetOf = (q: Question) => `${q.course.toLowerCase()}/${q.topic}.json`;
  for (const q of incoming) {
    const file = owner.get(q.id);
    if (file !== undefined) {
      issues.push({ id: q.id, file, rule: 'id-unique', message: 'id déjà dans la banque : prendre un nouvel id' });
    }
    const target = targetOf(q);
    const current = existing[target];
    if (current !== undefined && !Array.isArray(current)) {
      issues.push({ id: q.id, file: target, rule: 'file-shape', message: `fichier cible illisible ou pas un tableau : ${String(current)}` });
    }
  }
  if (issues.length > 0) return fail(issues);

  // 3. Écriture : fusion avec le fichier existant, tri par id.
  const byTarget = new Map<string, Question[]>();
  for (const q of incoming) byTarget.set(targetOf(q), [...(byTarget.get(targetOf(q)) ?? []), q]);

  const written: string[] = [];
  const lines: string[] = [];
  for (const target of [...byTarget.keys()].sort()) {
    const added = byTarget.get(target)!;
    const before = (existing[target] as unknown[] | undefined) ?? [];
    const merged = [...before, ...added].sort((a, b) => {
      const x = (a as Question).id;
      const y = (b as Question).id;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    const [dir] = target.split('/') as [string];
    mkdirSync(join(opts.contentDir, dir), { recursive: true });
    writeFileSync(join(opts.contentDir, target), `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    written.push(target);
    const q0 = added[0]!;
    lines.push(`${q0.course}  ${q0.topic.padEnd(20)}  +${added.length} (total ${merged.length})`);
  }

  const types = incoming.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.type]: (acc[q.type] ?? 0) + 1 }), {});
  const defi = incoming.filter((q) => q.challenge).length;
  const summary = [
    `${incoming.length} question(s) importée(s) : ${Object.entries(types)
      .map(([t, n]) => `${n} ${t}`)
      .join(', ')}${defi > 0 ? `, dont ${defi} Défi` : ''}`,
    ...lines,
  ].join('\n');
  return { ok: true, issues: [], written, summary, ...(renumbered ? { renumbered } : {}) };
}

const USAGE = 'Usage : npm run import -- <fichier.json> [--renumber]';

function main(args: string[]): number {
  const flags = args.filter((a) => a.startsWith('--'));
  const positional = args.filter((a) => !a.startsWith('--'));
  const unknown = flags.filter((f) => f !== '--renumber');
  const arg = positional[0];
  if (arg === undefined || positional.length > 1 || unknown.length > 0) {
    if (unknown.length > 0) console.error(`Option inconnue : ${unknown.join(' ')}`);
    console.error(USAGE);
    return 2;
  }
  const renumber = flags.includes('--renumber');
  // npm lance le script depuis la racine du paquet ; INIT_CWD est le dossier d'où la commande a été tapée.
  const file = resolve(process.env.INIT_CWD ?? process.cwd(), arg);
  let raw: unknown;
  try {
    raw = parsePasted(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Import refusé : ${file} illisible — ${(e as Error).message}`);
    return 1;
  }
  const contentDir = fileURLToPath(new URL('../src/content', import.meta.url));
  const retired = new Set<string>(JSON.parse(readFileSync(join(contentDir, 'retired-ids.json'), 'utf8')) as string[]);
  const result = importQuestions(raw, { contentDir, courses, retired, renumber });
  if (result.renumbered) {
    const lines = result.renumbered.map((m) => `  ${m.from ?? '(sans id)'} → ${m.to}`);
    console.log(`Renumérotation (ancien → nouveau) :\n${lines.join('\n')}`);
  }
  if (!result.ok) {
    console.error(`Import refusé, aucun fichier écrit (${result.issues.length} problème(s)) :\n${formatIssues(result.issues)}`);
    return 1;
  }
  console.log(result.summary);
  console.log(`Fichiers écrits :\n${result.written.map((w) => `  src/content/${w}`).join('\n')}`);
  console.log('Ensuite : npm test (gate complet), puis relecture à l\'aveugle.');
  return 0;
}

const entry = process.argv[1];
if (entry !== undefined && import.meta.url.toLowerCase() === pathToFileURL(resolve(entry)).href.toLowerCase()) {
  process.exitCode = main(process.argv.slice(2));
}
