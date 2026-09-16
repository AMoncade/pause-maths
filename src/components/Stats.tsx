import { useState } from 'preact/hooks';
import type { Course, CourseCode, Question } from '@/lib/types';
import { MathText } from '@/lib/MathText';
import type { LevelInfo } from './CourseChips';
import { Icon } from './Icon';
import { ScreenHeader } from './ScreenHeader';

interface Props {
  courses: Course[];
  bank: Question[];
  flagged: string[];
  streakDays: number;
  totalXp: number;
  seen: number;
  levels: Record<CourseCode, LevelInfo>;
  xpByCourse: Record<CourseCode, number>;
  masteryOf: (topicId: string) => number;
  bankVersion: { builtAt: string; count: number };
  onUnflag: (id: string) => void;
  onCopy: (text: string) => Promise<boolean>;
  onBack: () => void;
}

const dateFmt = new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long', timeStyle: 'short' });

function builtLabel(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function Stats(props: Props) {
  const { courses, bank, flagged, levels, xpByCourse } = props;
  const [copied, setCopied] = useState(false);
  const byId = new Map(bank.map((q) => [q.id, q]));
  const countByTopic = new Map<string, number>();
  for (const q of bank) countByTopic.set(q.topic, (countByTopic.get(q.topic) ?? 0) + 1);

  return (
    <main class="screen panel">
      <ScreenHeader title="Statistiques" onBack={props.onBack} />

      <dl class="summary">
        <div class="summary__item">
          <dt>Série</dt>
          <dd>
            <Icon name="bolt" size={20} class="summary__bolt" />
            {props.streakDays} j
          </dd>
        </div>
        <div class="summary__item">
          <dt>XP total</dt>
          <dd>{props.totalXp}</dd>
        </div>
        <div class="summary__item">
          <dt>Déjà vues</dt>
          <dd>
            {props.seen}
            <span class="summary__of">/{bank.length}</span>
          </dd>
        </div>
      </dl>

      <section class="panel-section" aria-labelledby="mastery-title">
        <h2 id="mastery-title" class="section-title">
          Maîtrise par thème
        </h2>
        {courses.map((course) => {
          const lp = levels[course.code];
          return (
            <div key={course.code} class="mastery-group tint" style={{ '--c': course.color }}>
              <div class="mastery-group__head">
                <span class="mastery-group__code">{course.code}</span>
                <span class="mastery-group__level">Niv. {lp.level}</span>
                <span class="mastery-group__xp">{xpByCourse[course.code]} XP</span>
              </div>
              {course.topics.length === 0 ? (
                <p class="hint">Thèmes à venir.</p>
              ) : (
                <ul class="mastery-list">
                  {course.topics.map((t) => {
                    const n = countByTopic.get(t.id) ?? 0;
                    const pct = Math.round(props.masteryOf(t.id) * 100);
                    return (
                      <li key={t.id} class={`mastery-row ${n === 0 ? 'is-empty' : ''}`}>
                        <span class="mastery-row__label">{t.label}</span>
                        <span class="mastery-row__value">{n === 0 ? 'bientôt' : `${pct} %`}</span>
                        <span
                          class="meter meter--wide"
                          role="meter"
                          aria-label={`Maîtrise de ${t.label}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={pct}
                        >
                          <span class="meter__fill" style={{ width: `${pct}%` }} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </section>

      <section class="panel-section" aria-labelledby="flags-title">
        <h2 id="flags-title" class="section-title">
          Questions signalées
        </h2>
        {flagged.length === 0 ? (
          <p class="hint">Aucune. Touche « Signaler » sur une question qui te semble fausse ou mal écrite.</p>
        ) : (
          <>
            <ul class="flag-list">
              {flagged.map((id) => {
                const q = byId.get(id);
                return (
                  <li key={id} class="flag-item">
                    <div class="flag-item__text">
                      <code class="flag-item__id">{id}</code>
                      {q ? (
                        <MathText class="flag-item__prompt" text={q.prompt} />
                      ) : (
                        <span class="flag-item__prompt">Question retirée de la banque.</span>
                      )}
                    </div>
                    <button type="button" class="link-btn link-btn--small" onClick={() => props.onUnflag(id)}>
                      Retirer
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              class="btn btn--small"
              onClick={async () => {
                setCopied(await props.onCopy(flagged.join('\n')));
                setTimeout(() => setCopied(false), 1800);
              }}
            >
              <Icon name={copied ? 'check' : 'copy'} size={18} />
              {copied ? 'Copiés' : 'Copier les ids'}
            </button>
          </>
        )}
      </section>

      <section class="panel-section" aria-labelledby="bank-title">
        <h2 id="bank-title" class="section-title">
          Banque de questions
        </h2>
        <p class="bank-version">
          <strong>
            {props.bankVersion.count} question{props.bankVersion.count > 1 ? 's' : ''}
          </strong>
          <span>version du {builtLabel(props.bankVersion.builtAt)}</span>
        </p>
      </section>
    </main>
  );
}
