import type { ComponentChildren } from 'preact';
import type { Course, CourseCode, Mode } from '@/lib/types';
import { CourseChips, type LevelInfo } from './CourseChips';
import { Icon } from './Icon';
import { Switch } from './Switch';

interface Props {
  courses: Course[];
  selected: CourseCode[];
  levels: Record<CourseCode, LevelInfo>;
  xpByCourse: Record<CourseCode, number>;
  streakDays: number;
  challenge: boolean;
  available: number;
  review: number;
  bankEmpty: boolean;
  banners?: ComponentChildren;
  onToggleCourse: (code: CourseCode) => void;
  onAll: () => void;
  onChallenge: (on: boolean) => void;
  onStart: (mode: Mode) => void;
  onSettings: () => void;
  onStats: () => void;
}

/** Logo : le signe « pause » en deux barres, aux quatre couleurs des cours. */
export function PauseMark({ courses }: { courses: Course[] }) {
  const [a, b, c, d] = courses.map((x) => x.color);
  return (
    <svg class="pause-mark" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <clipPath id="pause-mark-l">
        <rect x="4.5" y="3" width="7.5" height="22" rx="3.75" />
      </clipPath>
      <clipPath id="pause-mark-r">
        <rect x="16" y="3" width="7.5" height="22" rx="3.75" />
      </clipPath>
      <g clip-path="url(#pause-mark-l)">
        <rect x="4.5" y="3" width="7.5" height="11" fill={a} />
        <rect x="4.5" y="14" width="7.5" height="11" fill={b} />
      </g>
      <g clip-path="url(#pause-mark-r)">
        <rect x="16" y="3" width="7.5" height="11" fill={c} />
        <rect x="16" y="14" width="7.5" height="11" fill={d} />
      </g>
    </svg>
  );
}

export function Home(props: Props) {
  const { courses, selected, streakDays, challenge, available, review, bankEmpty } = props;
  const single = selected.length === 1 ? courses.find((c) => c.code === selected[0]) : undefined;

  return (
    <main
      class={`screen home ${single ? 'tint has-accent' : ''}`}
      style={single ? { '--c': single.color } : undefined}
    >
      <header class="home-bar">
        <h1 class="wordmark">
          <PauseMark courses={courses} />
          <span>Pause Maths</span>
        </h1>
        <span
          class={`streak ${streakDays > 0 ? 'is-on' : ''}`}
          aria-label={`Série de ${streakDays} jour${streakDays > 1 ? 's' : ''}`}
          title="Jours d’affilée avec au moins une réponse"
        >
          <Icon name="bolt" size={18} />
          <span class="streak__n">{streakDays}</span>
          <span class="streak__unit" aria-hidden="true">
            j
          </span>
        </span>
        <button type="button" class="icon-btn" onClick={props.onStats} aria-label="Statistiques">
          <Icon name="stats" />
        </button>
        <button type="button" class="icon-btn" onClick={props.onSettings} aria-label="Réglages">
          <Icon name="sliders" />
        </button>
      </header>

      {props.banners}

      <CourseChips
        courses={courses}
        selected={selected}
        levels={props.levels}
        xpByCourse={props.xpByCourse}
        onToggle={props.onToggleCourse}
        onAll={props.onAll}
      />

      <Switch
        checked={challenge}
        onChange={props.onChallenge}
        icon={<Icon name="peak" size={22} />}
        label="Défi"
        hint="Questions corsées, avec la solution pas à pas"
      />

      <div class="home-spacer" />

      <section class="modes" aria-label="Lancer une partie">
        {available === 0 && (
          <p class="modes__note">
            {bankEmpty
              ? 'Les questions arrivent bientôt : la banque est encore vide.'
              : 'Aucune question pour cette sélection. Coche d’autres thèmes dans Réglages.'}
          </p>
        )}
        <button type="button" class="btn btn--accent btn--hero" onClick={() => props.onStart('rafale')}>
          <span class="btn--hero__text">
            <span class="btn--hero__label">Rafale</span>
            <span class="btn--hero__sub">5 questions, un bilan</span>
          </span>
          <Icon name="forward" size={28} />
        </button>
        <div class="modes__row">
          <button type="button" class="btn mode-btn" onClick={() => props.onStart('sansFin')}>
            <Icon name="infinity" size={22} />
            Sans fin
          </button>
          <button type="button" class="btn mode-btn" onClick={() => props.onStart('aRevoir')}>
            <Icon name="redo" size={22} />
            À revoir
            {review > 0 && <span class="count-badge">{review}</span>}
          </button>
        </div>
      </section>
    </main>
  );
}
