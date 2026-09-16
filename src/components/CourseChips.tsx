import type { Course, CourseCode } from '@/lib/types';
import { isAll } from '@/lib/ui-select';
import { Icon } from './Icon';

export interface LevelInfo {
  level: number;
  into: number;
  span: number;
}

interface Props {
  courses: Course[];
  selected: CourseCode[];
  levels: Record<CourseCode, LevelInfo>;
  onToggle: (code: CourseCode) => void;
  onAll: () => void;
}

export function CourseChips({ courses, selected, levels, onToggle, onAll }: Props) {
  const all = isAll(
    selected,
    courses.map((c) => c.code),
  );
  return (
    <section class="courses" aria-labelledby="courses-title">
      <div class="section-head">
        <h2 id="courses-title" class="section-title">
          Tes cours
        </h2>
        <button type="button" class="chip" aria-pressed={all} onClick={onAll}>
          Tout
        </button>
      </div>
      <div class="course-grid">
        {courses.map((c) => {
          const on = selected.includes(c.code);
          const lp = levels[c.code];
          const pct = lp.span > 0 ? Math.round((lp.into / lp.span) * 100) : 0;
          return (
            <button
              key={c.code}
              type="button"
              class="course-tile tint"
              style={{ '--c': c.color }}
              aria-pressed={on}
              aria-label={`${c.code}, ${c.title}, niveau ${lp.level}`}
              onClick={() => onToggle(c.code)}
            >
              <span class="course-tile__top">
                <span class="course-code">{c.code}</span>
                <span class="course-tick" aria-hidden="true">
                  <Icon name="check" size={14} />
                </span>
              </span>
              <span class="course-title">{c.title}</span>
              <span class="course-level" aria-hidden="true">
                <span class="course-level__n">Niv. {lp.level}</span>
                <span class="meter">
                  <span class="meter__fill" style={{ width: `${pct}%` }} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
