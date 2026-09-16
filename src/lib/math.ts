// Propriété de l'admin. Découpage des formules $…$ / $$…$$ — utilisé par MathText.tsx (UI) et tests/content.test.ts (Engine).
import type { MathPart } from './types';

/**
 * Découpe un texte en morceaux texte / inline ($…$) / display ($$…$$).
 * `\$` est un dollar littéral. Un `$` ouvert sans fermeture est laissé tel quel dans le texte
 * (voir `hasStrayDollar` pour le détecter dans le gate).
 */
export function splitMath(text: string): MathPart[] {
  const parts: MathPart[] = [];
  let buf = '';
  let i = 0;
  const push = (kind: MathPart['kind'], value: string) => {
    if (value.length > 0) parts.push({ kind, value });
  };
  while (i < text.length) {
    const ch = text[i]!;
    if (ch === '\\' && text[i + 1] === '$') {
      buf += '$';
      i += 2;
      continue;
    }
    if (ch === '$') {
      const display = text[i + 1] === '$';
      const delim = display ? '$$' : '$';
      const start = i + delim.length;
      const end = findClose(text, start, delim);
      if (end === -1) {
        buf += ch;
        i += 1;
        continue;
      }
      push('text', buf);
      buf = '';
      push(display ? 'display' : 'inline', text.slice(start, end));
      i = end + delim.length;
      continue;
    }
    buf += ch;
    i += 1;
  }
  push('text', buf);
  return parts;
}

function findClose(text: string, from: number, delim: string): number {
  let i = from;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text.startsWith(delim, i)) return i;
    i += 1;
  }
  return -1;
}

/** Vrai si un `$` non échappé reste dans les morceaux texte après découpage. */
export function hasStrayDollar(text: string): boolean {
  return splitMath(text).some((p) => p.kind === 'text' && /(^|[^\\])\$/.test(p.value));
}

/** Toutes les formules (inline + display) d'un texte, pour compilation KaTeX dans le gate. */
export function formulasOf(text: string): string[] {
  return splitMath(text)
    .filter((p) => p.kind !== 'text')
    .map((p) => p.value);
}
