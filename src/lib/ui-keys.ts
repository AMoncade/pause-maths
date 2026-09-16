// Raccourcis clavier desktop — logique pure, testée dans tests/ui/ui-keys.test.ts.
import type { QuestionType } from './types';

export type Screen = 'home' | 'play' | 'recap' | 'empty' | 'settings' | 'stats';

export interface KeyContext {
  screen: Screen;
  type?: QuestionType;
  answered: boolean;
  revealed: boolean;
}

export type KeyAction =
  | { kind: 'choose'; index: number }
  | { kind: 'vf'; value: boolean }
  | { kind: 'reveal' }
  | { kind: 'grade'; knew: boolean }
  | { kind: 'next' }
  | { kind: 'primary' }
  | { kind: 'back' };

export interface KeyInput {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  /** la cible active est un champ de saisie : on ne capte rien */
  inField?: boolean;
  /** la cible active est un bouton ou un lien : Entrée et Espace l'activent déjà */
  onControl?: boolean;
}

export function keyAction(ctx: KeyContext, input: KeyInput): KeyAction | null {
  if (input.ctrlKey || input.metaKey || input.altKey || input.inField) return null;
  const k = input.key;
  const activates = k === 'Enter' || k === ' ';
  if (activates && input.onControl) return null;

  if (k === 'Escape') {
    return ctx.screen === 'home' ? null : { kind: 'back' };
  }

  if (ctx.screen === 'recap' || ctx.screen === 'empty') {
    return k === 'Enter' ? { kind: 'primary' } : null;
  }
  if (ctx.screen !== 'play' || !ctx.type) return null;

  if (ctx.answered) return k === 'Enter' ? { kind: 'next' } : null;

  switch (ctx.type) {
    case 'qcm':
      if (/^[1-4]$/.test(k)) return { kind: 'choose', index: Number(k) - 1 };
      return null;
    case 'vf': {
      const low = k.toLowerCase();
      if (low === 'v' || k === '1') return { kind: 'vf', value: true };
      if (low === 'f' || k === '2') return { kind: 'vf', value: false };
      return null;
    }
    case 'flash':
      if (!ctx.revealed) return k === ' ' ? { kind: 'reveal' } : null;
      if (k === '1') return { kind: 'grade', knew: false };
      if (k === '2') return { kind: 'grade', knew: true };
      return null;
  }
}
