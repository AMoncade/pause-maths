// Outils DOM pour les tests de composants (jsdom + preact/test-utils).
import { render, type ComponentChild } from 'preact';
import { act } from 'preact/test-utils';

export function mount(vnode: ComponentChild) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  act(() => {
    render(vnode, root);
  });
  return {
    root,
    rerender: (next: ComponentChild) =>
      act(() => {
        render(next, root);
      }),
    unmount: () => {
      act(() => {
        render(null, root);
      });
      root.remove();
    },
  };
}

export function click(el: Element | null | undefined) {
  if (!el) throw new Error('élément introuvable');
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

/** Touche envoyée depuis <body>, comme un raccourci tapé sans focus sur un bouton. */
export function press(key: string) {
  act(() => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
}

export function type(input: HTMLInputElement, value: string) {
  act(() => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function button(root: ParentNode, text: string): HTMLButtonElement {
  const found = [...root.querySelectorAll('button')].find((b) => b.textContent?.includes(text));
  if (!found) throw new Error(`bouton « ${text} » introuvable`);
  return found;
}

export function hasButton(root: ParentNode, text: string): boolean {
  return [...root.querySelectorAll('button')].some((b) => b.textContent?.includes(text));
}

/** Laisse passer les promesses (synchro simulée, vérification de code). */
export async function flush() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}
