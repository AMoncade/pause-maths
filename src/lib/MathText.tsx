// Texte avec formules : splitMath (math.ts) puis KaTeX. Le texte ordinaire passe par Preact (échappé).
import katex from 'katex';
import { useMemo } from 'preact/hooks';
import { splitMath } from './math';

const cache = new Map<string, string>();

export function renderTex(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}${tex}`;
  let html = cache.get(key);
  if (html === undefined) {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      output: 'htmlAndMathml',
    });
    cache.set(key, html);
  }
  return html;
}

/** Au plus ce nombre de caractères collés à une formule (parenthèse, virgule…), pour ne jamais bloquer un mot entier. */
const GLUE_MAX = 3;

export type Piece =
  | { kind: 'text'; value: string }
  | { kind: 'display'; tex: string }
  | { kind: 'inline'; tex: string; before: string; after: string };

/**
 * Découpe en morceaux et colle à chaque formule en ligne la ponctuation qui la touche sans espace
 * (« ( » avant, « ), » après), pour qu'une ligne ne se coupe jamais entre la parenthèse et la formule.
 */
export function mathPieces(text: string): Piece[] {
  const parts = splitMath(text);
  const pieces: Piece[] = parts.map((p) =>
    p.kind === 'text'
      ? { kind: 'text', value: p.value }
      : p.kind === 'display'
        ? { kind: 'display', tex: p.value }
        : { kind: 'inline', tex: p.value, before: '', after: '' },
  );
  pieces.forEach((piece, i) => {
    if (piece.kind !== 'inline') return;
    const prev = pieces[i - 1];
    if (prev?.kind === 'text') {
      const run = /\S*$/.exec(prev.value)![0];
      if (run.length > 0 && run.length <= GLUE_MAX) {
        piece.before = run;
        prev.value = prev.value.slice(0, -run.length);
      }
    }
    const next = pieces[i + 1];
    if (next?.kind === 'text') {
      const run = /^\S*/.exec(next.value)![0];
      if (run.length > 0 && run.length <= GLUE_MAX) {
        piece.after = run;
        next.value = next.value.slice(run.length);
      }
    }
  });
  return pieces.filter((p) => p.kind !== 'text' || p.value.length > 0);
}

interface Props {
  text: string;
  class?: string;
}

export function MathText({ text, class: className }: Props) {
  const pieces = useMemo(() => mathPieces(text), [text]);
  return (
    <span class={className}>
      {pieces.map((piece, i) => {
        if (piece.kind === 'text') return piece.value;
        if (piece.kind === 'display') {
          return (
            <span key={i} class="math-display" dangerouslySetInnerHTML={{ __html: renderTex(piece.tex, true) }} />
          );
        }
        const math = (
          <span class="math-inline" dangerouslySetInnerHTML={{ __html: renderTex(piece.tex, false) }} />
        );
        if (!piece.before && !piece.after) return <span key={i}>{math}</span>;
        return (
          <span key={i} class="math-glue">
            {piece.before}
            {math}
            {piece.after}
          </span>
        );
      })}
    </span>
  );
}
