// Propriété du lot PWA. Code de synchro, appels réseau vers api/sync, fusion.
import type { Progress } from '@/lib/types';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 caractères, sans 0/O/1/I
const CODE_LENGTH = 12;
const MAX_BODY_BYTES = 200_000;

export function generateSyncCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return code;
}

export function formatSyncCode(code: string): string {
  return code.match(/.{1,4}/g)?.join('-') ?? code;
}

/** Nettoie un code saisi par l'utilisateur (espaces/tirets, casse) et le valide. */
export function normalizeSyncCode(input: string): string | null {
  const cleaned = input.trim().toUpperCase().replace(/[\s-]/g, '');
  if (cleaned.length !== CODE_LENGTH) return null;
  for (const ch of cleaned) {
    if (!ALPHABET.includes(ch)) return null;
  }
  return cleaned;
}

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Fusion temporaire, en attendant `src/lib/merge.ts` (lot Engine, pas encore
 * poussé). Implémente l'algorithme documenté dans HANDOFF.md §7 "merge.ts" :
 * par carte on garde l'entrée avec le `at` le plus récent, `activeDays` et
 * `flagged` sont unis, `settings` est celui avec le `updatedAt` le plus récent.
 * À remplacer par `import { merge } from './merge'` dès que ce fichier existe
 * (une ligne à changer ci-dessous, signature identique).
 */
function tempMerge(a: Progress, b: Progress): Progress {
  const cards: Progress['cards'] = { ...a.cards };
  for (const [id, card] of Object.entries(b.cards)) {
    const existing = cards[id];
    if (!existing || card.at >= existing.at) cards[id] = card;
  }
  return {
    v: 1,
    cards,
    activeDays: Array.from(new Set([...a.activeDays, ...b.activeDays])).sort(),
    settings: a.settings.updatedAt >= b.settings.updatedAt ? a.settings : b.settings,
    flagged: Array.from(new Set([...a.flagged, ...b.flagged])),
    syncCode: a.syncCode ?? b.syncCode,
  };
}

function isProgress(value: unknown): value is Progress {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return p.v === 1 && typeof p.cards === 'object' && p.cards !== null && Array.isArray(p.activeDays);
}

type SyncResult = { ok: true; progress: Progress } | { ok: false; error: string };

/**
 * Vérifie qu'un code existe déjà côté serveur, sans rien modifier. À utiliser
 * par l'écran "Entrer un code" avant de l'assigner à `progress.syncCode`, pour
 * donner une erreur claire sur une faute de frappe plutôt qu'activer un
 * nouveau code vide par accident.
 */
export async function checkSyncCode(code: string): Promise<{ ok: true; exists: boolean } | { ok: false; error: string }> {
  try {
    const key = await hashCode(code);
    const res = await fetch(`/api/sync?key=${key}`);
    if (res.status === 404) return { ok: true, exists: false };
    if (!res.ok) return { ok: false, error: `Erreur serveur (${res.status}).` };
    return { ok: true, exists: true };
  } catch {
    return { ok: false, error: 'Hors ligne : impossible de vérifier ce code.' };
  }
}

/**
 * Synchronise `p` avec le serveur : GET l'état distant, fusionne, PUT le
 * résultat. `p.syncCode` doit être défini. Sans réseau, ou si le blob dépasse
 * la limite, l'appelant garde l'état local tel quel (aucune donnée perdue).
 */
export async function syncNow(p: Progress): Promise<SyncResult> {
  if (!p.syncCode) return { ok: false, error: 'Aucun code de synchro actif.' };

  const body = JSON.stringify(p);
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return { ok: false, error: 'Progression trop grosse pour synchroniser.' };
  }

  let key: string;
  try {
    key = await hashCode(p.syncCode);
  } catch {
    return { ok: false, error: 'Impossible de calculer la clé de synchro.' };
  }

  let merged = p;
  try {
    const getRes = await fetch(`/api/sync?key=${key}`);
    if (getRes.ok) {
      const remoteJson: unknown = await getRes.json();
      if (isProgress(remoteJson)) {
        merged = tempMerge(p, remoteJson);
      }
    } else if (getRes.status !== 404) {
      return { ok: false, error: `Erreur serveur (${getRes.status}).` };
    }
    // 404 : rien côté serveur pour ce code pour l'instant — première synchro, on pousse l'état local.

    const putRes = await fetch(`/api/sync?key=${key}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(merged),
    });
    if (!putRes.ok) {
      if (putRes.status === 413) return { ok: false, error: 'Progression trop grosse pour synchroniser.' };
      if (putRes.status === 429) return { ok: false, error: 'Trop de synchros récentes, réessaie dans un instant.' };
      return { ok: false, error: `Erreur serveur (${putRes.status}).` };
    }
  } catch {
    return { ok: false, error: 'Hors ligne : la synchro reprendra à la reconnexion.' };
  }

  return { ok: true, progress: merged };
}
