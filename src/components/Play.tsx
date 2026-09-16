import type { Course, CourseCode } from '@/lib/types';
import { comboTier, isAnswered, RAFALE_LENGTH, type Answer, type Round } from '@/lib/ui-game';
import { Icon } from './Icon';
import { QuestionCard } from './QuestionCard';
import { FlashCard } from './FlashCard';
import { Feedback } from './Feedback';

interface Props {
  round: Round;
  courseByCode: Record<CourseCode, Course>;
  topicLabel: (id: string) => string;
  flagged: boolean;
  onFlag: () => void;
  onPick: (pick: Answer) => void;
  onReveal: () => void;
  onNext: () => void;
  onQuit: () => void;
}

export function Play({ round, courseByCode, topicLabel, flagged, onFlag, onPick, onReveal, onNext, onQuit }: Props) {
  const q = round.question!;
  const course = courseByCode[q.course];
  const answered = isAnswered(round);
  const last = round.mode === 'rafale' && round.results.length >= RAFALE_LENGTH;
  const tier = comboTier(round.combo);

  return (
    <main class={`screen play ${answered && q.type !== 'flash' ? 'is-answered' : ''}`}>
      <header class="play-bar">
        <button type="button" class="icon-btn" onClick={onQuit} aria-label="Quitter la partie">
          <Icon name="close" />
        </button>

        {round.mode === 'rafale' ? (
          <ol class="segments" aria-label={`Question ${Math.min(round.results.length + (answered ? 0 : 1), RAFALE_LENGTH)} sur ${RAFALE_LENGTH}`}>
            {Array.from({ length: RAFALE_LENGTH }, (_, i) => {
              const r = round.results[i];
              const current = i === round.results.length && !answered;
              const color = r ? courseByCode[r.course].color : current ? course.color : undefined;
              return (
                <li
                  key={i}
                  class={`segment ${r ? (r.ok ? 'is-ok' : 'is-miss') : ''} ${current ? 'is-current' : ''}`}
                  style={color ? { '--c': color } : undefined}
                />
              );
            })}
          </ol>
        ) : (
          <p class="play-count">
            <span class="play-count__mode">{round.mode === 'sansFin' ? 'Sans fin' : 'À revoir'}</span>
            <span class="play-count__n">
              {round.results.length} {round.results.length > 1 ? 'réponses' : 'réponse'}
            </span>
          </p>
        )}

        <div
          class={`combo combo--t${tier}`}
          aria-live="polite"
          aria-label={tier > 0 ? `Combo de ${round.combo}` : 'Pas de combo'}
        >
          {tier > 0 && (
            <>
              <Icon name="flame" size={26} class="combo__flame" />
              <span key={round.combo} class="combo__n">
                {round.combo}
              </span>
            </>
          )}
        </div>
      </header>

      <div class="play-body" key={q.id}>
        {q.type === 'flash' ? (
          <FlashCard
            question={q}
            course={course}
            topicLabel={topicLabel(q.topic)}
            revealed={round.revealed}
            answered={answered}
            flagged={flagged}
            onFlag={onFlag}
            onReveal={onReveal}
            onGrade={(knew) => onPick(knew)}
          />
        ) : (
          <QuestionCard
            question={q}
            course={course}
            topicLabel={topicLabel(q.topic)}
            order={round.order}
            picked={round.picked}
            flagged={flagged}
            onFlag={onFlag}
            onPick={onPick}
          />
        )}
      </div>

      {answered && q.type !== 'flash' && (
        <Feedback key={q.id} question={q} picked={round.picked!} ok={round.ok!} last={last} onNext={onNext} />
      )}
    </main>
  );
}
