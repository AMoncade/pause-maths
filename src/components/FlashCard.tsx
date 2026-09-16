import { useEffect, useRef, useState } from 'preact/hooks';
import type { Course, FlashQuestion } from '@/lib/types';
import { MathText } from '@/lib/MathText';
import { CardHeader } from './QuestionCard';
import { Icon } from './Icon';
import { Solution } from './Solution';

interface Props {
  question: FlashQuestion;
  course: Course;
  topicLabel: string;
  revealed: boolean;
  answered: boolean;
  flagged: boolean;
  onFlag: () => void;
  onReveal: () => void;
  onGrade: (knew: boolean) => void;
}

export function FlashCard({ question, course, topicLabel, revealed, answered, flagged, onFlag, onReveal, onGrade }: Props) {
  const [showSolution, setShowSolution] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed) answerRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  return (
    <div class="question tint" style={{ '--c': course.color }}>
      <article class={`card flash ${revealed ? 'is-revealed' : ''}`} aria-labelledby={`prompt-${question.id}`}>
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

        {!revealed ? (
          <button type="button" class="reveal" onClick={onReveal}>
            <Icon name="eye" size={22} />
            <span>Touche pour révéler</span>
            <span class="key key--wide" aria-hidden="true">
              Espace
            </span>
          </button>
        ) : (
          <div class="flash-answer" ref={answerRef} tabIndex={-1} aria-live="polite">
            <p class="flash-answer__main">
              <MathText text={question.answer} />
            </p>
            <ul class="keypoints">
              {question.keyPoints.map((kp, i) => (
                <li key={i}>
                  <Icon name="check" size={16} />
                  <MathText text={kp} />
                </li>
              ))}
            </ul>
            <p class="flash-answer__why">
              <MathText text={question.explanation} />
            </p>
            {question.challenge && question.solution && (
              <>
                <button
                  type="button"
                  class="link-btn"
                  aria-expanded={showSolution}
                  onClick={() => setShowSolution((s) => !s)}
                >
                  {showSolution ? 'Masquer la solution' : 'Voir la solution'}
                  <Icon name="chevron" size={18} class={showSolution ? 'is-flipped' : ''} />
                </button>
                {showSolution && <Solution markdown={question.solution} />}
              </>
            )}
          </div>
        )}
      </article>

      {revealed && (
        <div class="grade" role="group" aria-label="Auto-évaluation">
          <button type="button" class="btn btn--bad-soft" disabled={answered} onClick={() => onGrade(false)}>
            <span class="key" aria-hidden="true">
              1
            </span>
            Pas su
          </button>
          <button type="button" class="btn btn--good" disabled={answered} onClick={() => onGrade(true)}>
            <span class="key" aria-hidden="true">
              2
            </span>
            Je savais
          </button>
        </div>
      )}
    </div>
  );
}
