import type { Course, QcmQuestion, Question, VfQuestion } from '@/lib/types';
import type { Answer } from '@/lib/ui-game';
import { MathText } from '@/lib/MathText';
import { Icon } from './Icon';

interface HeaderProps {
  question: Question;
  course: Course;
  topicLabel: string;
  flagged: boolean;
  onFlag: () => void;
}

export function CardHeader({ question, course, topicLabel, flagged, onFlag }: HeaderProps) {
  return (
    <div class="card-head">
      <span class="card-tag">
        <span class="card-tag__code">{course.code}</span>
        <span class="card-tag__topic">{topicLabel}</span>
        {question.challenge && (
          <span class="defi-badge">
            <Icon name="peak" size={14} />
            Défi
          </span>
        )}
      </span>
      <button
        type="button"
        class="flag-btn"
        aria-pressed={flagged}
        onClick={onFlag}
        title={flagged ? 'Retirer le signalement' : 'Signaler une erreur dans cette question'}
      >
        <Icon name="flag" size={16} />
        <span>{flagged ? 'Signalée' : 'Signaler'}</span>
      </button>
    </div>
  );
}

interface Props {
  question: QcmQuestion | VfQuestion;
  course: Course;
  topicLabel: string;
  order: number[];
  picked: Answer | null;
  flagged: boolean;
  onFlag: () => void;
  onPick: (pick: Answer) => void;
}

export function QuestionCard({ question, course, topicLabel, order, picked, flagged, onFlag, onPick }: Props) {
  const answered = picked !== null;
  return (
    <div class="question tint" style={{ '--c': course.color }}>
      <article class="card" aria-labelledby={`prompt-${question.id}`}>
        <CardHeader
          question={question}
          course={course}
          topicLabel={topicLabel}
          flagged={flagged}
          onFlag={onFlag}
        />
        <p class="prompt" id={`prompt-${question.id}`}>
          <MathText text={question.prompt} />
        </p>
      </article>

      {question.type === 'qcm' ? (
        <div class="choices" role="group" aria-label="Choix de réponse">
          {order.map((idx, pos) => {
            const choice = question.choices[idx]!;
            const state = !answered
              ? ''
              : choice.correct
                ? 'is-correct'
                : picked === idx
                  ? 'is-wrong'
                  : 'is-dim';
            return (
              <button
                key={`${question.id}-${idx}`}
                type="button"
                class={`choice ${state}`}
                disabled={answered}
                onClick={() => onPick(idx)}
              >
                <span class="key" aria-hidden="true">
                  {pos + 1}
                </span>
                <MathText class="choice__text" text={choice.text} />
                {state === 'is-correct' && <Icon class="choice__mark" name="check" size={22} />}
                {state === 'is-wrong' && <Icon class="choice__mark" name="cross" size={22} />}
              </button>
            );
          })}
        </div>
      ) : (
        <div class="choices choices--vf" role="group" aria-label="Vrai ou faux">
          {([true, false] as const).map((value) => {
            const correct = question.answer === value;
            const state = !answered ? '' : correct ? 'is-correct' : picked === value ? 'is-wrong' : 'is-dim';
            return (
              <button
                key={`${question.id}-${value}`}
                type="button"
                class={`choice choice--vf ${state}`}
                disabled={answered}
                onClick={() => onPick(value)}
              >
                <span class="choice__text">{value ? 'Vrai' : 'Faux'}</span>
                <span class="key" aria-hidden="true">
                  {value ? 'V' : 'F'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
