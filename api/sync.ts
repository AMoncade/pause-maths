// Propriété du lot PWA. Fonction Vercel (Node) : GET/PUT d'un blob de progression
// par clé = SHA-256(code de synchro), envoyée en en-tête X-Sync-Key (jamais en
// query string, pour ne pas finir dans des logs de proxy). Le serveur ne stocke
// et ne renvoie jamais Progress.syncCode : il est retiré du corps avant fusion,
// avant écriture et avant réponse.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put, BlobError, BlobPreconditionFailedError } from '@vercel/blob';
import type { Progress } from '../src/lib/types';
// Extension .js explicite : Vercel transpile ce fichier isolément (pas de bundle),
// et le loader ESM de Node en production n'ajoute pas d'extension automatiquement
// (contrairement à Vite/tsc en mode bundler) — sans elle, "Cannot find module"
// au runtime alors même que le .js compilé existe. Vite/tsc "bundler" acceptent
// un import .js qui résout vers le .ts source, donc ça marche aussi en local.
import { ProgressSchema } from '../src/lib/schema.js';
import { migrate } from '../src/lib/progress.js';
import { merge } from '../src/lib/merge.js';

const MAX_BODY_BYTES = 200_000;
const KEY_RE = /^[0-9a-f]{64}$/;
const MAX_PUT_ATTEMPTS = 3;

// Rate limit basique, en mémoire par instance (best-effort : une instance froide
// repart à zéro, ce n'est pas une garantie stricte ; plusieurs instances actives
// en parallèle ont chacune leur propre compteur). Indexé par clé ET par IP — un
// GET seul (gratuit à appeler) est aussi couvert, pas seulement le PUT. Les Map
// sont purgées au-delà de MAX_TRACKED_ENTRIES pour ne pas grossir sans borne.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_KEY = 20;
const RATE_LIMIT_MAX_PER_IP = 60;
const NEW_KEY_MAX_PER_IP_PER_HOUR = 5;
const HOUR_MS = 60 * 60_000;
const MAX_TRACKED_ENTRIES = 1000;

const hitsByKey = new Map<string, number[]>();
const hitsByIp = new Map<string, number[]>();
const newKeysByIp = new Map<string, number[]>();

function prune(map: Map<string, number[]>): void {
  const excess = map.size - MAX_TRACKED_ENTRIES;
  if (excess <= 0) return;
  const it = map.keys();
  for (let i = 0; i < excess; i++) {
    const k = it.next().value;
    if (k !== undefined) map.delete(k);
  }
}

/** Incrémente le compteur glissant de `id` et renvoie le nombre d'appels dans la fenêtre. */
function bump(map: Map<string, number[]>, id: string, windowMs: number): number {
  const now = Date.now();
  const recent = (map.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  map.set(id, recent);
  prune(map);
  return recent.length;
}

function clientIp(req: VercelRequest): string {
  const fwdHeader = req.headers['x-forwarded-for'];
  const fwd = Array.isArray(fwdHeader) ? fwdHeader[0] : fwdHeader;
  if (fwd) return fwd.split(',')[0]!.trim();
  const realHeader = req.headers['x-real-ip'];
  const real = Array.isArray(realHeader) ? realHeader[0] : realHeader;
  return real?.trim() ?? 'inconnue';
}

class ConflictError extends Error {}
class TooLargeError extends Error {}

type ReadResult =
  | { status: 'absent' }
  | { status: 'ok'; progress: Progress; etag: string }
  | { status: 'unreadable'; raw: string; etag: string };

/** `syncCode` ne doit jamais être stocké ni renvoyé par le serveur. */
function withoutSyncCode(p: Progress): Progress {
  const { syncCode: _dropped, ...rest } = p;
  return rest;
}

/**
 * `useCache: false` : lit toujours l'origine, jamais le cache CDN — sinon un GET
 * juste après un PUT concurrent peut renvoyer un etag périmé et invalider les
 * comparaisons ifMatch qui suivent.
 */
async function readStoredProgress(pathname: string): Promise<ReadResult> {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return { status: 'absent' };
  const text = await new Response(result.stream).text();
  const etag = result.blob.etag;

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { status: 'unreadable', raw: text, etag };
  }
  const migrated = migrate(data);
  const validated = migrated === undefined ? undefined : ProgressSchema.safeParse(migrated);
  if (validated?.success) return { status: 'ok', progress: withoutSyncCode(validated.data), etag };
  return { status: 'unreadable', raw: text, etag };
}

/**
 * Un blob illisible (schéma changé, corruption) n'est jamais écrasé en silence :
 * le brut part dans une copie avant toute nouvelle écriture à ce chemin.
 */
async function backupUnreadable(pathname: string, raw: string): Promise<void> {
  const backupPath = pathname.replace(/\.json$/, `.backup-${Date.now()}.json`);
  try {
    await put(backupPath, raw, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
  } catch {
    // best-effort : une sauvegarde ratée ne doit pas bloquer l'écriture principale
  }
}

function isCasConflict(e: unknown): boolean {
  if (e instanceof BlobPreconditionFailedError) return true;
  return e instanceof BlobError && /already exists|precondition|etag/i.test(e.message);
}

/**
 * Lit, fusionne, écrit sous condition (ifMatch de l'etag lu, ou "pas d'écrasement"
 * si rien n'existait). Sur conflit (une autre requête a écrit entre-temps) : relit
 * l'état réel et réessaie, jusqu'à MAX_PUT_ATTEMPTS.
 */
async function writeWithRetry(pathname: string, incoming: Progress, firstRead: ReadResult): Promise<Progress> {
  let read = firstRead;
  for (let attempt = 1; ; attempt++) {
    let base: Progress | null = null;
    let etag: string | undefined;
    if (read.status === 'ok') {
      base = read.progress;
      etag = read.etag;
    } else if (read.status === 'unreadable') {
      await backupUnreadable(pathname, read.raw);
      etag = read.etag; // le blob existe toujours : il faut son etag pour l'écraser
    }

    const merged = base ? merge(base, incoming) : incoming;
    if (Buffer.byteLength(JSON.stringify(merged)) > MAX_BODY_BYTES) throw new TooLargeError();

    try {
      if (etag) {
        await put(pathname, JSON.stringify(merged), {
          access: 'private',
          addRandomSuffix: false,
          contentType: 'application/json',
          allowOverwrite: true,
          ifMatch: etag,
        });
      } else {
        await put(pathname, JSON.stringify(merged), {
          access: 'private',
          addRandomSuffix: false,
          contentType: 'application/json',
          allowOverwrite: false,
        });
      }
      return merged;
    } catch (e) {
      if (!isCasConflict(e)) throw e;
      if (attempt >= MAX_PUT_ATTEMPTS) throw new ConflictError();
      read = await readStoredProgress(pathname);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const keyHeader = req.headers['x-sync-key'];
  const key = typeof keyHeader === 'string' ? keyHeader : '';
  if (!KEY_RE.test(key)) {
    res.status(400).json({ error: 'Clé invalide.' });
    return;
  }

  const ip = clientIp(req);
  if (bump(hitsByIp, ip, RATE_LIMIT_WINDOW_MS) > RATE_LIMIT_MAX_PER_IP) {
    res.status(429).json({ error: 'Trop de requêtes depuis cette adresse, réessaie dans un instant.' });
    return;
  }

  const pathname = `sync/${key}.json`;

  if (req.method === 'GET') {
    try {
      const stored = await readStoredProgress(pathname);
      if (stored.status === 'absent') {
        res.status(404).json({ error: 'Aucune progression pour ce code.' });
        return;
      }
      if (stored.status === 'unreadable') {
        res.status(422).json({ error: "Progression illisible côté serveur (format trop ancien) : réessaie une synchro, elle sera réparée." });
        return;
      }
      res.status(200).json(stored.progress);
    } catch {
      res.status(502).json({ error: 'Stockage de synchro indisponible, réessaie plus tard.' });
    }
    return;
  }

  if (req.method === 'PUT') {
    if (bump(hitsByKey, key, RATE_LIMIT_WINDOW_MS) > RATE_LIMIT_MAX_PER_KEY) {
      res.status(429).json({ error: 'Trop de synchros récentes, réessaie dans un instant.' });
      return;
    }

    // Content-Length absent ou invalide → Number() vaut 0/NaN et ce contrôle ne
    // rejette rien ; la mesure réelle juste après (sur le corps déjà parsé) est
    // le filet qui compte. Celui-ci n'est qu'un rejet rapide avant tout parsing.
    const contentLength = Number(req.headers['content-length'] ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      res.status(413).json({ error: 'Progression trop grosse.' });
      return;
    }

    const incoming: unknown = req.body;
    if (Buffer.byteLength(JSON.stringify(incoming ?? {})) > MAX_BODY_BYTES) {
      res.status(413).json({ error: 'Progression trop grosse.' });
      return;
    }
    const parsedIncoming = ProgressSchema.safeParse(incoming);
    if (!parsedIncoming.success) {
      res.status(400).json({ error: "Version de l'app périmée : ferme et rouvre l'app." });
      return;
    }
    const incomingNoCode = withoutSyncCode(parsedIncoming.data);

    try {
      const firstRead = await readStoredProgress(pathname);
      if (firstRead.status === 'absent' && bump(newKeysByIp, ip, HOUR_MS) > NEW_KEY_MAX_PER_IP_PER_HOUR) {
        res.status(429).json({ error: 'Trop de nouveaux codes créés depuis cette adresse, réessaie plus tard.' });
        return;
      }
      const merged = await writeWithRetry(pathname, incomingNoCode, firstRead);
      res.status(200).json(merged);
    } catch (e) {
      if (e instanceof TooLargeError) {
        res.status(413).json({ error: 'Progression trop grosse.' });
      } else if (e instanceof ConflictError) {
        res.status(409).json({ error: 'Synchro concurrente, réessaie.' });
      } else {
        res.status(502).json({ error: 'Stockage de synchro indisponible, réessaie plus tard.' });
      }
    }
    return;
  }

  res.setHeader('Allow', 'GET, PUT');
  res.status(405).json({ error: 'Méthode non supportée.' });
}
