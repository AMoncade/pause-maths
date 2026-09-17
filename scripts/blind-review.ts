/**
 * Relecture aveugle : mélange les choix d'un ou plusieurs fichiers de questions (mulberry32
 * seedé), retire `correct`/`why`/`explanation`/`solution`, imprime un Markdown sur stdout et
 * écrit la clé de correspondance dans un fichier séparé — jamais sur stdout.
 *
 * Usage : npx tsx scripts/blind-review.ts <fichier.json|dossier> [--seed N] --key <chemin>
 *
 * Ne modifie jamais src/content.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parsePasted } from './import-questions';
import { mulberry32 } from '../src/lib/scheduler';
import { QuestionFileSchema } from '../src/lib/schema';
import type { Question } from '../src/lib/types';

/** Renvoie, pour chaque position mélangée, l'index d'origine correspondant. */
function shuffledIndices(n: number, rng: () => number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = tmp;
  }
  return idx;
}

interface Args {
  input: string;
  seed: number;
  key: string;
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  let seed = 1;
  let key: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--seed') {
      seed = Number(argv[++i]);
    } else if (a === '--key') {
      key = argv[++i];
    } else if (a !== undefined) {
      positional.push(a);
    }
  }
  const input = positional[0];
  if (!input || !key || Number.isNaN(seed)) {
    process.stderr.write(
      'Usage: npx tsx scripts/blind-review.ts <fichier.json|dossier> [--seed N] --key <chemin>\n'
    );
    process.exit(1);
  }
  return { input, seed, key };
}

function loadQuestions(inputPath: string): Question[] {
  const stat = statSync(inputPath);
  const files = stat.isDirectory()
    ? readdirSync(inputPath)
        .filter((f) => extname(f) === '.json')
        .sort()
        .map((f) => join(inputPath, f))
    : [inputPath];

  const out: Question[] = [];
  for (const f of files) {
    let raw: unknown;
    try {
      raw = parsePasted(readFileSync(f, 'utf8'));
    } catch (e) {
      process.stderr.write(`${f} : JSON illisible (BOM/clôture \`\`\`json déjà tolérés) — ${(e as Error).message}\n`);
      process.exit(1);
    }
    const parsed = QuestionFileSchema.safeParse(raw);
    if (!parsed.success) {
      process.stderr.write(`${f} : JSON invalide selon src/lib/schema.ts (fais passer le gate avant la relecture) :\n`);
      for (const issue of parsed.error.issues) {
        process.stderr.write(`  ${issue.path.join('.')}: ${issue.message}\n`);
      }
      process.exit(1);
    }
    out.push(...parsed.data);
  }
  return out;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const CONSIGNE = [
  'Pour chaque question : choisis une réponse avec un niveau de confiance (1 à 5), puis réfute',
  "chacun des autres choix (pourquoi il est faux — un simple accord avec la bonne réponse ne",
  "suffit pas). Vérifie tout résultat calculé avec un script SymPy/scipy dans un venv **hors du",
  "dépôt**. Signale explicitement toute question qui a deux réponses défendables comme",
  "correctes, ou aucune.",
].join(' ');

function main(): void {
  const { input, seed, key } = parseArgs(process.argv.slice(2));
  const questions = loadQuestions(input);
  const rng = mulberry32(seed);

  const md: string[] = ['# Relecture aveugle', '', CONSIGNE, ''];
  const keyData: Record<string, unknown> = {};

  for (const q of questions) {
    md.push(`## ${q.id}`, '', `${q.course} · ${q.topic}`, '', q.prompt, '');

    if (q.type === 'qcm') {
      const order = shuffledIndices(q.choices.length, rng);
      const correctOrigIdx = q.choices.findIndex((c) => c.correct);
      const mapping: Record<string, number> = {};
      let correctLetter: string | null = null;
      order.forEach((origIdx, pos) => {
        const letter = LETTERS[pos]!;
        mapping[letter] = origIdx;
        if (origIdx === correctOrigIdx) correctLetter = letter;
        md.push(`${letter}. ${q.choices[origIdx]!.text}`);
      });
      keyData[q.id] = { type: 'qcm', correctLetter, mapping };
    } else if (q.type === 'vf') {
      md.push('Vrai / Faux');
      keyData[q.id] = { type: 'vf', answer: q.answer };
    } else {
      md.push('_(carte flash — donne la réponse attendue et ses points clés)_');
      keyData[q.id] = { type: 'flash', answer: q.answer, keyPoints: q.keyPoints };
    }
    md.push('');
  }

  process.stdout.write(md.join('\n') + '\n');
  writeFileSync(key, JSON.stringify(keyData, null, 2) + '\n', 'utf8');
  process.stderr.write(`Clé écrite : ${key} (${questions.length} questions)\n`);
}

main();
