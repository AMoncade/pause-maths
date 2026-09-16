// Accès au navigateur, tous gardés : jsdom, iOS (pas de vibrate), navigateurs sans matchMedia.

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let installEvent: InstallPromptEvent | null = null;
const installListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  // Chrome/Edge émettent cet évènement tôt : on l'écoute dès le chargement du module.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e as InstallPromptEvent;
    installListeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    installListeners.forEach((l) => l());
  });
}

export function onInstallAvailability(cb: () => void): () => void {
  installListeners.add(cb);
  return () => installListeners.delete(cb);
}

export function canPromptInstall(): boolean {
  return installEvent !== null;
}

export async function promptInstall(): Promise<boolean> {
  const e = installEvent;
  if (!e) return false;
  await e.prompt();
  const { outcome } = await e.userChoice;
  installEvent = null;
  installListeners.forEach((l) => l());
  return outcome === 'accepted';
}

function media(query: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;
}

export function isStandalone(): boolean {
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { standalone?: boolean }) : null;
  return media('(display-mode: standalone)') || nav?.standalone === true;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function prefersReducedMotion(): boolean {
  return media('(prefers-reduced-motion: reduce)');
}

export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* certains navigateurs refusent hors geste utilisateur */
    }
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* permission refusée */
  }
  return false;
}

/** Demande un stockage persistant une seule fois (évite l'éviction). */
export function requestPersistence(): void {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

/**
 * Accorde <meta name="theme-color"> au fond réel de l'app (clair ou sombre) et suit les changements
 * de thème du système. Renvoie la fonction de nettoyage.
 */
export function followThemeColor(): () => void {
  if (typeof document === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const bg = getComputedStyle(document.body).backgroundColor;
    if (bg) meta.setAttribute('content', bg);
  };
  apply();
  mq.addEventListener('change', apply);
  return () => mq.removeEventListener('change', apply);
}
