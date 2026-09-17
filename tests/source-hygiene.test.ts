// Le fichier qui interdit les caractères de contrôle ne doit pas en contenir : un octet brut (NUL, tabulation…)
// fait passer le fichier pour binaire aux yeux de git et masque ses diffs en revue. Les caractères invisibles
// (BOM, espaces de largeur nulle) ne cassent rien mais rendent le code trompeur : on écrit leur code, pas le caractère.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ENGINE_SOURCES = [
  'src/lib/gate.ts',
  'src/lib/schema.ts',
  'src/lib/progress.ts',
  'src/lib/merge.ts',
  'src/lib/scheduler.ts',
  'scripts/import-questions.ts',
  ...readdirSync('tests')
    .filter((f) => f.endsWith('.ts'))
    .map((f) => `tests/${f}`),
];

const hex = (code: number) => `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
const INVISIBLE = new Set([0xfeff, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x2060]);

describe('sources du lot Engine', () => {
  it.each(ENGINE_SOURCES)('%s : aucun caractère de contrôle ni caractère invisible hors fin de ligne', (file) => {
    const text = readFileSync(file, 'utf8');
    const found: string[] = [];
    text.split('\n').forEach((line, i) => {
      for (const ch of line.replace(/\r$/, '')) {
        const code = ch.codePointAt(0)!;
        if (code <= 0x1f || INVISIBLE.has(code)) found.push(`ligne ${i + 1} : ${hex(code)}`);
      }
    });
    expect(found).toEqual([]);
  });
});
