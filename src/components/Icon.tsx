// Jeu d'icônes dessiné pour Pause Maths : grille 24, trait 2.25, extrémités arrondies.
import type { JSX } from 'preact';

const STROKE: Record<string, JSX.Element> = {
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  back: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cross: <path d="M7 7l10 10M17 7L7 17" />,
  flag: <path d="M6 21V4.5M6 4.5h11.5l-2.5 4 2.5 4H6" />,
  sliders: (
    <>
      <path d="M4 7h8M18 7h2M4 17h2M12 17h8" />
      <circle cx="15" cy="7" r="2.5" />
      <circle cx="9" cy="17" r="2.5" />
    </>
  ),
  stats: <path d="M5.5 20v-7M12 20V5M18.5 20v-10" />,
  share: (
    <path d="M12 3.5v11M8 7.5l4-4 4 4M8 10.5H6.5a1.5 1.5 0 0 0-1.5 1.5v7a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5H16" />
  ),
  addSquare: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  install: <path d="M12 4v10.5M7.5 10l4.5 4.5 4.5-4.5M5 19.5h14" />,
  cloud: <path d="M7.5 18.5h9.5a4 4 0 0 0 .7-7.94A5.75 5.75 0 0 0 6.6 9.3 4.6 4.6 0 0 0 7.5 18.5z" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h8.5A1.5 1.5 0 0 1 15 5v.5" />
    </>
  ),
  infinity: (
    <path d="M12 12c-1.8-2.4-3.3-4-5.3-4a4 4 0 0 0 0 8c2 0 3.5-1.6 5.3-4zm0 0c1.8 2.4 3.3 4 5.3 4a4 4 0 0 0 0-8c-2 0-3.5 1.6-5.3 4z" />
  ),
  redo: <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9" />,
  forward: <path d="M5 6.5l5.5 5.5L5 17.5M12.5 6.5L18 12l-5.5 5.5" />,
  peak: <path d="M2.5 19.5l7-12 4.25 7 2.5-3.75 5.25 8.75z" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  chevron: <path d="M6.5 9.5l5.5 5.5 5.5-5.5" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
};

export type IconName = keyof typeof STROKE | 'bolt' | 'flame';

interface Props {
  name: IconName;
  size?: number;
  class?: string;
  /** texte pour lecteur d'écran ; absent = décoratif */
  label?: string;
}

export function Icon({ name, size = 24, class: className, label }: Props) {
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  if (name === 'bolt') {
    return (
      <svg class={className} width={size} height={size} viewBox="0 0 24 24" {...a11y}>
        <path
          d="M13.4 2.8L5.2 13.3a.6.6 0 0 0 .5 1h5.2l-1.3 6.6c-.1.6.6.9 1 .4l8.2-10.5a.6.6 0 0 0-.5-1h-5.2l1.3-6.6c.1-.6-.6-.9-1-.4z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === 'flame') {
    return (
      <svg class={className} width={size} height={size} viewBox="0 0 24 24" {...a11y}>
        <path
          class="flame-outer"
          d="M12.3 1.9c.9 3.4-.7 5.5-2.6 7.4C7.9 11.1 6 12.9 6 15.9c0 3.6 2.7 6.2 6 6.2s6-2.6 6-6.3c0-2.6-1.2-4.4-2.6-5.9-.2 1.6-1 2.8-2.2 3.3.6-4.1-.4-8.6-2.9-11.3z"
        />
        <path
          class="flame-inner"
          d="M12 22.1c-1.9 0-3.3-1.4-3.3-3.4 0-1.7 1-2.8 2.1-3.9.3 1 .9 1.7 1.8 2-.1-1.5.3-2.8 1.1-3.8 1.2 1.3 1.9 2.8 1.9 4.9 0 2.5-1.6 4.2-3.6 4.2z"
        />
      </svg>
    );
  }
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...a11y}
    >
      {STROKE[name]}
    </svg>
  );
}
