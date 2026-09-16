import { useEffect, useMemo, useState } from 'preact/hooks';
import { prefersReducedMotion } from '@/lib/ui-env';

interface Props {
  /** couleurs des cours joués pendant la Rafale */
  colors: string[];
  count?: number;
}

/** Confettis légers aux couleurs des cours de la Rafale parfaite. Rien si mouvement réduit. */
export function Confetti({ colors, count = 42 }: Props) {
  const [alive, setAlive] = useState(() => !prefersReducedMotion());
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        color: colors[i % colors.length],
        left: Math.random() * 100,
        dx: `${(Math.random() - 0.5) * 30}vw`,
        rot: `${(Math.random() - 0.5) * 1080}deg`,
        delay: `${Math.random() * 280}ms`,
        dur: `${1300 + Math.random() * 900}ms`,
        shape: i % 3,
      })),
    [colors, count],
  );

  useEffect(() => {
    if (!alive) return;
    const t = setTimeout(() => setAlive(false), 2600);
    return () => clearTimeout(t);
  }, [alive]);

  if (!alive || colors.length === 0) return null;
  return (
    <div class="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          class={`confetti__piece confetti__piece--${p.shape}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            '--dx': p.dx,
            '--rot': p.rot,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}
