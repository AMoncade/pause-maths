// Propriété du lot Engine. Quality gate de la banque de questions (HANDOFF §8).
// Chaque règle est isolée : une question fautive sur un seul point ne lève que cette règle-là
// (contrôle dans tests/gate.test.ts avec tests/fixtures/broken.json).
import katex from 'katex';
import { hasStrayDollar, splitMath } from './math';
import { PROMPT_MAX, QuestionSchema } from './schema';
import type { Course, CourseCode } from './types';

export interface Issue {
  id?: string;
  file?: string;
  rule: string;
  message: string;
}

/** Règles de checkBank. */
export const RULES = [
  'schema',
  'id-unique',
  'id-prefix',
  'topic-unknown',
  'id-retired',
  'choice-duplicate',
  'choice-catchall',
  'prompt-length',
  'control-char',
  'katex',
  'stray-dollar',
  'markdown-outside-solution',
  'challenge-solution',
] as const;

/** Règles supplémentaires de checkFiles (forme et emplacement des fichiers src/content/<cours>/<thème>.json). */
export const FILE_RULES = ['file-shape', 'file-route'] as const;

export type Rule = (typeof RULES)[number] | (typeof FILE_RULES)[number];

type Dict = Record<string, unknown>;

const isDict = (x: unknown): x is Dict => typeof x === 'object' && x !== null && !Array.isArray(x);
const str = (x: unknown): string | undefined => (typeof x === 'string' ? x : undefined);

/** Replie casse et accents, espaces normalisés. */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Choix fourre-tout, sur le texte replié : « toutes/aucune de ces réponses » et variantes, et tout
 * « aucun(e) de ces <nom> » / « tou(te)s ces <nom> ». « Toutes les valeurs propres… » reste permis.
 */
const CATCHALL =
  /\b(toutes?|tous|aucune?)\b(?: [\w'-]+){0,2}? (reponses?|choix|propositions?|options?|ci-dessus|celles?-ci|ceux-ci)\b|\b(toutes?|tous|aucune?)( de)? ces [a-z'-]+|\b(none|all) of the above\b/;

/**
 * Markdown hors `solution` : MathText l'afficherait tel quel. Gras ou souligné (`**`, `__`), titre `#`
 * ou puce `- ` en début de ligne. Les formules sont remplacées par un repère neutre avant la recherche.
 */
function markdownOutsideSolution(value: string): string | undefined {
  const text = splitMath(value)
    .map((p) => (p.kind === 'text' ? p.value : 'X'))
    .join('');
  const m = /\*\*|__/.exec(text) ?? /^ *(#|- )/m.exec(text);
  return m ? m[0].trim() : undefined;
}

/** Nom de la commande LaTeX probablement mangée par un échappement JSON, par caractère de contrôle. */
const JSON_ESCAPES: Record<number, string> = { 0x08: 'b', 0x09: 't', 0x0a: 'n', 0x0c: 'f', 0x0d: 'r' };

const hex = (code: number) => `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;

/** Champs affichés avec MathText : chemin lisible → texte. */
function textFields(q: Dict): [string, string][] {
  const out: [string, string][] = [];
  for (const key of ['prompt', 'explanation', 'solution', 'answer'] as const) {
    const v = str(q[key]);
    if (v !== undefined) out.push([key, v]);
  }
  if (Array.isArray(q.keyPoints)) {
    q.keyPoints.forEach((v, i) => {
      if (typeof v === 'string') out.push([`keyPoints[${i}]`, v]);
    });
  }
  if (Array.isArray(q.choices)) {
    q.choices.forEach((c, i) => {
      if (!isDict(c)) return;
      const t = str(c.text);
      const w = str(c.why);
      if (t !== undefined) out.push([`choices[${i}].text`, t]);
      if (w !== undefined) out.push([`choices[${i}].why`, w]);
    });
  }
  return out;
}

/** Toutes les chaînes d'une valeur JSON, avec leur chemin. */
function allStrings(x: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof x === 'string') out.push([path, x]);
  else if (Array.isArray(x)) x.forEach((v, i) => allStrings(v, `${path}[${i}]`, out));
  else if (isDict(x)) for (const [k, v] of Object.entries(x)) allStrings(v, path ? `${path}.${k}` : k, out);
  return out;
}

/**
 * Premier caractère de contrôle interdit. Seule exception : un saut de ligne (U+000A) dans `solution`
 * (Markdown pas à pas), hors formule. Dans une formule, `\n` est toujours le piège `\nabla`, `\neq`, `\neg`…
 */
function findControlChar(path: string, value: string): { text: string; index: number } | undefined {
  // Comparaison de codes, sans regex : aucun caractère de contrôle ne doit apparaître dans ce fichier source.
  const first = (s: string, allowNewline: boolean) => {
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code <= 0x1f && !(allowNewline && code === 0x0a)) return i;
    }
    return -1;
  };
  if (path !== 'solution') {
    const i = first(value, false);
    return i >= 0 ? { text: value, index: i } : undefined;
  }
  for (const part of splitMath(value)) {
    const i = first(part.value, part.kind === 'text');
    if (i >= 0) return { text: part.value, index: i };
  }
  return undefined;
}

/** `value` = le texte (ou le morceau de formule) où le caractère a été trouvé, `index` sa position. */
function controlCharMessage(path: string, value: string, index: number): string {
  const code = value.charCodeAt(index);
  const context = value.slice(Math.max(0, index - 12), index) + `⟨${hex(code)}⟩` + value.slice(index + 1, index + 13);
  let msg = `caractère de contrôle ${hex(code)} dans ${path} : « ${context} »`;
  const letter = JSON_ESCAPES[code];
  if (letter) {
    const word = /^[A-Za-z]*/.exec(value.slice(index + 1))?.[0] ?? '';
    msg += ` — en JSON, "\\${letter}${word}" devient ${hex(code)} + "${word}" : écrire "\\\\${letter}${word}"`;
  }
  return msg;
}

function zodPath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((acc, k) => (typeof k === 'number' ? `${acc}[${k}]` : acc ? `${acc}.${String(k)}` : String(k)), '');
}

/**
 * Vérifie toute la banque. Retourne [] si elle est publiable.
 * `questions` n'est pas encore validé (JSON brut), d'où `unknown[]`.
 */
export function checkBank(questions: unknown[], courses: Course[], retired: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const topicOwner = new Map<string, CourseCode>();
  for (const c of courses) for (const t of c.topics) topicOwner.set(t.id, c.code);
  const idCount = new Map<string, number>();

  questions.forEach((raw, index) => {
    const id = isDict(raw) ? str(raw.id) : undefined;
    const add = (rule: Rule, message: string) =>
      issues.push(id !== undefined ? { id, rule, message } : { rule, message: `élément #${index} : ${message}` });

    if (!isDict(raw)) {
      add('schema', 'objet question attendu');
      return;
    }
    if (id !== undefined) idCount.set(id, (idCount.get(id) ?? 0) + 1);

    // Validité Zod. Les règles vérifiées à part ci-dessous sont écartées ici pour ne pas être comptées deux fois.
    const parsed = QuestionSchema.safeParse(raw);
    if (!parsed.success) {
      for (const iss of parsed.error.issues) {
        const where = zodPath(iss.path);
        if (where === 'prompt' && iss.code === 'too_big') continue;
        if (iss.code === 'custom' && iss.params?.rule === 'challenge-solution') continue;
        if (where === 'solution' && raw.challenge === true) continue;
        add('schema', `${where || '(racine)'} : ${iss.message}`);
      }
    }

    const topic = str(raw.topic);
    const course = str(raw.course);
    if (id !== undefined && retired.has(id)) add('id-retired', `id retiré (src/content/retired-ids.json) : prendre un nouvel id`);
    if (id !== undefined && topic !== undefined && !id.startsWith(`${topic}-`)) {
      add('id-prefix', `l'id doit commencer par "${topic}-"`);
    }
    if (topic !== undefined) {
      const owner = topicOwner.get(topic);
      if (owner === undefined) add('topic-unknown', `thème "${topic}" absent de src/content/courses.ts`);
      else if (course !== undefined && owner !== course) add('topic-unknown', `thème "${topic}" appartient à ${owner}, pas à ${course}`);
    }

    if (Array.isArray(raw.choices)) {
      const seen = new Map<string, number>();
      for (const c of raw.choices) {
        const t = isDict(c) ? str(c.text) : undefined;
        if (t === undefined) continue;
        const key = t.replace(/\s+/g, ' ').trim();
        seen.set(key, (seen.get(key) ?? 0) + 1);
        if (CATCHALL.test(fold(t))) add('choice-catchall', `choix interdit (toutes/aucune de ces réponses) : « ${t} »`);
      }
      for (const [t, n] of seen) if (n > 1) add('choice-duplicate', `choix en double (${n} fois) : « ${t} »`);
    }

    const prompt = str(raw.prompt);
    if (prompt !== undefined && prompt.length > PROMPT_MAX) {
      add('prompt-length', `prompt de ${prompt.length} caractères (max ${PROMPT_MAX})`);
    }

    if (raw.challenge === true && !(typeof raw.solution === 'string' && /\S/.test(raw.solution))) {
      add('challenge-solution', 'question Défi (challenge: true) sans solution');
    }

    for (const [path, value] of allStrings(raw, '')) {
      const hit = findControlChar(path, value);
      if (hit) add('control-char', controlCharMessage(path, hit.text, hit.index));
    }

    for (const [path, value] of textFields(raw)) {
      for (const part of splitMath(value)) {
        if (part.kind === 'text') continue;
        try {
          // strict: 'error' : un avertissement KaTeX (ex. lettre accentuée en mode math, signe d'une paire
          // de « $ » littéraux non échappés) devient un refus au lieu d'un rendu en italique mathématique.
          katex.renderToString(part.value, { throwOnError: true, strict: 'error', displayMode: part.kind === 'display' });
        } catch (e) {
          add('katex', `${path} : « ${part.value} » ne compile pas — ${(e as Error).message}`);
        }
      }
      if (hasStrayDollar(value)) add('stray-dollar', `${path} : "$" orphelin (dollar littéral : écrire \\$)`);
      const markdown = path === 'solution' ? undefined : markdownOutsideSolution(value);
      if (markdown !== undefined) {
        add('markdown-outside-solution', `${path} : Markdown « ${markdown} » affiché tel quel (permis seulement dans solution)`);
      }
    }
  });

  for (const [id, n] of idCount) if (n > 1) issues.push({ id, rule: 'id-unique', message: `id présent ${n} fois` });
  return issues;
}

/**
 * Vérifie des fichiers de contenu `{ chemin: contenu JSON }` (chemins finissant par "<cours>/<thème>.json"),
 * puis toute la banque qu'ils forment avec checkBank. Chaque issue porte le fichier de sa question.
 */
export function checkFiles(files: Record<string, unknown>, courses: Course[], retired: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const all: unknown[] = [];
  const fileOf = new Map<string, string[]>();

  for (const [file, content] of Object.entries(files)) {
    if (!Array.isArray(content)) {
      issues.push({ file, rule: 'file-shape', message: 'le fichier doit contenir un tableau de questions' });
      continue;
    }
    const norm = file.replace(/\\/g, '/');
    for (const q of content) {
      all.push(q);
      if (!isDict(q)) continue;
      const id = str(q.id);
      const course = str(q.course);
      const topic = str(q.topic);
      if (id !== undefined) fileOf.set(id, [...(fileOf.get(id) ?? []), file]);
      if (course !== undefined && topic !== undefined) {
        const expected = `${course.toLowerCase()}/${topic}.json`;
        if (!(norm === expected || norm.endsWith(`/${expected}`))) {
          issues.push({
            ...(id !== undefined ? { id } : {}),
            file,
            rule: 'file-route',
            message: `la question devrait être dans src/content/${expected}`,
          });
        }
      }
    }
  }

  for (const issue of checkBank(all, courses, retired)) {
    const where = issue.id !== undefined ? fileOf.get(issue.id) : undefined;
    if (where && where.length > 0) {
      issue.file = where[0];
      if (issue.rule === 'id-unique') issue.message += ` (${[...new Set(where)].join(', ')})`;
    }
    issues.push(issue);
  }
  return issues;
}

/** Rendu lisible d'une liste d'issues (sortie de test et du script d'import). */
export function formatIssues(issues: Issue[]): string {
  return issues
    .map((i) => `- [${i.rule}]${i.id !== undefined ? ` ${i.id}` : ''}${i.file !== undefined ? ` (${i.file})` : ''} : ${i.message}`)
    .join('\n');
}
