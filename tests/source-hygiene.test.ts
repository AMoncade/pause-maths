// Le fichier qui interdit les caractères de contrôle ne doit pas en contenir : un octet brut (NUL, tabulation…)
// fait passer le fichier pour binaire aux yeux de git et masque ses diffs en revue.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ENGINE_SOURCES = [
  'src/lib/gate.ts',
  'src/lib/schema.ts',
  'src/lib/progress.ts',
  'src/lib/merge.ts',
  'src/lib/scheduler.ts',
  'scripts/import-questions.ts',
];

describe('sources du lot Engine', () => {
  it.each(ENGINE_SOURCES)('%s : aucun caractère de contrôle hors fin de ligne', (file) => {
    const text = readFileSync(file, 'utf8');
    const found: string[] = [];
    text.split('\n').forEach((line, i) => {
      for (const ch of line.replace(/\r$/, '')) {
        const code = ch.charCodeAt(0);
        if (code <= 0x1f) found.push(`ligne ${i + 1} : U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
      }
    });
    expect(found).toEqual([]);
  });
});
