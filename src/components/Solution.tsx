import { useMemo } from 'preact/hooks';
import { MathText } from '@/lib/MathText';
import { parseInline, parseMarkdown } from '@/lib/ui-markdown';

function Inline({ text }: { text: string }) {
  const parts = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {parts.map((p, i) => {
        switch (p.kind) {
          case 'text':
            return <MathText key={i} text={p.value} />;
          case 'strong':
            return (
              <strong key={i}>
                <MathText text={p.value} />
              </strong>
            );
          case 'em':
            return (
              <em key={i}>
                <MathText text={p.value} />
              </em>
            );
          case 'code':
            return <code key={i}>{p.value}</code>;
        }
      })}
    </>
  );
}

/** Solution pas à pas d'une question Défi (Markdown simple + formules). */
export function Solution({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);
  return (
    <div class="solution">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'p':
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case 'h':
            return (
              <p key={i} class="solution__h">
                <Inline text={b.text} />
              </p>
            );
          case 'ol':
            return (
              <ol key={i} start={b.start} class="solution__steps">
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case 'ul':
            return (
              <ul key={i} class="solution__list">
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
