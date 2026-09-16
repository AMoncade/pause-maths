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

interface Props {
  text: string;
  class?: string;
}

export function MathText({ text, class: className }: Props) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <span class={className}>
      {parts.map((part, i) =>
        part.kind === 'text' ? (
          part.value
        ) : (
          <span
            key={i}
            class={part.kind === 'display' ? 'math-display' : 'math-inline'}
            dangerouslySetInnerHTML={{ __html: renderTex(part.value, part.kind === 'display') }}
          />
        ),
      )}
    </span>
  );
}
