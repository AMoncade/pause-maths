// Propriété du lot PWA. Code de synchro, appels réseau vers api/sync, fusion.
import type { Progress } from '@/lib/types';
import { ProgressSchema } from '@/lib/schema';
import { merge } from '@/lib/merge';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 caractères, sans 0/O/1/I
const CODE_LENGTH = 12;
const MAX_BODY_BYTES = 200_000;
const FETCH_TIMEOUT_MS = 10_000;

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

/** `Progress.syncCode` ne doit jamais quitter l'appareil : le serveur ne le voit jamais. */
function withoutSyncCode(p: Progress): Progress {
  const { syncCode: _dropped, ...rest } = p;
  return rest;
}

function withTimeout(init: RequestInit = {}): RequestInit {
  return { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) };
}

function isTimeout(e: unknown): boolean {
  return e instanceof DOMException && (e.name === 'TimeoutError' || e.name === 'AbortError');
}

function statusError(status: number): string {
  if (status === 413) return 'Progression trop grosse pour synchroniser.';
  if (status === 429) return 'Trop de synchros récentes, réessaie dans un instant.';
  if (status === 409) return 'Synchro concurrente, réessaie.';
  if (status === 400) return "Version de l'app périmée : ferme et rouvre l'app.";
  if (status === 502) return 'Stockage de synchro indisponible, réessaie plus tard.';
  return `Erreur serveur (${status}).`;
}

type SyncResult = { ok: true; progress: Progress } | { ok: false; error: string };

/**
 * Vérifie qu'un code existe déjà côté serveur, sans rien modifier. À utiliser
 * par l'écran "Entrer un code" avant de l'assigner à `progress.syncCode`, pour
 * donner une erreur claire sur une faute de frappe plutôt qu'activer un
 * nouveau code vide par accident.
 */
export async function checkSyncCode(code: string): Promise<{ ok: true; exists: boolean } | { ok: false; error: string }> {
  let key: string;
  try {
    key = await hashCode(code);
  } catch {
    return { ok: false, error: 'Impossible de calculer la clé de synchro.' };
  }
  try {
    const res = await fetch('/api/sync', withTimeout({ headers: { 'X-Sync-Key': key } }));
    if (res.status === 404) return { ok: true, exists: false };
    if (res.ok) return { ok: true, exists: true };
    return { ok: false, error: statusError(res.status) };
  } catch (e) {
    if (isTimeout(e)) return { ok: false, error: 'Réseau trop lent : réessaie plus tard.' };
    return { ok: false, error: 'Hors ligne : impossible de vérifier ce code.' };
  }
}

/**
 * Synchronise `p` avec le serveur : GET l'état distant, fusionne, PUT le
 * résultat. `p.syncCode` doit être défini. Sans réseau, ou si le blob dépasse
 * la limite, l'appelant garde l'état local tel quel (aucune donnée perdue).
 * `p.syncCode` n'est jamais envoyé au serveur ; il est réappliqué sur le
 * résultat localement.
 */
export async function syncNow(p: Progress): Promise<SyncResult> {
  if (!p.syncCode) return { ok: false, error: 'Aucun code de synchro actif.' };
  const syncCode = p.syncCode;

  if (new TextEncoder().encode(JSON.stringify(p)).length > MAX_BODY_BYTES) {
    return { ok: false, error: 'Progression trop grosse pour synchroniser.' };
  }

  let key: string;
  try {
    key = await hashCode(syncCode);
  } catch {
    return { ok: false, error: 'Impossible de calculer la clé de synchro.' };
  }

  let merged = p;
  try {
    const getRes = await fetch('/api/sync', withTimeout({ headers: { 'X-Sync-Key': key } }));
    if (getRes.ok) {
      let remoteJson: unknown;
      try {
        remoteJson = await getRes.json();
      } catch {
        return { ok: false, error: 'Réponse du serveur illisible.' };
      }
      const parsed = ProgressSchema.safeParse(remoteJson);
      if (!parsed.success) {
        // Le serveur a une progression que ce client ne sait plus lire (contrat
        // plus récent) : ne pas fusionner à l'aveugle, ni écraser en silence.
        return { ok: false, error: "Version de l'app périmée : ferme et rouvre l'app." };
      }
      merged = merge(p, parsed.data);
    } else if (getRes.status !== 404) {
      return { ok: false, error: statusError(getRes.status) };
    }
    // 404 : rien côté serveur pour ce code pour l'instant — première synchro, on pousse l'état local.

    const putRes = await fetch(
      '/api/sync',
      withTimeout({
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'X-Sync-Key': key },
        body: JSON.stringify(withoutSyncCode(merged)),
      }),
    );
    if (!putRes.ok) return { ok: false, error: statusError(putRes.status) };

    try {
      const serverJson: unknown = await putRes.json();
      const parsedServer = ProgressSchema.safeParse(serverJson);
      if (parsedServer.success) merged = merge(merged, parsedServer.data);
      // sinon : l'écriture a réussi (200) mais la réponse est mal formée — on
      // garde `merged`, déjà écrit côté serveur puisque le PUT a réussi.
    } catch {
      // idem : l'écriture a réussi, seule la relecture de la réponse a échoué.
    }
  } catch (e) {
    if (isTimeout(e)) return { ok: false, error: 'Réseau trop lent : la synchro reprendra plus tard.' };
    return { ok: false, error: 'Hors ligne : la synchro reprendra à la reconnexion.' };
  }

  return { ok: true, progress: { ...merged, syncCode } };
}
