import { useEffect, useRef } from 'preact/hooks';
import type { Course, CourseCode, Question } from '@/lib/types';
import { isPerfect, missedIds, score, type Round } from '@/lib/ui-game';
import { MathText } from '@/lib/MathText';
import { Icon } from './Icon';
import { Confetti } from './Confetti';

export interface LevelUp {
  course: Course;
  level: number;
}

interface Props {
  round: Round;
  questionById: (id: string) => Question | undefined;
  courseByCode: Record<CourseCode, Course>;
  xpGained: number;
  levelUps: LevelUp[];
  onAgain: () => void;
  onHome: () => void;
}

function title(round: Round, perfect: boolean): string {
  switch (round.mode) {
    case 'rafale':
      if (perfect) return 'Rafale parfaite !';
      return round.ended === 'quit' ? 'Pause terminée' : 'Rafale terminée';
    case 'sansFin':
      return 'Session terminée';
    case 'aRevoir':
      return missedIds(round).length === 0 ? 'Tout est revu !' : 'Révision terminée';
  }
}

function againLabel(round: Round): string {
  switch (round.mode) {
    case 'rafale':
      return 'Encore 5';
    case 'sansFin':
      return 'Continuer';
    case 'aRevoir':
      return 'Réviser encore';
  }
}

export function Recap({ round, questionById, courseByCode, xpGained, levelUps, onAgain, onHome }: Props) {
  const perfect = isPerfect(round);
  const { correct, total } = score(round);
  const missed = missedIds(round)
    .map(questionById)
    .filter((q): q is Question => q !== undefined);
  const colors = [...new Set(round.results.map((r) => courseByCode[r.course].color))];
  const againRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    againRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main class={`screen recap ${perfect ? 'is-perfect' : ''}`}>
      {perfect && <Confetti colors={colors} />}

      <div class="recap__hero">
        <h1 class="recap__title">{title(round, perfect)}</h1>
        <p class="recap__score" aria-label={`${correct} bonnes réponses sur ${total}`}>
          <span class="recap__score-n">{correct}</span>
          <span class="recap__score-d">/{total}</span>
        </p>
        <ul class="recap__dots" aria-hidden="true">
          {round.results.map((r, i) => (
            <li
              key={i}
              class={`recap__dot ${r.ok ? 'is-ok' : 'is-miss'}`}
              style={{ '--c': courseByCode[r.course].color }}
            />
          ))}
        </ul>
      </div>

      <dl class="recap__stats">
        <div class="stat">
          <dt>Combo max</dt>
          <dd>
            <Icon name="flame" size={22} class="stat__flame" />
            {round.maxCombo}
          </dd>
        </div>
        <div class="stat">
          <dt>XP gagné</dt>
          <dd>+{xpGained}</dd>
        </div>
      </dl>

      {levelUps.length > 0 && (
        <ul class="levelups">
          {levelUps.map((lu) => (
            <li key={lu.course.code} class="levelup tint" style={{ '--c': lu.course.color }}>
              <span class="levelup__badge">{lu.level}</span>
              <span>
                <strong>{lu.course.code}</strong> passe au niveau {lu.level}
              </span>
            </li>
          ))}
        </ul>
      )}

      {missed.length > 0 && (
        <section class="recap__review" aria-labelledby="review-title">
          <h2 id="review-title" class="section-title">
            À revoir
          </h2>
          <ul class="review-list">
            {missed.map((q) => (
              <li key={q.id} class="review-item tint" style={{ '--c': courseByCode[q.course].color }}>
                <span class="review-item__code">{q.course}</span>
                <MathText class="review-item__prompt" text={q.prompt} />
              </li>
            ))}
          </ul>
          <p class="hint">Elles reviendront bientôt, et dans le mode « À revoir ».</p>
        </section>
      )}

      <div class="recap__actions">
        <button ref={againRef} type="button" class="btn btn--block btn--accent" onClick={onAgain}>
          {againLabel(round)}
          <span class="key key--on-fill" aria-hidden="true">
            Entrée
          </span>
        </button>
        <button type="button" class="btn btn--block btn--quiet" onClick={onHome}>
          Accueil
        </button>
      </div>
    </main>
  );
}
