// Propriété du lot PWA. Enregistrement du service worker et gestion des mises à jour.
import { registerSW } from 'virtual:pwa-register';

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // au plus 1 fois par heure

let updateReadyCallback: (() => void) | null = null;
let applyUpdateFn: (() => void) | null = null;
let lastUpdateCheck = 0;

/**
 * Enregistre le service worker. À appeler une seule fois au démarrage de l'app.
 * `registerType: 'prompt'` : aucune mise à jour n'est appliquée tant que
 * `applyUpdate()` n'est pas appelé explicitement (voir onUpdateReady).
 */
export function initPwa(): void {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateReadyCallback?.();
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      lastUpdateCheck = Date.now();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        const now = Date.now();
        if (now - lastUpdateCheck < UPDATE_CHECK_INTERVAL_MS) return;
        lastUpdateCheck = now;
        void registration.update();
      });
    },
  });

  applyUpdateFn = () => {
    void updateSW(true);
  };
}

/** Appelé quand une mise à jour du service worker est prête à être appliquée. */
export function onUpdateReady(cb: () => void): void {
  updateReadyCallback = cb;
}

/**
 * Applique la mise à jour en attente (recharge la page avec le nouveau SW).
 * L'appelant (écran Home ou Recap) choisit le bon moment pour ne pas couper
 * une Rafale en cours.
 */
export function applyUpdate(): void {
  applyUpdateFn?.();
}
