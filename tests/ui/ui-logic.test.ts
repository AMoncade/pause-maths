import { describe, expect, it } from 'vitest';
import { mulberry32 } from '@/lib/scheduler';
import {
  answer,
  comboTier,
  isPerfect,
  missedIds,
  newRound,
  pickLine,
  RAFALE_LENGTH,
  reveal,
  roundOver,
  score,
  shuffledOrder,
  withQuestion,
} from '@/lib/ui-game';
import { keyAction, type KeyContext } from '@/lib/ui-keys';
import { isAll, setCourseTopics, toggleCourse, toggleTopic, withSettings } from '@/lib/ui-select';
import { parseInline, parseMarkdown } from '@/lib/ui-markdown';
import type { CourseCode } from '@/lib/types';
import { defi, flash, qcm, uiCourses, vf } from './fixtures';
import { emptyProgress } from '@/lib/progress';

const rng = () => mulberry32(42);

describe('ui-game', () => {
  it('shuffledOrder est une permutation déterministe pour une graine donnée', () => {
    const a = shuffledOrder(4, rng());
    expect([...a].sort()).toEqual([0, 1, 2, 3]);
    expect(shuffledOrder(4, rng())).toEqual(a);
  });

  it('withQuestion garde le même objet session et y pousse id, cours et thème', () => {
    const r0 = newRound('rafale');
    const session = r0.session;
    const r1 = withQuestion(r0, qcm, rng());
    const r2 = withQuestion(r1, vf, rng());
    expect(r2.session).toBe(session);
    expect(session.shown).toEqual([qcm.id, vf.id]);
    expect(session.lastCourse).toBe('MAT1600');
    expect(session.lastTopic).toBe('mat1600-det');
    expect(r1.order).toHaveLength(4);
    expect(r2.order).toEqual([]);
  });

  it('qcm : bonne réponse = index d’origine du choix correct, combo +1', () => {
    const r = withQuestion(newRound('rafale'), qcm, rng());
    const ok = answer(r, 0);
    expect(ok.ok).toBe(true);
    expect(ok.combo).toBe(1);
    const ko = answer(r, 1);
    expect(ko.ok).toBe(false);
    expect(ko.combo).toBe(0);
  });

  it('vf : compare au booléen answer', () => {
    const r = withQuestion(newRound('rafale'), vf, rng());
    expect(answer(r, false).ok).toBe(true);
    expect(answer(r, true).ok).toBe(false);
  });

  it('une seconde réponse est ignorée', () => {
    const r = answer(withQuestion(newRound('rafale'), vf, rng()), false);
    expect(answer(r, true)).toBe(r);
  });

  it('flash : pas de réponse avant révélation, et le combo ne bouge jamais', () => {
    let r = withQuestion(newRound('sansFin'), vf, rng());
    r = answer(r, false); // combo 1
    r = withQuestion(r, flash, rng());
    expect(answer(r, true)).toBe(r);
    r = reveal(r);
    const knew = answer(r, true);
    expect(knew.ok).toBe(true);
    expect(knew.combo).toBe(1);
    const missed = answer(r, false);
    expect(missed.ok).toBe(false);
    expect(missed.combo).toBe(1);
    expect(missed.results.at(-1)).toMatchObject({ id: flash.id, flash: true, ok: false });
  });

  it('Rafale : finie après 5 réponses, parfaite si tout est juste', () => {
    let r = newRound('rafale');
    for (let i = 0; i < RAFALE_LENGTH; i++) {
      expect(roundOver(r)).toBe(false);
      r = answer(withQuestion(r, { ...vf, id: `v${i}` }, rng()), false);
    }
    expect(roundOver(r)).toBe(true);
    expect(isPerfect(r)).toBe(true);
    expect(r.maxCombo).toBe(5);
    expect(score(r)).toEqual({ correct: 5, total: 5 });
  });

  it('Sans fin n’est jamais « fini » ; missedIds dédoublonne', () => {
    let r = newRound('sansFin');
    for (let i = 0; i < 7; i++) r = answer(withQuestion(r, vf, rng()), true);
    expect(roundOver(r)).toBe(false);
    expect(missedIds(r)).toEqual([vf.id]);
    expect(isPerfect(r)).toBe(false);
  });

  it('comboTier et pickLine', () => {
    expect([0, 1, 2, 4, 5, 9, 10, 30].map(comboTier)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
    expect(pickLine(['a', 'b', 'c'], 'x')).toBe(pickLine(['a', 'b', 'c'], 'x'));
  });
});

describe('ui-keys', () => {
  const play = (over: Partial<KeyContext>): KeyContext => ({
    screen: 'play',
    type: 'qcm',
    answered: false,
    revealed: false,
    ...over,
  });

  it('1–4 répondent à un qcm, pas à un vf après réponse', () => {
    expect(keyAction(play({}), { key: '3' })).toEqual({ kind: 'choose', index: 2 });
    expect(keyAction(play({}), { key: '5' })).toBeNull();
    expect(keyAction(play({ answered: true }), { key: '1' })).toBeNull();
  });

  it('V/F (et 1/2) pour vrai/faux', () => {
    expect(keyAction(play({ type: 'vf' }), { key: 'v' })).toEqual({ kind: 'vf', value: true });
    expect(keyAction(play({ type: 'vf' }), { key: 'F' })).toEqual({ kind: 'vf', value: false });
    expect(keyAction(play({ type: 'vf' }), { key: '2' })).toEqual({ kind: 'vf', value: false });
  });

  it('Espace révèle une flash, puis 1 = Pas su, 2 = Je savais', () => {
    expect(keyAction(play({ type: 'flash' }), { key: ' ' })).toEqual({ kind: 'reveal' });
    expect(keyAction(play({ type: 'flash' }), { key: '1' })).toBeNull();
    expect(keyAction(play({ type: 'flash', revealed: true }), { key: '1' })).toEqual({ kind: 'grade', knew: false });
    expect(keyAction(play({ type: 'flash', revealed: true }), { key: '2' })).toEqual({ kind: 'grade', knew: true });
  });

  it('Entrée passe à la suite après réponse, et lance « Encore » sur le bilan', () => {
    expect(keyAction(play({ answered: true }), { key: 'Enter' })).toEqual({ kind: 'next' });
    expect(keyAction(play({}), { key: 'Enter' })).toBeNull();
    expect(keyAction({ screen: 'recap', answered: false, revealed: false }, { key: 'Enter' })).toEqual({
      kind: 'primary',
    });
  });

  it('ignore modificateurs, champs de saisie, et Entrée/Espace sur un bouton focalisé', () => {
    expect(keyAction(play({}), { key: '1', ctrlKey: true })).toBeNull();
    expect(keyAction(play({}), { key: '1', inField: true })).toBeNull();
    expect(keyAction(play({ answered: true }), { key: 'Enter', onControl: true })).toBeNull();
    expect(keyAction(play({}), { key: '2', onControl: true })).toEqual({ kind: 'choose', index: 1 });
  });

  it('Échap revient en arrière hors de l’accueil', () => {
    expect(keyAction(play({}), { key: 'Escape' })).toEqual({ kind: 'back' });
    expect(keyAction({ screen: 'home', answered: false, revealed: false }, { key: 'Escape' })).toBeNull();
  });
});

describe('ui-select', () => {
  const all: CourseCode[] = ['MAT1400', 'MAT1500', 'MAT1600', 'STT1700'];

  it('depuis « Tout », taper un cours ne garde que lui', () => {
    expect(toggleCourse(all, 'MAT1600', all)).toEqual(['MAT1600']);
  });

  it('bascule un cours et garde l’ordre des puces', () => {
    expect(toggleCourse(['MAT1600'], 'MAT1400', all)).toEqual(['MAT1400', 'MAT1600']);
    expect(toggleCourse(['MAT1400', 'MAT1600'], 'MAT1400', all)).toEqual(['MAT1600']);
  });

  it('retirer le dernier cours revient à « Tout »', () => {
    const next = toggleCourse(['STT1700'], 'STT1700', all);
    expect(next).toEqual(all);
    expect(isAll(next, all)).toBe(true);
  });

  it('thèmes : bascule un thème, coche ou décoche un cours entier', () => {
    expect(toggleTopic(['a', 'b'], 'a')).toEqual(['b']);
    expect(toggleTopic(['b'], 'a')).toEqual(['b', 'a']);
    const course = uiCourses[0]!;
    expect(setCourseTopics(['x'], course, true)).toEqual(['x', 'mat1400-part', 'mat1400-lagr']);
    expect(setCourseTopics(['x', 'mat1400-part'], course, false)).toEqual(['x']);
  });

  it('withSettings met updatedAt à jour', () => {
    const p = emptyProgress(1, uiCourses);
    const q = withSettings(p, { challenge: true }, 99);
    expect(q.settings.challenge).toBe(true);
    expect(q.settings.updatedAt).toBe(99);
    expect(p.settings.challenge).toBe(false);
  });
});

describe('ui-markdown', () => {
  it('lit une solution multi-lignes numérotée', () => {
    expect(parseMarkdown(defi.solution!)).toEqual([
      {
        kind: 'ol',
        start: 1,
        items: [
          '$\\nabla(xy) = \\lambda \\nabla(x+y)$ donne $y = x$.',
          'Avec $x + y = 2$ : $x = y = 1$.',
          '**Maximum** : $1$.',
        ],
      },
    ]);
  });

  it('découpe une solution d’une seule ligne « 1. … 2. … » seulement si les numéros se suivent', () => {
    expect(parseMarkdown('1. Poser $a = 2$. 2. Calculer $a^2$. 3. Conclure.')).toEqual([
      { kind: 'ol', start: 1, items: ['Poser $a = 2$.', 'Calculer $a^2$.', 'Conclure.'] },
    ]);
    expect(parseMarkdown('On trouve 3. Puis rien.')).toEqual([{ kind: 'p', text: 'On trouve 3. Puis rien.' }]);
  });

  it('paragraphes, puces, titres', () => {
    expect(parseMarkdown('# Idée\nUne ligne\nqui continue.\n\n- a\n- b')).toEqual([
      { kind: 'h', text: 'Idée' },
      { kind: 'p', text: 'Une ligne qui continue.' },
      { kind: 'ul', items: ['a', 'b'] },
    ]);
  });

  it('gras, italique, code ; les * dans une formule restent intacts', () => {
    expect(parseInline('**gras** et *ital* et `code` et $a*b*c$')).toEqual([
      { kind: 'strong', value: 'gras' },
      { kind: 'text', value: ' et ' },
      { kind: 'em', value: 'ital' },
      { kind: 'text', value: ' et ' },
      { kind: 'code', value: 'code' },
      { kind: 'text', value: ' et $a*b*c$' },
    ]);
  });

  it('un dollar échappé reste échappé', () => {
    expect(parseInline('coûte 5 \\$ **net**')).toEqual([
      { kind: 'text', value: 'coûte 5 \\$ ' },
      { kind: 'strong', value: 'net' },
    ]);
  });
});
