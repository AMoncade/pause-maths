import { useEffect, useRef, useState } from 'preact/hooks';
import type { QcmQuestion, VfQuestion } from '@/lib/types';
import { pickLine, type Answer } from '@/lib/ui-game';
import { MathText } from '@/lib/MathText';
import { Icon } from './Icon';
import { Solution } from './Solution';

const GOOD = ['Bien joué !', 'Exact !', 'C’est ça !', 'Parfait !'] as const;
const BAD = ['Pas tout à fait', 'Presque…', 'Raté, cette fois'] as const;

interface Props {
  question: QcmQuestion | VfQuestion;
  picked: Answer;
  ok: boolean;
  last: boolean;
  onNext: () => void;
}

export function Feedback({ question, picked, ok, last, onNext }: Props) {
  const [showSolution, setShowSolution] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, []);

  const wrongChoice = question.type === 'qcm' && typeof picked === 'number' ? question.choices[picked] : undefined;
  const correctChoice = question.type === 'qcm' ? question.choices.find((c) => c.correct) : undefined;

  return (
    <section class={`sheet ${ok ? 'sheet--good' : 'sheet--bad'}`} aria-labelledby="feedback-title">
      <div class="sheet__inner">
        <div class="sheet__head" role="status">
          <span class="sheet__badge" aria-hidden="true">
            <Icon name={ok ? 'check' : 'cross'} size={22} />
          </span>
          <h2 id="feedback-title" class="sheet__title">
            {ok ? pickLine(GOOD, question.id) : pickLine(BAD, question.id)}
          </h2>
        </div>

        <div class="sheet__body">
          {!ok && question.type === 'qcm' && correctChoice && (
            <p class="sheet__answer">
              <span class="sheet__label">Bonne réponse</span>
              <MathText text={correctChoice.text} />
            </p>
          )}
          {!ok && question.type === 'vf' && (
            <p class="sheet__answer">
              <span class="sheet__label">Bonne réponse</span>
              {question.answer ? 'Vrai' : 'Faux'}
            </p>
          )}
          {!ok && wrongChoice?.why && (
            <p class="sheet__why">
              <MathText text={wrongChoice.why} />
            </p>
          )}
          <p class="sheet__explain">
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

        <button
          ref={nextRef}
          type="button"
          class={`btn btn--block ${ok ? 'btn--good' : 'btn--bad'}`}
          onClick={onNext}
        >
          {last ? 'Voir le bilan' : 'Continuer'}
          <span class="key key--on-fill" aria-hidden="true">
            Entrée
          </span>
        </button>
      </div>
    </section>
  );
}
