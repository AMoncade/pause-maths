// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Progress } from '@/lib/types';

const pwa = vi.hoisted(() => ({ updateCb: null as null | (() => void), applied: 0 }));

vi.mock('@/lib/pwa', () => ({
  initPwa: () => {},
  onUpdateReady: (cb: () => void) => {
    pwa.updateCb = cb;
  },
  applyUpdate: () => {
    pwa.applied += 1;
  },
}));

vi.mock('@/lib/sync', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/sync')>();
  return {
    ...real,
    syncNow: vi.fn(async (p: Progress) => ({ ok: true as const, progress: p })),
    checkSyncCode: vi.fn(async () => ({ ok: true as const, exists: false })),
  };
});

import { App } from '@/app';
import { STORAGE_KEY } from '@/lib/progress';
import { checkSyncCode, syncNow } from '@/lib/sync';
import { defi, memoryStorage, uiBank, uiCourses } from './fixtures';
import { button, click, flush, hasButton, mount, press, type } from './helpers';

const version = { builtAt: 'test', count: uiBank.length };

function app(opts: { bank?: typeof uiBank; storage?: ReturnType<typeof memoryStorage> } = {}) {
  const storage = opts.storage ?? memoryStorage();
  const view = mount(
    <App bank={opts.bank ?? uiBank} courses={uiCourses} bankVersion={version} storage={storage} seed={7} clock={() => Date.UTC(2026, 8, 16, 16)} />,
  );
  return { ...view, storage };
}

/** Répond à la question affichée (juste si possible) sans passer par le clavier. */
function answerCurrent(root: HTMLElement, right = true) {
  if (root.querySelector('.reveal')) {
    click(root.querySelector('.reveal'));
    click(button(root, right ? 'Je savais' : 'Pas su'));
    return;
  }
  const choices = [...root.querySelectorAll<HTMLButtonElement>('.choice')];
  click(choices[right ? 0 : 1]);
  // on ne connaît pas la bonne réponse depuis le DOM : on vérifie seulement le feedback
  expect(root.querySelector('.sheet')).not.toBeNull();
  click(root.querySelector('.sheet .btn--block'));
}

beforeEach(() => {
  pwa.updateCb = null;
  pwa.applied = 0;
  vi.mocked(syncNow).mockClear();
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('App', () => {
  it('banque vide : note sur l’accueil, écran vide explicite', () => {
    const { root } = app({ bank: [] });
    expect(root.querySelector('.modes__note')!.textContent).toContain('banque est encore vide');
    click(button(root, 'Rafale'));
    expect(root.querySelector('.empty__title')!.textContent).toBe('La banque est encore vide');
    click(button(root, 'Retour à l’accueil'));
    expect(root.querySelector('.home')).not.toBeNull();
  });

  it('Rafale → 5 réponses → bilan → Encore 5', () => {
    const { root, storage } = app();
    click(button(root, 'Rafale'));
    for (let i = 0; i < 5; i++) {
      expect(root.querySelector('.play')).not.toBeNull();
      answerCurrent(root);
    }
    expect(root.querySelector('.recap')).not.toBeNull();
    expect(root.querySelector('.recap__score')!.getAttribute('aria-label')).toMatch(/sur 5$/);
    const saved = JSON.parse(storage.map.get(STORAGE_KEY)!) as Progress;
    expect(Object.keys(saved.cards)).toHaveLength(5);
    expect(saved.activeDays).toHaveLength(1);
    click(button(root, 'Encore 5'));
    expect(root.querySelector('.play')).not.toBeNull();
    expect(root.querySelectorAll('.segment.is-ok, .segment.is-miss')).toHaveLength(0);
  });

  it('Rafale plus courte que 5 (banque épuisée) : bilan « Rafale terminée »', () => {
    const { root } = app({ bank: [uiBank[1]!, uiBank[2]!] });
    click(button(root, 'Rafale'));
    answerCurrent(root);
    answerCurrent(root);
    expect(root.querySelector('.recap__title')!.textContent).toMatch(/^Rafale (terminée|parfaite !)$/);
    expect(root.querySelector('.recap__score')!.getAttribute('aria-label')).toMatch(/sur 2$/);
  });

  it('quitter une Rafale entamée : bilan « Pause terminée »', () => {
    const { root } = app();
    click(button(root, 'Rafale'));
    answerCurrent(root);
    click(root.querySelector('[aria-label="Quitter la partie"]'));
    expect(root.querySelector('.recap__title')!.textContent).toBe('Pause terminée');
  });

  it('réinitialiser : cartes effacées après confirmation, réglages gardés', () => {
    const { root, storage } = app();
    click(root.querySelectorAll('.course-tile')[2]);
    click(button(root, 'Rafale'));
    answerCurrent(root);
    click(root.querySelector('[aria-label="Quitter la partie"]'));
    click(button(root, 'Accueil'));
    click(root.querySelector('[aria-label="Réglages"]'));
    click(button(root, 'Réinitialiser la progression'));
    click(button(root, 'Oui, tout effacer'));
    const saved = JSON.parse(storage.map.get(STORAGE_KEY)!) as Progress;
    expect(saved.cards).toEqual({});
    expect(saved.resetAt).toBeTypeOf('number');
    expect(saved.settings.courses).toEqual(['MAT1600']);
  });

  it('raccourcis clavier : 1–4 / V / Espace puis 2, Entrée pour continuer', () => {
    const { root } = app();
    click(button(root, 'Rafale'));
    for (let i = 0; i < 5; i++) {
      if (root.querySelector('.reveal')) {
        press(' ');
        expect(root.querySelector('.flash-answer')).not.toBeNull();
        press('2');
      } else {
        press(root.querySelector('.choices--vf') ? 'v' : '1');
        expect(root.querySelector('.sheet')).not.toBeNull();
        press('Enter');
      }
    }
    expect(root.querySelector('.recap')).not.toBeNull();
    press('Enter');
    expect(root.querySelector('.play')).not.toBeNull();
    press('Escape');
    expect(root.querySelector('.home')).not.toBeNull();
  });

  it('la progression survit à un rechargement', () => {
    const first = app();
    click(button(first.root, 'Rafale'));
    answerCurrent(first.root, false);
    first.unmount();
    const second = app({ storage: first.storage });
    expect(second.root.querySelector('.count-badge')?.textContent ?? '0').not.toBe('0');
  });

  it('Signaler une question l’ajoute aux statistiques', () => {
    const { root, storage } = app();
    click(button(root, 'Rafale'));
    click(root.querySelector('.flag-btn'));
    expect(root.querySelector('.flag-btn')!.textContent).toContain('Signalée');
    const saved = JSON.parse(storage.map.get(STORAGE_KEY)!) as Progress;
    expect(saved.flagged).toHaveLength(1);
    press('Escape');
    click(root.querySelector('[aria-label="Statistiques"]'));
    expect(root.querySelectorAll('.flag-item')).toHaveLength(1);
    expect(root.querySelector('.bank-version')!.textContent).toContain(`${uiBank.length} questions`);
  });

  it('Défi : les questions Défi n’apparaissent qu’avec le commutateur, avec « Voir la solution »', () => {
    const { root } = app({ bank: [defi] });
    click(button(root, 'Rafale'));
    expect(root.querySelector('.empty__title')!.textContent).toBe('Aucune question ici');
    click(button(root, 'Retour à l’accueil'));
    click(root.querySelector('[role="switch"]'));
    expect(root.querySelector('[role="switch"]')!.getAttribute('aria-checked')).toBe('true');
    click(button(root, 'Rafale'));
    expect(root.querySelector('.defi-badge')).not.toBeNull();
    click(root.querySelectorAll('.choice')[0]);
    expect(hasButton(root, 'Voir la solution')).toBe(true);
  });

  it('À revoir : écran « Rien à revoir » tant qu’il n’y a pas d’erreur', () => {
    const { root } = app();
    click(button(root, 'À revoir'));
    expect(root.querySelector('.empty__title')!.textContent).toBe('Rien à revoir');
  });

  it('décocher tous les thèmes d’un cours retire ses questions', () => {
    const { root } = app({ bank: [defi, uiBank[1]!] });
    // uiBank[1] est la seule question non-Défi (MAT1600) : on décoche MAT1600
    click(root.querySelector('[aria-label="Réglages"]'));
    const group = [...root.querySelectorAll('.topic-group')].find((g) => g.textContent?.includes('MAT1600'))!;
    click(button(group, 'Tout décocher'));
    click(root.querySelector('[aria-label="Retour à l’accueil"]'));
    expect(root.querySelector('.modes__note')!.textContent).toContain('Aucune question pour cette sélection');
  });

  it('puces de cours : depuis « Tout », taper un cours ne garde que lui', () => {
    const { root } = app();
    const tiles = () => [...root.querySelectorAll('.course-tile')];
    expect(tiles().every((t) => t.getAttribute('aria-pressed') === 'true')).toBe(true);
    click(tiles()[2]);
    expect(tiles().map((t) => t.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true', 'false']);
    expect(root.querySelector('.home')!.classList.contains('has-accent')).toBe(true);
    click(button(root, 'Tout'));
    expect(tiles().every((t) => t.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('données illisibles : bandeau de récupération', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{pas du json' });
    const { root } = app({ storage });
    expect(root.textContent).toContain('Ta progression était illisible');
  });

  it('écriture impossible : bandeau persistant', () => {
    const storage = memoryStorage();
    storage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    const { root } = app({ storage });
    expect(root.querySelector('.global-banner')!.textContent).toContain('Impossible d’enregistrer');
  });

  it('bandeau d’installation hors standalone, absent en standalone', () => {
    const first = app();
    expect(first.root.textContent).toContain('Installe Pause Maths');
    click(first.root.querySelector('.install [aria-label="Plus tard"]'));
    expect(first.root.textContent).not.toContain('Installe Pause Maths');
    first.unmount();

    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q === '(display-mode: standalone)' })) as never;
    try {
      const second = app();
      expect(second.root.textContent).not.toContain('Installe Pause Maths');
    } finally {
      window.matchMedia = original;
    }
  });

  it('mise à jour en attente : appliquée sur l’accueil, jamais en pleine partie', () => {
    const { root } = app();
    click(button(root, 'Rafale'));
    press('Escape'); // pas de réponse → retour direct à l'accueil
    click(button(root, 'Rafale'));
    expect(pwa.updateCb).not.toBeNull();
    const cb = pwa.updateCb!;
    cb();
    press(' ');
    expect(pwa.applied).toBe(0);
    press('Escape');
    expect(root.querySelector('.home')).not.toBeNull();
    expect(pwa.applied).toBe(1);
  });

  it('synchro : code inconnu refusé avec un message clair, activation puis synchro', async () => {
    const { root } = app();
    click(root.querySelector('[aria-label="Réglages"]'));
    click(button(root, 'J’ai déjà un code'));
    const input = root.querySelector<HTMLInputElement>('#sync-code')!;

    type(input, 'abc');
    click(button(root, 'Relier'));
    await flush();
    expect(root.querySelector('.field-error')!.textContent).toContain('12 caractères');

    type(input, 'k7f2-9qxd-m3pa');
    click(button(root, 'Relier'));
    await flush();
    expect(vi.mocked(checkSyncCode)).toHaveBeenCalledWith('K7F29QXDM3PA');
    expect(root.querySelector('.field-error')!.textContent).toContain('Aucun appareil');

    click(button(root, 'Activer la synchro'));
    await flush();
    expect(root.querySelector('.sync__code')!.textContent).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(vi.mocked(syncNow)).toHaveBeenCalled();
    expect(root.querySelector('.sync__status')!.textContent).toContain('Synchronisé');
  });

  it('synchro à la fin d’une Rafale quand un code est actif', async () => {
    const { root } = app();
    click(root.querySelector('[aria-label="Réglages"]'));
    click(button(root, 'Activer la synchro'));
    await flush();
    click(root.querySelector('[aria-label="Retour à l’accueil"]'));
    vi.mocked(syncNow).mockClear();
    click(button(root, 'Rafale'));
    for (let i = 0; i < 5; i++) answerCurrent(root);
    await flush();
    expect(root.querySelector('.recap')).not.toBeNull();
    expect(vi.mocked(syncNow)).toHaveBeenCalledOnce();
  });
});
