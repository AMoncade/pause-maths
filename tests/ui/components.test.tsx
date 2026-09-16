// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MathText } from '@/lib/MathText';
import { QuestionCard } from '@/components/QuestionCard';
import { Feedback } from '@/components/Feedback';
import { FlashCard } from '@/components/FlashCard';
import { Solution } from '@/components/Solution';
import { Recap } from '@/components/Recap';
import { Stats } from '@/components/Stats';
import { answer, newRound, withQuestion } from '@/lib/ui-game';
import { mulberry32 } from '@/lib/scheduler';
import type { Course, CourseCode } from '@/lib/types';
import { defi, flash, qcm, uiBank, uiCourses, vf } from './fixtures';
import { button, click, hasButton, mount } from './helpers';

const courseByCode = Object.fromEntries(uiCourses.map((c) => [c.code, c])) as Record<CourseCode, Course>;
const noop = () => {};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('MathText', () => {
  it('rend les formules avec KaTeX et échappe le texte', () => {
    const { root } = mount(<MathText text={'<b>gras</b> et $x^2$ puis $$\\int_0^1 x\\,dx$$'} />);
    expect(root.querySelector('b')).toBeNull();
    expect(root.textContent).toContain('<b>gras</b>');
    expect(root.querySelector('.math-inline .katex')).not.toBeNull();
    expect(root.querySelector('.math-display .katex-display')).not.toBeNull();
  });

  it('une formule invalide ne casse pas le rendu', () => {
    const { root } = mount(<MathText text={'avant $\\frac{1$ après'} />);
    expect(root.textContent).toContain('avant');
    expect(root.textContent).toContain('après');
  });
});

describe('QuestionCard', () => {
  it('vf : toujours « Vrai » puis « Faux »', () => {
    const { root } = mount(
      <QuestionCard question={vf} course={courseByCode.MAT1600} topicLabel="Déterminants" order={[]} picked={null} flagged={false} onFlag={noop} onPick={noop} />,
    );
    const labels = [...root.querySelectorAll('.choice .choice__text')].map((e) => e.textContent);
    expect(labels).toEqual(['Vrai', 'Faux']);
  });

  it('qcm : 4 choix dans l’ordre mélangé, taper renvoie l’index d’origine', () => {
    const onPick = vi.fn();
    const order = [2, 0, 3, 1];
    const { root } = mount(
      <QuestionCard question={qcm} course={courseByCode.MAT1400} topicLabel="x" order={order} picked={null} flagged={false} onFlag={noop} onPick={onPick} />,
    );
    const choices = root.querySelectorAll('.choice');
    expect(choices).toHaveLength(4);
    click(choices[1]);
    expect(onPick).toHaveBeenCalledWith(0);
  });

  it('après réponse fausse : le choix tapé est marqué faux, le bon est marqué juste, tout est désactivé', () => {
    const { root } = mount(
      <QuestionCard question={qcm} course={courseByCode.MAT1400} topicLabel="x" order={[0, 1, 2, 3]} picked={1} flagged={false} onFlag={noop} onPick={noop} />,
    );
    const choices = [...root.querySelectorAll<HTMLButtonElement>('.choice')];
    expect(choices[0]!.classList.contains('is-correct')).toBe(true);
    expect(choices[1]!.classList.contains('is-wrong')).toBe(true);
    expect(choices[2]!.classList.contains('is-dim')).toBe(true);
    expect(choices.every((c) => c.disabled)).toBe(true);
  });

  it('bouton Signaler : aria-pressed et libellé suivent l’état', () => {
    const onFlag = vi.fn();
    const { root } = mount(
      <QuestionCard question={vf} course={courseByCode.MAT1600} topicLabel="x" order={[]} picked={null} flagged onFlag={onFlag} onPick={noop} />,
    );
    const flag = root.querySelector('.flag-btn')!;
    expect(flag.getAttribute('aria-pressed')).toBe('true');
    expect(flag.textContent).toContain('Signalée');
    click(flag);
    expect(onFlag).toHaveBeenCalledOnce();
  });
});

describe('Feedback', () => {
  it('mauvaise réponse qcm : bonne réponse, `why` du choix tapé, explication', () => {
    const { root } = mount(<Feedback question={qcm} picked={2} ok={false} last={false} onNext={noop} />);
    expect(root.querySelector('.sheet--bad')).not.toBeNull();
    expect(root.querySelector('.sheet__why')!.textContent).toContain('Le facteur');
    expect(root.querySelector('.sheet__explain')!.textContent).toContain('constante');
    expect(root.querySelector('.sheet__answer .katex')).not.toBeNull();
    expect(hasButton(root, 'Voir la solution')).toBe(false);
  });

  it('bonne réponse : pas de `why`, bouton Continuer (ou « Voir le bilan » en fin de Rafale)', () => {
    const onNext = vi.fn();
    const { root } = mount(<Feedback question={vf} picked={false} ok last onNext={onNext} />);
    expect(root.querySelector('.sheet--good')).not.toBeNull();
    expect(root.querySelector('.sheet__why')).toBeNull();
    click(button(root, 'Voir le bilan'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('question Défi : « Voir la solution » déplie les étapes', () => {
    const { root } = mount(<Feedback question={defi} picked={0} ok last={false} onNext={noop} />);
    click(button(root, 'Voir la solution'));
    const steps = root.querySelectorAll('.solution__steps li');
    expect(steps).toHaveLength(3);
    expect(steps[2]!.querySelector('strong')!.textContent).toBe('Maximum');
    expect(hasButton(root, 'Masquer la solution')).toBe(true);
  });
});

describe('FlashCard', () => {
  it('taper pour révéler, puis « Je savais » / « Pas su »', () => {
    const onReveal = vi.fn();
    const onGrade = vi.fn();
    const props = {
      question: flash,
      course: courseByCode.MAT1500,
      topicLabel: 'Logique',
      answered: false,
      flagged: false,
      onFlag: noop,
      onReveal,
      onGrade,
    };
    const view = mount(<FlashCard {...props} revealed={false} />);
    expect(hasButton(view.root, 'Je savais')).toBe(false);
    click(button(view.root, 'Touche pour révéler'));
    expect(onReveal).toHaveBeenCalledOnce();

    view.rerender(<FlashCard {...props} revealed />);
    expect(view.root.querySelectorAll('.keypoints li')).toHaveLength(2);
    click(button(view.root, 'Pas su'));
    click(button(view.root, 'Je savais'));
    expect(onGrade.mock.calls).toEqual([[false], [true]]);
  });
});

describe('Solution', () => {
  it('rend paragraphes et formules', () => {
    const { root } = mount(<Solution markdown={'Idée : poser $t = x^2$.\n\n- puis dériver'} />);
    expect(root.querySelector('p .katex')).not.toBeNull();
    expect(root.querySelector('.solution__list li')!.textContent).toBe('puis dériver');
  });
});

describe('Recap', () => {
  const play = (oks: boolean[]) => {
    let r = newRound('rafale');
    oks.forEach((ok, i) => {
      r = withQuestion(r, { ...vf, id: `mat1600-det-10${i}` }, mulberry32(1));
      r = answer(r, ok ? vf.answer : !vf.answer);
    });
    return { ...r, ended: 'done' as const };
  };

  it('score, combo max, XP, cartes à revoir, « Encore 5 »', () => {
    const r = play([true, false, true, true, false]);
    const onAgain = vi.fn();
    const { root } = mount(
      <Recap round={r} questionById={(id) => ({ ...vf, id })} courseByCode={courseByCode} xpGained={35} levelUps={[]} onAgain={onAgain} onHome={noop} />,
    );
    expect(root.querySelector('.recap__title')!.textContent).toBe('Rafale terminée');
    expect(root.querySelector('.recap__score')!.getAttribute('aria-label')).toBe('3 bonnes réponses sur 5');
    expect(root.textContent).toContain('+35');
    expect(root.querySelectorAll('.review-item')).toHaveLength(2);
    expect(root.querySelector('.confetti')).toBeNull();
    click(button(root, 'Encore 5'));
    expect(onAgain).toHaveBeenCalledOnce();
  });

  it('Rafale quittée avant la fin : « Pause terminée », jamais parfaite', () => {
    const r = { ...play([true, true]), ended: 'quit' as const };
    const { root } = mount(
      <Recap round={r} questionById={() => undefined} courseByCode={courseByCode} xpGained={20} levelUps={[]} onAgain={noop} onHome={noop} />,
    );
    expect(root.querySelector('.recap__title')!.textContent).toBe('Pause terminée');
    expect(root.querySelector('.confetti')).toBeNull();
  });

  it('Rafale parfaite : titre et confettis (mouvement non réduit)', () => {
    const { root } = mount(
      <Recap round={play([true, true, true, true, true])} questionById={() => undefined} courseByCode={courseByCode} xpGained={50} levelUps={[{ course: courseByCode.MAT1600, level: 2 }]} onAgain={noop} onHome={noop} />,
    );
    expect(root.querySelector('.recap__title')!.textContent).toBe('Rafale parfaite !');
    expect(root.querySelectorAll('.confetti__piece').length).toBeGreaterThan(0);
    expect(root.querySelector('.levelup')!.textContent).toContain('passe au niveau 2');
    expect(root.querySelector('.recap__review')).toBeNull();
  });

  it('Rafale parfaite avec prefers-reduced-motion : pas de confettis', () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) as never;
    try {
      const { root } = mount(
        <Recap round={play([true, true, true, true, true])} questionById={() => undefined} courseByCode={courseByCode} xpGained={50} levelUps={[]} onAgain={noop} onHome={noop} />,
      );
      expect(root.querySelector('.recap__title')!.textContent).toBe('Rafale parfaite !');
      expect(root.querySelector('.confetti')).toBeNull();
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('Stats', () => {
  it('version de la banque, signalements, maîtrise par thème', () => {
    const onUnflag = vi.fn();
    const { root } = mount(
      <Stats
        courses={uiCourses}
        bank={uiBank}
        flagged={[qcm.id, 'mat1400-part-999']}
        streakDays={3}
        totalXp={120}
        seen={2}
        levels={Object.fromEntries(uiCourses.map((c) => [c.code, { level: 1, into: 0, span: 100 }])) as never}
        xpByCourse={Object.fromEntries(uiCourses.map((c) => [c.code, 0])) as never}
        masteryOf={(id) => (id === 'mat1600-det' ? 0.5 : 0)}
        bankVersion={{ builtAt: '2026-09-16T22:00:00.000Z', count: uiBank.length }}
        onUnflag={onUnflag}
        onCopy={async () => true}
        onBack={noop}
      />,
    );
    expect(root.querySelector('.bank-version')!.textContent).toContain(`${uiBank.length} questions`);
    expect(root.querySelector('.bank-version')!.textContent).toContain('2026');
    const items = root.querySelectorAll('.flag-item');
    expect(items).toHaveLength(2);
    expect(items[1]!.textContent).toContain('retirée');
    click(button(items[0]!, 'Retirer'));
    expect(onUnflag).toHaveBeenCalledWith(qcm.id);
    const det = [...root.querySelectorAll('.mastery-row')].find((r) => r.textContent?.includes('Déterminants'))!;
    expect(det.textContent).toContain('50 %');
    expect(root.textContent).toContain('Thèmes à venir.');
  });
});
